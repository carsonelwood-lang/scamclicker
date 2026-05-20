
CREATE TABLE public.rarities (
  id text PRIMARY KEY,
  label text NOT NULL,
  color text NOT NULL DEFAULT 'text-gray-300',
  mult numeric NOT NULL DEFAULT 1,
  weight numeric NOT NULL DEFAULT 1,
  sell_gems numeric NOT NULL DEFAULT 1,
  sort_order int NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE public.pets_catalog (
  id text PRIMARY KEY,
  name text NOT NULL,
  icon text NOT NULL DEFAULT '🐾',
  rarity_id text NOT NULL REFERENCES public.rarities(id) ON DELETE CASCADE,
  sort_order int NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.rarities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pets_catalog ENABLE ROW LEVEL SECURITY;

CREATE POLICY "rarities readable by all" ON public.rarities FOR SELECT USING (true);
CREATE POLICY "admins insert rarities" ON public.rarities FOR INSERT WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "admins update rarities" ON public.rarities FOR UPDATE USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "admins delete rarities" ON public.rarities FOR DELETE USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "pets readable by all" ON public.pets_catalog FOR SELECT USING (true);
CREATE POLICY "admins insert pets" ON public.pets_catalog FOR INSERT WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "admins update pets" ON public.pets_catalog FOR UPDATE USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "admins delete pets" ON public.pets_catalog FOR DELETE USING (public.has_role(auth.uid(), 'admin'));

ALTER PUBLICATION supabase_realtime ADD TABLE public.rarities;
ALTER PUBLICATION supabase_realtime ADD TABLE public.pets_catalog;

-- Seed rarities
INSERT INTO public.rarities (id, label, color, mult, weight, sell_gems, sort_order) VALUES
  ('common',    'Common',    'text-gray-300',   1.05, 50,  1,   1),
  ('uncommon',  'Uncommon',  'text-green-400',  1.15, 25,  3,   2),
  ('rare',      'Rare',      'text-blue-400',   1.30, 13,  8,   3),
  ('epic',      'Epic',      'text-purple-400', 1.60, 7,   20,  4),
  ('legendary', 'Legendary', 'text-yellow-400', 2.25, 3,   60,  5),
  ('mythic',    'Mythic',    'text-pink-400',   3.50, 1.5, 200, 6),
  ('godly',     'GODLY',     'text-red-400',    6.00, 0.5, 750, 7);

-- Seed pets
INSERT INTO public.pets_catalog (id, name, icon, rarity_id, sort_order) VALUES
  ('rat','Sewer Rat','🐀','common',1),
  ('pigeon','City Pigeon','🐦','common',2),
  ('fly','Spam Fly','🪰','common',3),
  ('snail','Lag Snail','🐌','common',4),
  ('ant','Worker Ant','🐜','common',5),
  ('frog','Meme Frog','🐸','common',6),
  ('cat','Scam Cat','🐈','uncommon',7),
  ('dog','Bork Coin Dog','🐕','uncommon',8),
  ('parrot','Phishing Parrot','🦜','uncommon',9),
  ('rabbit','MLM Rabbit','🐇','uncommon',10),
  ('owl','Night Trader Owl','🦉','uncommon',11),
  ('fox','Sly Fox','🦊','rare',12),
  ('raccoon','Trash Raccoon','🦝','rare',13),
  ('shark','Loan Shark','🦈','rare',14),
  ('octopus','Lobby Octopus','🐙','rare',15),
  ('bear','Bear Market','🐻','rare',16),
  ('tiger','Pyramid Tiger','🐅','epic',17),
  ('wolf','Wall St. Wolf','🐺','epic',18),
  ('octa','Hedge Eagle','🦅','epic',19),
  ('snake','Silver Tongue','🐍','epic',20),
  ('scorpion','Tax Scorpion','🦂','epic',21),
  ('dragon','ICO Dragon','🐉','legendary',22),
  ('unicorn','Startup Unicorn','🦄','legendary',23),
  ('phoenix','Rugpull Phoenix','🔥','legendary',24),
  ('kraken','Market Kraken','🦑','legendary',25),
  ('alien_pet','Galactic Grifter','👾','mythic',26),
  ('demon_pet','Soul Broker','👹','mythic',27),
  ('ghost','Ghost of Ponzi','👻','mythic',28),
  ('lizardking','Lizard King','🦎','godly',29),
  ('voidcat','Cosmic Cat','🌠','godly',30),
  ('moneygod','Money God','💰','godly',31);
