-- ============================================================
-- RLS & Database Optimization
-- Issue #25: Supabase RLS・データベース最適化
-- ============================================================

-- ============================================================
-- 1. Missing RLS Policy: users DELETE
-- The account delete API route needs to delete from public.users
-- ============================================================
CREATE POLICY "users_delete_own"
  ON public.users FOR DELETE
  USING (auth.uid() = id);

-- ============================================================
-- 2. Additional Index: expenses.receipt_id
-- FK lookup optimization for the expenses -> receipts join
-- ============================================================
CREATE INDEX idx_expenses_receipt_id ON public.expenses (receipt_id) WHERE receipt_id IS NOT NULL;

-- ============================================================
-- 3. Stripe customer ID column on users
-- Avoids repeated customer lookups via Stripe API
-- ============================================================
ALTER TABLE public.users
  ADD COLUMN stripe_customer_id TEXT;

CREATE UNIQUE INDEX idx_users_stripe_customer_id
  ON public.users (stripe_customer_id)
  WHERE stripe_customer_id IS NOT NULL;

COMMENT ON COLUMN public.users.stripe_customer_id IS 'Stripe Customer ID (cus_xxx)';
