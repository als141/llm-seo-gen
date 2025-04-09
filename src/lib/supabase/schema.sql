-- ユーザープロファイルテーブル
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users ON DELETE CASCADE,
  user_id TEXT NOT NULL UNIQUE,  -- Clerk user ID
  email TEXT UNIQUE,
  full_name TEXT,
  avatar_url TEXT,
  updated_at TIMESTAMPTZ DEFAULT now(),
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Row Level Security (RLS) の設定
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "ユーザーは自分のプロファイルを閲覧できる" ON public.profiles
  FOR SELECT USING (auth.jwt()->>'sub' = user_id);
  
CREATE POLICY "ユーザーは自分のプロファイルを更新できる" ON public.profiles
  FOR UPDATE USING (auth.jwt()->>'sub' = user_id);

-- サブスクリプションテーブル
CREATE TABLE IF NOT EXISTS public.subscriptions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id TEXT NOT NULL REFERENCES public.profiles(user_id) ON DELETE CASCADE,
  status TEXT NOT NULL,
  price_id TEXT NOT NULL,
  quantity INTEGER NOT NULL,
  cancel_at_period_end BOOLEAN DEFAULT FALSE,
  cancel_at TIMESTAMPTZ,
  canceled_at TIMESTAMPTZ,
  current_period_start TIMESTAMPTZ,
  current_period_end TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  ended_at TIMESTAMPTZ,
  trial_start TIMESTAMPTZ,
  trial_end TIMESTAMPTZ,
  stripe_subscription_id TEXT UNIQUE
);

-- サブスクリプションに対するRLSポリシー
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "ユーザーは自分のサブスクリプションを閲覧できる" ON public.subscriptions
  FOR SELECT USING (auth.jwt()->>'sub' = user_id);

-- 製品テーブル
CREATE TABLE IF NOT EXISTS public.products (
  id TEXT PRIMARY KEY,
  active BOOLEAN,
  name TEXT,
  description TEXT,
  image TEXT,
  metadata JSONB
);

-- 製品に対するRLSポリシー
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

CREATE POLICY "全ユーザーが製品を閲覧できる" ON public.products
  FOR SELECT USING (true);

-- 価格テーブル
CREATE TABLE IF NOT EXISTS public.prices (
  id TEXT PRIMARY KEY,
  product_id TEXT REFERENCES public.products(id),
  active BOOLEAN,
  description TEXT,
  unit_amount INTEGER,
  currency TEXT,
  type TEXT,
  interval TEXT,
  interval_count INTEGER,
  trial_period_days INTEGER,
  metadata JSONB
);

-- 価格に対するRLSポリシー
ALTER TABLE public.prices ENABLE ROW LEVEL SECURITY;

CREATE POLICY "全ユーザーが価格を閲覧できる" ON public.prices
  FOR SELECT USING (true);

-- カスタマーテーブル
CREATE TABLE IF NOT EXISTS public.customers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id TEXT UNIQUE REFERENCES public.profiles(user_id) ON DELETE CASCADE,
  stripe_customer_id TEXT UNIQUE
);

-- カスタマーに対するRLSポリシー
ALTER TABLE public.customers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "ユーザーは自分のカスタマー情報を閲覧できる" ON public.customers
  FOR SELECT USING (auth.jwt()->>'sub' = user_id);
