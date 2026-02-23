-- ============================================================
-- 副楽（フクラク）初期スキーマ
-- ============================================================

-- ============================================================
-- 1. users テーブル
-- auth.users とリンクするプロフィール情報
-- ============================================================
CREATE TABLE public.users (
  id          UUID        PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email       TEXT        NOT NULL,
  display_name TEXT,
  plan        TEXT        NOT NULL DEFAULT 'free'
                          CHECK (plan IN ('free', 'basic', 'pro', 'season')),
  -- 無料プラン: 年間10件まで
  -- ベーシック: 月額980円 100件/年・AI-OCR・CSV出力
  -- プロ: 月額1,480円 無制限・全機能
  -- シーズンパス: 2,980円 1〜3月限定
  income_count_year  INT NOT NULL DEFAULT 0,  -- 当年の収入登録件数
  expense_count_year INT NOT NULL DEFAULT 0,  -- 当年の経費登録件数
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

COMMENT ON TABLE public.users IS 'ユーザープロフィール・プラン情報';
COMMENT ON COLUMN public.users.plan IS 'free | basic | pro | season';

-- ============================================================
-- 2. incomes テーブル
-- 副業収入記録
-- ============================================================
CREATE TABLE public.incomes (
  id          UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID        NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  date        DATE        NOT NULL,
  amount      INTEGER     NOT NULL CHECK (amount > 0), -- 円単位
  source      TEXT        NOT NULL,  -- 取引先・収入源（例: クラウドワークス）
  category    TEXT        NOT NULL DEFAULT 'その他'
                          CHECK (category IN (
                            'フリーランス', 'アフィリエイト', '転売・せどり',
                            'YouTube・動画', '株・投資', '不動産', 'その他'
                          )),
  memo        TEXT,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

COMMENT ON TABLE public.incomes IS '副業収入記録';
COMMENT ON COLUMN public.incomes.amount IS '金額（円単位、整数）';
COMMENT ON COLUMN public.incomes.category IS '副業カテゴリ';

-- ============================================================
-- 3. expenses テーブル
-- 経費記録
-- ============================================================
CREATE TABLE public.expenses (
  id          UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID        NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  date        DATE        NOT NULL,
  amount      INTEGER     NOT NULL CHECK (amount > 0), -- 円単位
  category    TEXT        NOT NULL DEFAULT 'その他'
                          CHECK (category IN (
                            '通信費', '消耗品費', '接待交際費', '交通費',
                            '広告宣伝費', '外注費', '研修費', '地代家賃', 'その他'
                          )),
  description TEXT        NOT NULL, -- 経費の説明
  memo        TEXT,
  receipt_id  UUID,       -- receipts テーブルへの参照（nullable）
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

COMMENT ON TABLE public.expenses IS '経費記録（確定申告用）';
COMMENT ON COLUMN public.expenses.category IS '経費科目（勘定科目）';

-- ============================================================
-- 4. receipts テーブル
-- レシート画像メタデータ・OCR結果
-- ============================================================
CREATE TABLE public.receipts (
  id              UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         UUID        NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  storage_path    TEXT        NOT NULL,  -- Supabase Storage パス: receipts/{user_id}/{filename}
  ocr_status      TEXT        NOT NULL DEFAULT 'pending'
                              CHECK (ocr_status IN ('pending', 'processing', 'done', 'error')),
  ocr_result      JSONB,      -- GPT-4o Vision の解析結果
  -- 例: { "date": "2024-01-15", "amount": 1500, "vendor": "セブンイレブン", "category": "消耗品費" }
  extracted_date   DATE,      -- OCR で抽出した日付
  extracted_amount INTEGER,   -- OCR で抽出した金額（円）
  extracted_vendor TEXT,      -- OCR で抽出した店舗・取引先
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

COMMENT ON TABLE public.receipts IS 'レシート画像メタデータ・GPT-4o Vision OCR結果';
COMMENT ON COLUMN public.receipts.storage_path IS 'Supabase Storage パス: receipts/{user_id}/{filename}';
COMMENT ON COLUMN public.receipts.ocr_result IS 'GPT-4o Vision の解析結果 JSON';

-- expenses.receipt_id に外部キー制約を追加（相互参照のため後付け）
ALTER TABLE public.expenses
  ADD CONSTRAINT expenses_receipt_id_fkey
  FOREIGN KEY (receipt_id) REFERENCES public.receipts(id) ON DELETE SET NULL;

-- ============================================================
-- インデックス
-- ============================================================
CREATE INDEX idx_incomes_user_id_date  ON public.incomes  (user_id, date DESC);
CREATE INDEX idx_expenses_user_id_date ON public.expenses (user_id, date DESC);
CREATE INDEX idx_receipts_user_id      ON public.receipts (user_id, created_at DESC);
CREATE INDEX idx_receipts_ocr_status   ON public.receipts (ocr_status) WHERE ocr_status = 'pending';

-- ============================================================
-- updated_at 自動更新トリガー
-- ============================================================
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE TRIGGER users_updated_at
  BEFORE UPDATE ON public.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER incomes_updated_at
  BEFORE UPDATE ON public.incomes
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER expenses_updated_at
  BEFORE UPDATE ON public.expenses
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER receipts_updated_at
  BEFORE UPDATE ON public.receipts
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- ============================================================
-- auth.users → public.users 自動プロフィール作成トリガー
-- 新規ユーザーサインアップ時に自動的にプロフィール行を作成
-- ============================================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  INSERT INTO public.users (id, email, display_name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(
      NEW.raw_user_meta_data ->> 'full_name',
      NEW.raw_user_meta_data ->> 'name',
      split_part(NEW.email, '@', 1)
    )
  );
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============================================================
-- RLS（Row Level Security）有効化
-- ============================================================
ALTER TABLE public.users    ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.incomes  ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.expenses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.receipts ENABLE ROW LEVEL SECURITY;

-- ============================================================
-- RLS ポリシー: users
-- ============================================================
CREATE POLICY "users_select_own"
  ON public.users FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "users_update_own"
  ON public.users FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- INSERT はトリガー経由（SECURITY DEFINER）のみ
-- クライアントからの直接 INSERT は禁止

-- ============================================================
-- RLS ポリシー: incomes
-- ============================================================
CREATE POLICY "incomes_select_own"
  ON public.incomes FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "incomes_insert_own"
  ON public.incomes FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "incomes_update_own"
  ON public.incomes FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "incomes_delete_own"
  ON public.incomes FOR DELETE
  USING (auth.uid() = user_id);

-- ============================================================
-- RLS ポリシー: expenses
-- ============================================================
CREATE POLICY "expenses_select_own"
  ON public.expenses FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "expenses_insert_own"
  ON public.expenses FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "expenses_update_own"
  ON public.expenses FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "expenses_delete_own"
  ON public.expenses FOR DELETE
  USING (auth.uid() = user_id);

-- ============================================================
-- RLS ポリシー: receipts
-- ============================================================
CREATE POLICY "receipts_select_own"
  ON public.receipts FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "receipts_insert_own"
  ON public.receipts FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "receipts_update_own"
  ON public.receipts FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "receipts_delete_own"
  ON public.receipts FOR DELETE
  USING (auth.uid() = user_id);
