-- オンボーディング関連カラムを users テーブルに追加
ALTER TABLE public.users
  ADD COLUMN onboarding_completed  BOOLEAN   NOT NULL DEFAULT false,
  ADD COLUMN side_job_type         TEXT,
  ADD COLUMN side_job_start_year   SMALLINT,
  ADD COLUMN annual_income_range   TEXT;
