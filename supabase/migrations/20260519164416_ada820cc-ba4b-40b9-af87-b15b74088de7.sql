
-- Pets inventory: each row is one pet instance owned by a user
CREATE TABLE public.user_pets (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id uuid NOT NULL,
  pet_id text NOT NULL,
  acquired_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX user_pets_owner_idx ON public.user_pets(owner_id);

ALTER TABLE public.user_pets ENABLE ROW LEVEL SECURITY;

CREATE POLICY "pets readable by all" ON public.user_pets FOR SELECT USING (true);
CREATE POLICY "users insert own pets" ON public.user_pets FOR INSERT WITH CHECK (auth.uid() = owner_id);
CREATE POLICY "owner or admin update" ON public.user_pets FOR UPDATE USING (auth.uid() = owner_id OR has_role(auth.uid(), 'admin'));
CREATE POLICY "owner or admin delete" ON public.user_pets FOR DELETE USING (auth.uid() = owner_id OR has_role(auth.uid(), 'admin'));

-- Equipped pets stored on profile
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS equipped_pets jsonb NOT NULL DEFAULT '[]'::jsonb;

-- Trades: from_user offers their pet, optionally requests one of to_user's pets
CREATE TABLE public.pet_trades (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  from_user uuid NOT NULL,
  to_user uuid NOT NULL,
  offered_pet_id uuid NOT NULL,
  requested_pet_id uuid,
  status text NOT NULL DEFAULT 'pending',
  created_at timestamptz NOT NULL DEFAULT now(),
  responded_at timestamptz
);
CREATE INDEX pet_trades_to_idx ON public.pet_trades(to_user, status);
CREATE INDEX pet_trades_from_idx ON public.pet_trades(from_user, status);

ALTER TABLE public.pet_trades ENABLE ROW LEVEL SECURITY;

CREATE POLICY "trade visible to parties" ON public.pet_trades FOR SELECT USING (auth.uid() = from_user OR auth.uid() = to_user OR has_role(auth.uid(), 'admin'));
CREATE POLICY "users create own trades" ON public.pet_trades FOR INSERT WITH CHECK (auth.uid() = from_user);
CREATE POLICY "parties update trade" ON public.pet_trades FOR UPDATE USING (auth.uid() = from_user OR auth.uid() = to_user);

-- Function to atomically accept a trade: swaps pet ownership, marks trade accepted
CREATE OR REPLACE FUNCTION public.accept_pet_trade(_trade_id uuid)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  t public.pet_trades%ROWTYPE;
  caller uuid := auth.uid();
BEGIN
  SELECT * INTO t FROM public.pet_trades WHERE id = _trade_id FOR UPDATE;
  IF NOT FOUND THEN RETURN jsonb_build_object('ok', false, 'error', 'trade not found'); END IF;
  IF t.status <> 'pending' THEN RETURN jsonb_build_object('ok', false, 'error', 'trade not pending'); END IF;
  IF caller <> t.to_user THEN RETURN jsonb_build_object('ok', false, 'error', 'not your trade'); END IF;

  -- verify offered pet still belongs to from_user
  IF NOT EXISTS (SELECT 1 FROM public.user_pets WHERE id = t.offered_pet_id AND owner_id = t.from_user) THEN
    UPDATE public.pet_trades SET status = 'invalid', responded_at = now() WHERE id = _trade_id;
    RETURN jsonb_build_object('ok', false, 'error', 'offered pet gone');
  END IF;

  -- if requested pet, verify it still belongs to to_user
  IF t.requested_pet_id IS NOT NULL THEN
    IF NOT EXISTS (SELECT 1 FROM public.user_pets WHERE id = t.requested_pet_id AND owner_id = t.to_user) THEN
      UPDATE public.pet_trades SET status = 'invalid', responded_at = now() WHERE id = _trade_id;
      RETURN jsonb_build_object('ok', false, 'error', 'requested pet gone');
    END IF;
    -- swap
    UPDATE public.user_pets SET owner_id = t.to_user WHERE id = t.offered_pet_id;
    UPDATE public.user_pets SET owner_id = t.from_user WHERE id = t.requested_pet_id;
  ELSE
    -- gift
    UPDATE public.user_pets SET owner_id = t.to_user WHERE id = t.offered_pet_id;
  END IF;

  UPDATE public.pet_trades SET status = 'accepted', responded_at = now() WHERE id = _trade_id;
  RETURN jsonb_build_object('ok', true);
END;
$$;

GRANT EXECUTE ON FUNCTION public.accept_pet_trade(uuid) TO anon, authenticated;

ALTER PUBLICATION supabase_realtime ADD TABLE public.user_pets;
ALTER PUBLICATION supabase_realtime ADD TABLE public.pet_trades;
