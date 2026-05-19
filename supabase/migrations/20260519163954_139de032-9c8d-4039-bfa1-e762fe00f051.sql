
-- Add currencies and moderation flags
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS gems numeric NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS tokens numeric NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS muted boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS banned boolean NOT NULL DEFAULT false;

-- Admin shop items
CREATE TABLE IF NOT EXISTS public.admin_shop_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text NOT NULL DEFAULT '',
  icon text NOT NULL DEFAULT '🎁',
  price numeric NOT NULL DEFAULT 0,
  currency text NOT NULL DEFAULT 'points' CHECK (currency IN ('points','gems','tokens')),
  stock integer NOT NULL DEFAULT 0,
  effect_kind text NOT NULL DEFAULT 'points' CHECK (effect_kind IN ('points','gems','tokens','upgrade_all','godmode_5min')),
  effect_amount numeric NOT NULL DEFAULT 0,
  active boolean NOT NULL DEFAULT true,
  created_by uuid NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.admin_shop_items ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "shop items readable by all" ON public.admin_shop_items;
CREATE POLICY "shop items readable by all"
  ON public.admin_shop_items FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "admins insert shop items" ON public.admin_shop_items;
CREATE POLICY "admins insert shop items"
  ON public.admin_shop_items FOR INSERT
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

DROP POLICY IF EXISTS "admins update shop items" ON public.admin_shop_items;
CREATE POLICY "admins update shop items"
  ON public.admin_shop_items FOR UPDATE
  USING (public.has_role(auth.uid(), 'admin'));

DROP POLICY IF EXISTS "admins delete shop items" ON public.admin_shop_items;
CREATE POLICY "admins delete shop items"
  ON public.admin_shop_items FOR DELETE
  USING (public.has_role(auth.uid(), 'admin'));

-- Purchase log
CREATE TABLE IF NOT EXISTS public.shop_purchases (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  item_id uuid NOT NULL REFERENCES public.admin_shop_items(id) ON DELETE CASCADE,
  item_name text NOT NULL,
  price_paid numeric NOT NULL,
  currency text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.shop_purchases ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "users see own purchases" ON public.shop_purchases;
CREATE POLICY "users see own purchases"
  ON public.shop_purchases FOR SELECT
  USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'));

DROP POLICY IF EXISTS "users insert own purchases" ON public.shop_purchases;
CREATE POLICY "users insert own purchases"
  ON public.shop_purchases FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Realtime
ALTER PUBLICATION supabase_realtime ADD TABLE public.admin_shop_items;
