# Supabase Row Level Security 設定

## 1. RLS の基本概念

Row Level Security（RLS）は PostgreSQL のネイティブ機能で、テーブルの行レベルでアクセス制御を行います。
Supabase ではクライアントから直接 DB にアクセスする設計のため、RLS は必須のセキュリティレイヤーです。

**重要**: RLS が無効なテーブルは、anon キーを持つ誰でもすべてのデータにアクセスできます。

---

## 2. RLS 有効化の基本

```sql
-- すべてのテーブルで RLS を有効化する（必須）
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.incomes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.expenses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.receipts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tax_calculations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;

-- RLS が有効でもテーブルオーナー（postgres ロール）はバイパスできる
-- service_role キーも RLS をバイパスするため、サーバーサイドのみで使用すること
```

---

## 3. テーブル別 RLS ポリシー

### 3.1 users テーブル

```sql
-- ユーザーは自分のプロフィールのみ閲覧可能
CREATE POLICY "users_select_own"
  ON public.users
  FOR SELECT
  USING (auth.uid() = id);

-- ユーザーは自分のプロフィールのみ更新可能
CREATE POLICY "users_update_own"
  ON public.users
  FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- ユーザーの INSERT は auth.users トリガーで自動作成するため、
-- クライアントからの直接 INSERT は禁止
CREATE POLICY "users_insert_own"
  ON public.users
  FOR INSERT
  WITH CHECK (auth.uid() = id);

-- ユーザーの DELETE は管理機能経由のみ（通常は soft delete を推奨）
-- DELETE ポリシーは作成しない = クライアントからの削除は不可
```

### 3.2 incomes テーブル

```sql
-- 収入テーブル: ユーザーは自分のデータのみアクセス可能
CREATE POLICY "incomes_select_own"
  ON public.incomes
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "incomes_insert_own"
  ON public.incomes
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "incomes_update_own"
  ON public.incomes
  FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "incomes_delete_own"
  ON public.incomes
  FOR DELETE
  USING (auth.uid() = user_id);
```

### 3.3 expenses テーブル

```sql
-- 経費テーブル: ユーザーは自分のデータのみアクセス可能
CREATE POLICY "expenses_select_own"
  ON public.expenses
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "expenses_insert_own"
  ON public.expenses
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "expenses_update_own"
  ON public.expenses
  FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "expenses_delete_own"
  ON public.expenses
  FOR DELETE
  USING (auth.uid() = user_id);
```

### 3.4 receipts テーブル

```sql
-- レシートテーブル: ユーザーは自分のレシートのみアクセス可能
CREATE POLICY "receipts_select_own"
  ON public.receipts
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "receipts_insert_own"
  ON public.receipts
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "receipts_update_own"
  ON public.receipts
  FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "receipts_delete_own"
  ON public.receipts
  FOR DELETE
  USING (auth.uid() = user_id);
```

### 3.5 tax_calculations テーブル

```sql
-- 税金計算テーブル: ユーザーは自分の計算結果のみアクセス可能
CREATE POLICY "tax_calculations_select_own"
  ON public.tax_calculations
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "tax_calculations_insert_own"
  ON public.tax_calculations
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "tax_calculations_update_own"
  ON public.tax_calculations
  FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- 計算結果の削除は禁止（監査証跡として保持）
```

### 3.6 subscriptions テーブル

```sql
-- サブスクリプションテーブル: ユーザーは自分のサブスク情報のみ閲覧可能
CREATE POLICY "subscriptions_select_own"
  ON public.subscriptions
  FOR SELECT
  USING (auth.uid() = user_id);

-- INSERT/UPDATE は Stripe Webhook（service_role）経由のみ
-- クライアントからの直接変更は禁止
```

---

## 4. Supabase Storage の RLS（レシート画像）

```sql
-- Storage: receipts バケットのポリシー
-- ユーザーは自分のフォルダ配下のファイルのみ操作可能
-- ファイルパス形式: receipts/{user_id}/{filename}

CREATE POLICY "storage_receipts_select"
  ON storage.objects
  FOR SELECT
  USING (
    bucket_id = 'receipts'
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "storage_receipts_insert"
  ON storage.objects
  FOR INSERT
  WITH CHECK (
    bucket_id = 'receipts'
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "storage_receipts_update"
  ON storage.objects
  FOR UPDATE
  USING (
    bucket_id = 'receipts'
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "storage_receipts_delete"
  ON storage.objects
  FOR DELETE
  USING (
    bucket_id = 'receipts'
    AND auth.uid()::text = (storage.foldername(name))[1]
  );
```

---

## 5. RLS テスト方法

```sql
-- テスト用: 特定ユーザーとして RLS を検証
-- Supabase SQL Editor で実行

-- 1. テスト用ユーザーの JWT をセット
SELECT set_config('request.jwt.claims', '{"sub": "test-user-uuid-here"}', true);
SELECT set_config('role', 'authenticated', true);

-- 2. SELECT テスト（自分のデータのみ返るか確認）
SELECT * FROM public.incomes;

-- 3. 他ユーザーのデータへのアクセスを試行（0件になるべき）
SELECT * FROM public.incomes WHERE user_id = 'other-user-uuid';

-- 4. 他ユーザーの行の UPDATE を試行（影響行数 0 になるべき）
UPDATE public.incomes SET amount = 0 WHERE user_id = 'other-user-uuid';
```

---

## 6. Supabase Dashboard での RLS 確認手順

1. Supabase Dashboard にログイン
2. 左メニューの「Table Editor」を選択
3. 各テーブル名をクリック
4. 右上の「RLS」アイコンを確認（盾マークが緑色 = RLS 有効）
5. 「Policies」タブで設定済みポリシーを確認
6. 「Authentication > Policies」画面でも全テーブルのポリシーを一覧表示可能

---

## 7. RLS バイパスの危険性と対策

```typescript
// 危険: service_role キーはクライアントで絶対に使わない
// これは RLS をバイパスして全データにアクセスできてしまう
// BAD - クライアントサイド
import { createClient } from '@supabase/supabase-js'
const supabase = createClient(url, process.env.SUPABASE_SERVICE_ROLE_KEY!) // 絶対にやらない

// GOOD - サーバーサイドのみ（API Routes / Server Components）
// service_role キーはサーバーサイドでのみ使用
import { createClient } from '@supabase/supabase-js'
export function createServiceClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  )
}

// GOOD - クライアントサイド（anon キーを使用、RLS が適用される）
import { createBrowserClient } from '@supabase/ssr'
export function createBrowserSupabaseClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}
```
