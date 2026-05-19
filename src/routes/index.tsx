import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState, useRef, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { Session } from "@supabase/supabase-js";

export const Route = createFileRoute("/")({
  component: Index,
  head: () => ({
    meta: [
      { title: "Fake Scam Clicker — A Harmless Parody Game" },
      {
        name: "description",
        content:
          "A satirical cookie-clicker style game with global chat. No actual scamming — it's a joke.",
      },
    ],
  }),
});

type Upgrade = {
  id: string;
  name: string;
  desc: string;
  baseCost: number;
  cps: number;
  icon: string;
};

const UPGRADES: Upgrade[] = [
  { id: "popup", name: "Suspicious Pop-up", desc: "Definitely not a virus", baseCost: 15, cps: 0.2, icon: "🪟" },
  { id: "intern", name: "Unpaid Intern", desc: "Clicks the mouse for you", baseCost: 100, cps: 1.5, icon: "🧑‍💻" },
  { id: "bot", name: "Spam Bot", desc: "Sends 'Hello dear friend' emails", baseCost: 1100, cps: 8, icon: "🤖" },
  { id: "prince", name: "Nigerian Prince", desc: "He just needs your help, please", baseCost: 12000, cps: 47, icon: "👑" },
  { id: "crypto", name: "Crypto Bro", desc: "Trust me bro it's going to the moon", baseCost: 130000, cps: 260, icon: "🚀" },
  { id: "ai", name: "AI Influencer", desc: "Sells you a $999 course on AI", baseCost: 1400000, cps: 1400, icon: "🧠" },
  { id: "nft", name: "NFT Project", desc: "Right-click save? You wouldn't.", baseCost: 20000000, cps: 7800, icon: "🖼️" },
  { id: "rugpull", name: "Rug Pull DAO", desc: "Decentralized exit liquidity", baseCost: 330000000, cps: 44000, icon: "🪤" },
  { id: "ponzi", name: "Ponzi Pyramid", desc: "It's a 'community', okay?", baseCost: 5100000000, cps: 260000, icon: "🔺" },
  { id: "telemarketer", name: "Robo-Telemarketer", desc: "About your car's extended warranty", baseCost: 75000000000, cps: 1600000, icon: "📞" },
  { id: "phisher", name: "Phishing Farm", desc: "Click here to claim your prize", baseCost: 1000000000000, cps: 10000000, icon: "🎣" },
  { id: "shellco", name: "Offshore Shell Co.", desc: "Cayman Islands, baby", baseCost: 14000000000000, cps: 65000000, icon: "🏝️" },
  { id: "gov", name: "Corrupt Politician", desc: "A small 'consulting fee'", baseCost: 170000000000000, cps: 430000000, icon: "🏛️" },
  { id: "megachurch", name: "Megachurch Pastor", desc: "Send seed money for a private jet", baseCost: 2.5e15, cps: 2.6e9, icon: "⛪" },
  { id: "timeshare", name: "Timeshare Salesman", desc: "Just sit through this 90-min pitch", baseCost: 3.8e16, cps: 1.6e10, icon: "🏖️" },
  { id: "mlm", name: "MLM Hun", desc: "Hey girlie!! Boss babe opportunity 💋", baseCost: 5.7e17, cps: 9.5e10, icon: "💄" },
  { id: "robocaller", name: "IRS Impersonator", desc: "You owe back taxes, pay in gift cards", baseCost: 8.5e18, cps: 5.7e11, icon: "📠" },
  { id: "catfish", name: "Romance Catfish", desc: "Babe I need $5k for a plane ticket", baseCost: 1.3e20, cps: 3.4e12, icon: "💔" },
  { id: "fakecharity", name: "Fake Charity", desc: "98% goes to 'administrative costs'", baseCost: 1.9e21, cps: 2.1e13, icon: "🎗️" },
  { id: "deepfake", name: "Deepfake Studio", desc: "Hi mom, it's me, send bitcoin", baseCost: 2.9e22, cps: 1.2e14, icon: "🎭" },
  { id: "ransomware", name: "Ransomware Gang", desc: "Your files are encrypted :)", baseCost: 4.4e23, cps: 7.5e14, icon: "🔒" },
  { id: "hedgefund", name: "Sketchy Hedge Fund", desc: "Past returns guarantee future returns", baseCost: 6.6e24, cps: 4.5e15, icon: "📈" },
  { id: "metaverse", name: "Metaverse Real Estate", desc: "Buy a plot next to Snoop Dogg!", baseCost: 9.9e25, cps: 2.7e16, icon: "🕶️" },
  { id: "cult", name: "Doomsday Cult", desc: "Donate everything, the comet is coming", baseCost: 1.5e27, cps: 1.6e17, icon: "☄️" },
  { id: "dictator", name: "Banana Republic Dictator", desc: "Generously self-elected for life", baseCost: 2.2e28, cps: 9.7e17, icon: "🎖️" },
  { id: "bigpharma", name: "Big Pharma Exec", desc: "$5,000 per pill seems reasonable", baseCost: 3.4e29, cps: 5.8e18, icon: "💊" },
  { id: "oilbaron", name: "Oil Baron", desc: "Climate change? Never heard of her", baseCost: 5.0e30, cps: 3.5e19, icon: "🛢️" },
  { id: "armsdealer", name: "Arms Dealer", desc: "Strictly humanitarian purposes", baseCost: 7.5e31, cps: 2.1e20, icon: "💣" },
  { id: "lizardlord", name: "Lizard Overlord", desc: "Has been here the whole time", baseCost: 1.1e33, cps: 1.3e21, icon: "🦎" },
  { id: "alien", name: "Galactic Telemarketer", desc: "Your planet's warranty has expired", baseCost: 1.7e34, cps: 7.6e21, icon: "👽" },
  { id: "timetraveler", name: "Time-Traveling Grifter", desc: "Trust me about Tuesday's lottery", baseCost: 2.5e35, cps: 4.5e22, icon: "⏳" },
  { id: "demon", name: "Soul Buyer", desc: "Sign here in blood, fine print attached", baseCost: 3.8e36, cps: 2.7e23, icon: "😈" },
  { id: "godscam", name: "Cosmic Pyramid Scheme", desc: "Recruit 3 universes, get one free", baseCost: 5.7e37, cps: 1.6e24, icon: "🌌" },
  // NEW scams
  { id: "fakeguru", name: "Fake Productivity Guru", desc: "Wake up at 4am, drink raw eggs, buy course", baseCost: 8.5e38, cps: 9.6e24, icon: "🧘" },
  { id: "carbonscam", name: "Carbon Credit Scammer", desc: "Sells forests that don't exist", baseCost: 1.3e40, cps: 5.8e25, icon: "🌲" },
  { id: "fakeisp", name: "Bandwidth Reseller", desc: "100Gbps for $9.99 (it's dial-up)", baseCost: 1.9e41, cps: 3.5e26, icon: "📡" },
  { id: "psychic", name: "Online Psychic", desc: "I sense your credit card number…", baseCost: 2.9e42, cps: 2.1e27, icon: "🔮" },
  { id: "drone", name: "Drone Delivery Ponzi", desc: "Your package is 9 months away", baseCost: 4.4e43, cps: 1.3e28, icon: "🛸" },
  { id: "moon", name: "Moon Real Estate", desc: "Crater views, no atmosphere included", baseCost: 6.6e44, cps: 7.6e28, icon: "🌑" },
  { id: "blackhole", name: "Black Hole ETF", desc: "Returns get sucked in but trust us", baseCost: 9.9e45, cps: 4.5e29, icon: "🕳️" },
  { id: "wizard", name: "Wall Street Wizard", desc: "Predicts the past with 100% accuracy", baseCost: 1.5e47, cps: 2.7e30, icon: "🧙" },
  { id: "kaiju", name: "Kaiju Insurance Co.", desc: "Doesn't cover Godzilla, sorry", baseCost: 2.2e48, cps: 1.6e31, icon: "🦖" },
  { id: "multiverse", name: "Multiverse Token", desc: "Worth $0 in 11 dimensions, ∞ in one", baseCost: 3.4e49, cps: 9.7e31, icon: "♾️" },
];

function fmt(n: number) {
  if (!isFinite(n)) return "∞";
  if (n < 1000) return n.toFixed(n < 10 ? 1 : 0);
  const units = ["", "K", "M", "B", "T", "Qa", "Qi", "Sx", "Sp", "Oc", "No", "Dc"];
  let i = 0;
  while (n >= 1000 && i < units.length - 1) {
    n /= 1000;
    i++;
  }
  return n.toFixed(2) + units[i];
}

type ChatMsg = {
  id: string;
  user_id: string;
  username: string;
  content: string;
  is_admin: boolean;
  created_at: string;
};

type ShopItem = {
  id: string;
  name: string;
  description: string;
  icon: string;
  price: number;
  currency: "points" | "gems" | "tokens";
  stock: number;
  effect_kind: "points" | "gems" | "tokens" | "upgrade_all" | "godmode_5min";
  effect_amount: number;
  active: boolean;
};

type Weather = {
  type: string;
  label: string;
  icon: string;
  multiplier: number;
  expiresAt: number;
};

const WEATHER_PRESETS: Record<string, { label: string; icon: string; multiplier: number }> = {
  storm: { label: "Scam Storm", icon: "🌧️", multiplier: 3 },
  golden: { label: "Golden Hour", icon: "🌟", multiplier: 5 },
  bullrun: { label: "Bull Run", icon: "🐂", multiplier: 10 },
  winter: { label: "Crypto Winter", icon: "🥶", multiplier: 0.25 },
  audit: { label: "IRS Audit", icon: "📋", multiplier: 0.5 },
  blackout: { label: "Server Blackout", icon: "💀", multiplier: 0 },
  rainbow: { label: "Rainbow Rush", icon: "🌈", multiplier: 7 },
};

// ============ PETS ============
type Rarity = "common" | "uncommon" | "rare" | "epic" | "legendary" | "mythic" | "godly";

const RARITY: Record<Rarity, { label: string; color: string; mult: number; weight: number; sellGems: number }> = {
  common:    { label: "Common",    color: "text-gray-300",   mult: 1.05, weight: 50, sellGems: 1 },
  uncommon:  { label: "Uncommon",  color: "text-green-400",  mult: 1.15, weight: 25, sellGems: 3 },
  rare:      { label: "Rare",      color: "text-blue-400",   mult: 1.30, weight: 13, sellGems: 8 },
  epic:      { label: "Epic",      color: "text-purple-400", mult: 1.60, weight: 7,  sellGems: 20 },
  legendary: { label: "Legendary", color: "text-yellow-400", mult: 2.25, weight: 3,  sellGems: 60 },
  mythic:    { label: "Mythic",    color: "text-pink-400",   mult: 3.50, weight: 1.5,sellGems: 200 },
  godly:     { label: "GODLY",     color: "text-red-400",    mult: 6.00, weight: 0.5,sellGems: 750 },
};

type Pet = { id: string; name: string; icon: string; rarity: Rarity };

const PETS: Pet[] = [
  // common
  { id: "rat",        name: "Sewer Rat",        icon: "🐀", rarity: "common" },
  { id: "pigeon",     name: "City Pigeon",      icon: "🐦", rarity: "common" },
  { id: "fly",        name: "Spam Fly",         icon: "🪰", rarity: "common" },
  { id: "snail",      name: "Lag Snail",        icon: "🐌", rarity: "common" },
  { id: "ant",        name: "Worker Ant",       icon: "🐜", rarity: "common" },
  { id: "frog",       name: "Meme Frog",        icon: "🐸", rarity: "common" },
  // uncommon
  { id: "cat",        name: "Scam Cat",         icon: "🐈", rarity: "uncommon" },
  { id: "dog",        name: "Bork Coin Dog",    icon: "🐕", rarity: "uncommon" },
  { id: "parrot",     name: "Phishing Parrot",  icon: "🦜", rarity: "uncommon" },
  { id: "rabbit",     name: "MLM Rabbit",       icon: "🐇", rarity: "uncommon" },
  { id: "owl",        name: "Night Trader Owl", icon: "🦉", rarity: "uncommon" },
  // rare
  { id: "fox",        name: "Sly Fox",          icon: "🦊", rarity: "rare" },
  { id: "raccoon",    name: "Trash Raccoon",    icon: "🦝", rarity: "rare" },
  { id: "shark",      name: "Loan Shark",       icon: "🦈", rarity: "rare" },
  { id: "octopus",    name: "Lobby Octopus",    icon: "🐙", rarity: "rare" },
  { id: "bear",       name: "Bear Market",      icon: "🐻", rarity: "rare" },
  // epic
  { id: "tiger",      name: "Pyramid Tiger",    icon: "🐅", rarity: "epic" },
  { id: "wolf",       name: "Wall St. Wolf",    icon: "🐺", rarity: "epic" },
  { id: "octa",       name: "Hedge Eagle",      icon: "🦅", rarity: "epic" },
  { id: "snake",      name: "Silver Tongue",    icon: "🐍", rarity: "epic" },
  { id: "scorpion",   name: "Tax Scorpion",     icon: "🦂", rarity: "epic" },
  // legendary
  { id: "dragon",     name: "ICO Dragon",       icon: "🐉", rarity: "legendary" },
  { id: "unicorn",    name: "Startup Unicorn",  icon: "🦄", rarity: "legendary" },
  { id: "phoenix",    name: "Rugpull Phoenix",  icon: "🔥", rarity: "legendary" },
  { id: "kraken",     name: "Market Kraken",    icon: "🦑", rarity: "legendary" },
  // mythic
  { id: "alien_pet",  name: "Galactic Grifter", icon: "👾", rarity: "mythic" },
  { id: "demon_pet",  name: "Soul Broker",      icon: "👹", rarity: "mythic" },
  { id: "ghost",      name: "Ghost of Ponzi",   icon: "👻", rarity: "mythic" },
  // godly
  { id: "lizardking", name: "Lizard King",      icon: "🦎", rarity: "godly" },
  { id: "voidcat",    name: "Cosmic Cat",       icon: "🌠", rarity: "godly" },
  { id: "moneygod",   name: "Money God",        icon: "💰", rarity: "godly" },
];

const PET_BY_ID: Record<string, Pet> = Object.fromEntries(PETS.map((p) => [p.id, p]));

const MAX_EQUIPPED = 5;
const EGG_COST_GEMS = 25;

function rollPet(): Pet {
  const totalWeight = PETS.reduce((s, p) => s + RARITY[p.rarity].weight, 0);
  let r = Math.random() * totalWeight;
  for (const p of PETS) {
    r -= RARITY[p.rarity].weight;
    if (r <= 0) return p;
  }
  return PETS[0];
}

type UserPet = { id: string; owner_id: string; pet_id: string; acquired_at: string };
type PetTrade = {
  id: string;
  from_user: string;
  to_user: string;
  offered_pet_id: string;
  requested_pet_id: string | null;
  status: string;
  created_at: string;
};

function Index() {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setLoading(false);
    });
    const { data: sub } = supabase.auth.onAuthStateChange((_e, s) => setSession(s));
    return () => sub.subscription.unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-background text-foreground font-mono flex items-center justify-center">
        loading…
      </div>
    );
  }

  return session ? <Game session={session} /> : <AuthScreen />;
}

function AuthScreen() {
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErr("");
    setBusy(true);
    try {
      if (mode === "signup") {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: window.location.origin,
            data: { username: username.trim() || email.split("@")[0] },
          },
        });
        if (error) throw error;
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
      }
    } catch (e: unknown) {
      setErr(e instanceof Error ? e.message : "error");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground font-mono flex items-center justify-center p-6">
      <form onSubmit={submit} className="w-full max-w-sm border border-foreground/30 rounded p-6 space-y-4 bg-foreground/5">
        <h1 className="text-2xl font-bold">
          <span className="opacity-60">$</span> {mode === "login" ? "./login" : "./signup"}
        </h1>
        <div className="text-xs opacity-70 border-l-2 border-foreground/40 pl-2">
          ⚠️ Parody game. The first person to sign up becomes the admin.
        </div>
        {mode === "signup" && (
          <input
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="username"
            required
            maxLength={32}
            className="w-full bg-foreground/10 border border-foreground/30 rounded px-3 py-2 outline-none focus:border-foreground/60"
          />
        )}
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="email"
          required
          className="w-full bg-foreground/10 border border-foreground/30 rounded px-3 py-2 outline-none focus:border-foreground/60"
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="password (min 6)"
          required
          minLength={6}
          className="w-full bg-foreground/10 border border-foreground/30 rounded px-3 py-2 outline-none focus:border-foreground/60"
        />
        {err && <div className="text-xs text-red-400 break-words">{err}</div>}
        <button
          type="submit"
          disabled={busy}
          className="w-full border border-foreground/40 rounded px-3 py-2 hover:bg-foreground/10 disabled:opacity-50"
        >
          {busy ? "…" : mode === "login" ? "log in" : "sign up"}
        </button>
        <button
          type="button"
          onClick={() => {
            setErr("");
            setMode(mode === "login" ? "signup" : "login");
          }}
          className="w-full text-xs opacity-70 hover:opacity-100 underline"
        >
          {mode === "login" ? "no account? sign up" : "have an account? log in"}
        </button>
      </form>
    </div>
  );
}

function Game({ session }: { session: Session }) {
  const userId = session.user.id;
  const [points, setPoints] = useState(0);
  const [gems, setGems] = useState(0);
  const [tokens, setTokens] = useState(0);
  const [owned, setOwned] = useState<Record<string, number>>({});
  const [username, setUsername] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);
  const [muted, setMuted] = useState(false);
  const [floats, setFloats] = useState<{ id: number; x: number; y: number; v: number }[]>([]);
  const [pulse, setPulse] = useState(false);
  const [chatInput, setChatInput] = useState("");
  const [chatMsgs, setChatMsgs] = useState<ChatMsg[]>([]);
  const [onlineCount, setOnlineCount] = useState(0);
  const [banner, setBanner] = useState<{ from: string; msg: string } | null>(null);
  const [cmdMsg, setCmdMsg] = useState("");
  const [adminPanelOpen, setAdminPanelOpen] = useState(true);
  const [shopItems, setShopItems] = useState<ShopItem[]>([]);
  const [weather, setWeather] = useState<Weather | null>(null);
  const [globalMult, setGlobalMult] = useState(1);
  const [frozen, setFrozen] = useState(false);
  const [godmodeUntil, setGodmodeUntil] = useState(0);
  const [now, setNow] = useState(Date.now());

  // Admin inputs
  const [adminGiveAmt, setAdminGiveAmt] = useState("1000");
  const [adminGiveAllN, setAdminGiveAllN] = useState("100");
  const [adminGemsAmt, setAdminGemsAmt] = useState("100");
  const [adminTokensAmt, setAdminTokensAmt] = useState("50");
  const [adminAnnounce, setAdminAnnounce] = useState("");
  const [adminUserTarget, setAdminUserTarget] = useState("");
  const [adminMultVal, setAdminMultVal] = useState("2");
  const [adminWeatherDur, setAdminWeatherDur] = useState("60");
  // Shop create form
  const [newItemName, setNewItemName] = useState("");
  const [newItemDesc, setNewItemDesc] = useState("");
  const [newItemIcon, setNewItemIcon] = useState("🎁");
  const [newItemPrice, setNewItemPrice] = useState("1000");
  const [newItemCurrency, setNewItemCurrency] = useState<"points" | "gems" | "tokens">("points");
  const [newItemStock, setNewItemStock] = useState("10");
  const [newItemEffect, setNewItemEffect] = useState<ShopItem["effect_kind"]>("points");
  const [newItemEffectAmt, setNewItemEffectAmt] = useState("100000");

  // Pets
  const [userPets, setUserPets] = useState<UserPet[]>([]);
  const [equipped, setEquipped] = useState<string[]>([]); // user_pets.id list
  const [trades, setTrades] = useState<PetTrade[]>([]);
  const [petsPanelOpen, setPetsPanelOpen] = useState(true);
  const [tradeTargetName, setTradeTargetName] = useState("");
  const [tradeTargetPets, setTradeTargetPets] = useState<UserPet[]>([]);
  const [tradeOfferPet, setTradeOfferPet] = useState<string>("");
  const [tradeRequestPet, setTradeRequestPet] = useState<string>("");
  const [tradePanelOpen, setTradePanelOpen] = useState(false);

  const floatId = useRef(0);
  const stateRef = useRef({ points: 0, gems: 0, tokens: 0, owned: {} as Record<string, number> });
  const chatEndRef = useRef<HTMLDivElement>(null);
  const loadedRef = useRef(false);

  // tick "now" for weather countdown
  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 500);
    return () => clearInterval(t);
  }, []);

  // load profile + role + shop
  useEffect(() => {
    let mounted = true;
    (async () => {
      const [{ data: prof }, { data: roles }, { data: shop }, { data: pets }, { data: tr }] = await Promise.all([
        supabase.from("profiles").select("username, points, gems, tokens, owned, muted, equipped_pets").eq("id", userId).maybeSingle(),
        supabase.from("user_roles").select("role").eq("user_id", userId),
        supabase.from("admin_shop_items").select("*").eq("active", true).order("created_at", { ascending: false }),
        supabase.from("user_pets").select("*").eq("owner_id", userId).order("acquired_at", { ascending: false }),
        supabase.from("pet_trades").select("*").or(`from_user.eq.${userId},to_user.eq.${userId}`).eq("status", "pending"),
      ]);
      if (!mounted) return;
      if (prof) {
        setUsername(prof.username);
        setPoints(Number(prof.points) || 0);
        setGems(Number(prof.gems) || 0);
        setTokens(Number(prof.tokens) || 0);
        setOwned((prof.owned as Record<string, number>) || {});
        setMuted(!!prof.muted);
        setEquipped((prof.equipped_pets as string[]) || []);
        stateRef.current = {
          points: Number(prof.points) || 0,
          gems: Number(prof.gems) || 0,
          tokens: Number(prof.tokens) || 0,
          owned: (prof.owned as Record<string, number>) || {},
        };
      }
      setIsAdmin(!!roles?.some((r) => r.role === "admin"));
      if (shop) setShopItems(shop as ShopItem[]);
      if (pets) setUserPets(pets as UserPet[]);
      if (tr) setTrades(tr as PetTrade[]);
      loadedRef.current = true;

      await supabase.from("profiles").update({ is_online: true, last_seen: new Date().toISOString() }).eq("id", userId);

      const { data: msgs } = await supabase
        .from("chat_messages")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(50);
      if (msgs && mounted) setChatMsgs(msgs.reverse() as ChatMsg[]);

      const { count } = await supabase
        .from("profiles")
        .select("id", { count: "exact", head: true })
        .eq("is_online", true);
      if (mounted) setOnlineCount(count ?? 0);
    })();
    return () => {
      mounted = false;
    };
  }, [userId]);

  useEffect(() => {
    stateRef.current = { points, gems, tokens, owned };
  }, [points, gems, tokens, owned]);

  // periodic save
  useEffect(() => {
    const save = () => {
      if (!loadedRef.current) return;
      supabase
        .from("profiles")
        .update({
          points: stateRef.current.points,
          gems: stateRef.current.gems,
          tokens: stateRef.current.tokens,
          owned: stateRef.current.owned,
          is_online: true,
          last_seen: new Date().toISOString(),
        })
        .eq("id", userId);
    };
    const t = setInterval(save, 3000);
    const onVis = () => { if (document.visibilityState === "hidden") save(); };
    document.addEventListener("visibilitychange", onVis);
    return () => {
      clearInterval(t);
      document.removeEventListener("visibilitychange", onVis);
      save();
    };
  }, [userId]);

  useEffect(() => {
    const handler = () => {
      if (!loadedRef.current) return;
      supabase
        .from("profiles")
        .update({
          points: stateRef.current.points,
          gems: stateRef.current.gems,
          tokens: stateRef.current.tokens,
          owned: stateRef.current.owned,
          is_online: false,
          last_seen: new Date().toISOString(),
        })
        .eq("id", userId);
    };
    window.addEventListener("beforeunload", handler);
    window.addEventListener("pagehide", handler);
    return () => {
      window.removeEventListener("beforeunload", handler);
      window.removeEventListener("pagehide", handler);
      handler();
    };
  }, [userId]);

  // toggle admin panel with "9" key
  useEffect(() => {
    if (!isAdmin) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "9") return;
      const t = e.target as HTMLElement | null;
      if (t && (t.tagName === "INPUT" || t.tagName === "TEXTAREA" || t.isContentEditable)) return;
      setAdminPanelOpen((v) => !v);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isAdmin]);

  // realtime
  useEffect(() => {
    const chatCh = supabase
      .channel("chat-room")
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "chat_messages" }, (payload) => {
        setChatMsgs((m) => [...m, payload.new as ChatMsg].slice(-100));
      })
      .on("postgres_changes", { event: "DELETE", schema: "public", table: "chat_messages" }, (payload) => {
        setChatMsgs((m) => m.filter((x) => x.id !== (payload.old as { id: string }).id));
      })
      .subscribe();

    const bcCh = supabase
      .channel("broadcasts-room")
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "broadcasts" }, (payload) => {
        applyBroadcast(payload.new as { kind: string; payload: Record<string, unknown>; admin_name: string });
      })
      .subscribe();

    const presenceCh = supabase
      .channel("profiles-online")
      .on("postgres_changes", { event: "UPDATE", schema: "public", table: "profiles" }, async () => {
        const { count } = await supabase
          .from("profiles")
          .select("id", { count: "exact", head: true })
          .eq("is_online", true);
        setOnlineCount(count ?? 0);
      })
      .subscribe();

    const shopCh = supabase
      .channel("shop-room")
      .on("postgres_changes", { event: "*", schema: "public", table: "admin_shop_items" }, async () => {
        const { data: shop } = await supabase
          .from("admin_shop_items")
          .select("*")
          .eq("active", true)
          .order("created_at", { ascending: false });
        if (shop) setShopItems(shop as ShopItem[]);
      })
      .subscribe();

    const petsCh = supabase
      .channel("pets-room")
      .on("postgres_changes", { event: "*", schema: "public", table: "user_pets", filter: `owner_id=eq.${userId}` }, async () => {
        const { data } = await supabase.from("user_pets").select("*").eq("owner_id", userId).order("acquired_at", { ascending: false });
        if (data) setUserPets(data as UserPet[]);
      })
      .subscribe();

    const tradesCh = supabase
      .channel("trades-room")
      .on("postgres_changes", { event: "*", schema: "public", table: "pet_trades" }, async () => {
        const { data } = await supabase.from("pet_trades").select("*").or(`from_user.eq.${userId},to_user.eq.${userId}`).eq("status", "pending");
        setTrades((data as PetTrade[]) ?? []);
      })
      .subscribe();

    return () => {
      supabase.removeChannel(chatCh);
      supabase.removeChannel(bcCh);
      supabase.removeChannel(presenceCh);
      supabase.removeChannel(shopCh);
      supabase.removeChannel(petsCh);
      supabase.removeChannel(tradesCh);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMsgs]);

  // Pet boost multiplier from equipped pets
  const petMult = equipped.reduce((acc, upId) => {
    const up = userPets.find((p) => p.id === upId);
    if (!up) return acc;
    const pet = PET_BY_ID[up.pet_id];
    if (!pet) return acc;
    return acc * RARITY[pet.rarity].mult;
  }, 1);

  const weatherMult = weather && weather.expiresAt > now ? weather.multiplier : 1;
  const godmodeActive = godmodeUntil > now;
  const baseCps = UPGRADES.reduce((s, u) => s + (owned[u.id] ?? 0) * u.cps, 0);
  const effectiveMult = (frozen ? 0 : 1) * globalMult * weatherMult * petMult * (godmodeActive ? 100 : 1);
  const cps = baseCps * effectiveMult;
  const perClick = Math.max(1, Math.floor((1 + Math.floor(baseCps * 0.05)) * Math.max(1, effectiveMult)));

  useEffect(() => {
    const t = setInterval(() => setPoints((p) => p + cps / 10), 100);
    return () => clearInterval(t);
  }, [cps]);

  const applyBroadcast = (b: { kind: string; payload: Record<string, unknown>; admin_name: string }) => {
    const adminName = b.admin_name;
    const p = b.payload || {};
    switch (b.kind) {
      case "give_points": {
        const amt = Number(p.amount) || 0;
        setPoints((x) => x + amt);
        setBanner({ from: adminName, msg: `gave everyone +${fmt(amt)} points` });
        break;
      }
      case "give_gems": {
        const amt = Number(p.amount) || 0;
        setGems((x) => x + amt);
        setBanner({ from: adminName, msg: `gave everyone +${fmt(amt)} 💎 gems` });
        break;
      }
      case "give_tokens": {
        const amt = Number(p.amount) || 0;
        setTokens((x) => x + amt);
        setBanner({ from: adminName, msg: `gave everyone +${fmt(amt)} 🎟️ tokens` });
        break;
      }
      case "give_all": {
        const n = Number(p.amount) || 0;
        setOwned((o) => {
          const nx = { ...o };
          for (const u of UPGRADES) nx[u.id] = (nx[u.id] ?? 0) + n;
          return nx;
        });
        setBanner({ from: adminName, msg: `gave everyone +${n} of every upgrade` });
        break;
      }
      case "godmode": {
        setOwned((o) => {
          const nx = { ...o };
          for (const u of UPGRADES) nx[u.id] = (nx[u.id] ?? 0) + 9999;
          return nx;
        });
        setPoints((x) => x + 1e15);
        setGems((x) => x + 1000);
        setTokens((x) => x + 1000);
        setBanner({ from: adminName, msg: `🔱 GODMODE for all` });
        break;
      }
      case "announce":
        setBanner({ from: adminName, msg: String(p.text || "") });
        break;
      case "reset":
        setPoints(0);
        setGems(0);
        setTokens(0);
        setOwned({});
        setBanner({ from: adminName, msg: "wiped everyone's progress 💀" });
        break;
      case "weather": {
        const preset = WEATHER_PRESETS[String(p.type)];
        const dur = Number(p.duration_s) || 60;
        if (preset) {
          setWeather({ type: String(p.type), ...preset, expiresAt: Date.now() + dur * 1000 });
          setBanner({ from: adminName, msg: `${preset.icon} ${preset.label} for ${dur}s (×${preset.multiplier})` });
        }
        break;
      }
      case "clear_weather":
        setWeather(null);
        setBanner({ from: adminName, msg: "☀️ weather cleared" });
        break;
      case "multiplier": {
        const m = Number(p.value) || 1;
        setGlobalMult(m);
        setBanner({ from: adminName, msg: `🌍 global multiplier ×${m}` });
        break;
      }
      case "freeze":
        setFrozen(true);
        setBanner({ from: adminName, msg: "🧊 everyone frozen" });
        break;
      case "unfreeze":
        setFrozen(false);
        setBanner({ from: adminName, msg: "🔥 unfrozen" });
        break;
      case "clear_chat":
        setChatMsgs([]);
        setBanner({ from: adminName, msg: "🧹 chat cleared" });
        break;
    }
    setTimeout(() => setBanner(null), 5000);
  };

  const click = (e: React.MouseEvent) => {
    setPoints((p) => p + perClick);
    setPulse(true);
    setTimeout(() => setPulse(false), 80);
    const id = ++floatId.current;
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    setFloats((f) => [...f, { id, x: e.clientX - rect.left, y: e.clientY - rect.top, v: perClick }]);
    setTimeout(() => setFloats((f) => f.filter((x) => x.id !== id)), 900);
  };

  const buy = (u: Upgrade) => {
    if (points < u.baseCost) return;
    setPoints((p) => p - u.baseCost);
    setOwned((o) => ({ ...o, [u.id]: (o[u.id] ?? 0) + 1 }));
  };

  const showCmd = useCallback((s: string) => {
    setCmdMsg(s);
    setTimeout(() => setCmdMsg(""), 3000);
  }, []);

  const broadcast = useCallback(async (kind: string, payload: Record<string, unknown>) => {
    const { error } = await supabase
      .from("broadcasts")
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .insert({ admin_id: userId, admin_name: username, kind, payload: payload as any });
    if (error) showCmd("❌ " + error.message);
    else showCmd("✅ sent");
  }, [userId, username, showCmd]);

  const runCommand = async (raw: string): Promise<boolean> => {
    if (!raw.startsWith("/")) return false;
    const parts = raw.slice(1).split(/\s+/);
    const cmd = parts[0].toLowerCase();
    const arg = parts.slice(1).join(" ");
    const argN = (i: number) => parts[i + 1];

    if (cmd === "help") {
      showCmd(isAdmin
        ? "/give /givegems /givetokens /giveall /godmode /announce /reset /weather /clearweather /multiplier /freeze /unfreeze /clearchat /grantadmin /revokeadmin /mute /unmute /setpoints /setgems /settokens"
        : "no commands — you're not admin");
      return true;
    }

    if (!isAdmin) {
      showCmd("❌ admin only");
      return true;
    }

    const findUser = async (uname: string) => {
      const { data } = await supabase.from("profiles").select("id").eq("username", uname).maybeSingle();
      return data?.id ?? null;
    };

    switch (cmd) {
      case "give": {
        const n = Number(arg);
        if (!n) return showCmd("usage: /give <amount>"), true;
        await broadcast("give_points", { amount: n });
        break;
      }
      case "givegems": {
        const n = Number(arg);
        if (!n) return showCmd("usage: /givegems <amount>"), true;
        await broadcast("give_gems", { amount: n });
        break;
      }
      case "givetokens": {
        const n = Number(arg);
        if (!n) return showCmd("usage: /givetokens <amount>"), true;
        await broadcast("give_tokens", { amount: n });
        break;
      }
      case "giveall": {
        const n = Number(arg);
        if (!n) return showCmd("usage: /giveall <n>"), true;
        await broadcast("give_all", { amount: n });
        break;
      }
      case "godmode":
        await broadcast("godmode", {});
        break;
      case "announce":
        if (!arg) return showCmd("usage: /announce <msg>"), true;
        await broadcast("announce", { text: arg });
        break;
      case "reset":
        await broadcast("reset", {});
        break;
      case "weather": {
        const type = argN(0);
        const dur = Number(argN(1)) || 60;
        if (!type || !WEATHER_PRESETS[type]) {
          showCmd("types: " + Object.keys(WEATHER_PRESETS).join(", "));
          return true;
        }
        await broadcast("weather", { type, duration_s: dur });
        break;
      }
      case "clearweather":
        await broadcast("clear_weather", {});
        break;
      case "multiplier": {
        const m = Number(arg);
        if (!m || m < 0) return showCmd("usage: /multiplier <n>"), true;
        await broadcast("multiplier", { value: m });
        break;
      }
      case "freeze":
        await broadcast("freeze", {});
        break;
      case "unfreeze":
        await broadcast("unfreeze", {});
        break;
      case "clearchat": {
        await supabase.from("chat_messages").delete().neq("id", "00000000-0000-0000-0000-000000000000");
        await broadcast("clear_chat", {});
        break;
      }
      case "grantadmin": {
        if (!arg) return showCmd("usage: /grantadmin <username>"), true;
        const uid = await findUser(arg);
        if (!uid) return showCmd("❌ user not found"), true;
        const { error } = await supabase.from("user_roles").insert({ user_id: uid, role: "admin" });
        showCmd(error ? "❌ " + error.message : `✅ ${arg} is now admin`);
        break;
      }
      case "revokeadmin": {
        if (!arg) return showCmd("usage: /revokeadmin <username>"), true;
        const uid = await findUser(arg);
        if (!uid) return showCmd("❌ user not found"), true;
        const { error } = await supabase.from("user_roles").delete().eq("user_id", uid).eq("role", "admin");
        showCmd(error ? "❌ " + error.message : `✅ revoked ${arg}`);
        break;
      }
      case "mute":
      case "unmute": {
        if (!arg) return showCmd(`usage: /${cmd} <username>`), true;
        const uid = await findUser(arg);
        if (!uid) return showCmd("❌ user not found"), true;
        const { error } = await supabase.from("profiles").update({ muted: cmd === "mute" }).eq("id", uid);
        showCmd(error ? "❌ " + error.message : `✅ ${arg} ${cmd}d`);
        break;
      }
      case "setpoints":
      case "setgems":
      case "settokens": {
        const uname = argN(0);
        const amt = Number(argN(1));
        if (!uname || isNaN(amt)) return showCmd(`usage: /${cmd} <user> <amount>`), true;
        const uid = await findUser(uname);
        if (!uid) return showCmd("❌ user not found"), true;
        const patch = cmd === "setpoints" ? { points: amt } : cmd === "setgems" ? { gems: amt } : { tokens: amt };
        const { error } = await supabase.from("profiles").update(patch).eq("id", uid);
        showCmd(error ? "❌ " + error.message : `✅ ${uname} ${cmd.replace("set","")}=${amt}`);
        break;
      }
      default:
        showCmd("❌ unknown command — /help");
    }
    return true;
  };

  const sendChat = async (e: React.FormEvent) => {
    e.preventDefault();
    const text = chatInput.trim();
    if (!text) return;
    setChatInput("");
    if (await runCommand(text)) return;
    if (muted) {
      showCmd("🔇 you are muted");
      return;
    }
    const { error } = await supabase.from("chat_messages").insert({
      user_id: userId,
      username,
      content: text.slice(0, 500),
      is_admin: isAdmin,
    });
    if (error) showCmd("❌ " + error.message);
  };

  const buyShopItem = async (item: ShopItem) => {
    if (item.stock <= 0) return showCmd("❌ out of stock");
    const have = item.currency === "points" ? points : item.currency === "gems" ? gems : tokens;
    if (have < item.price) return showCmd(`❌ need more ${item.currency}`);
    // Optimistic decrement
    const { data: upd, error } = await supabase
      .from("admin_shop_items")
      .update({ stock: item.stock - 1 })
      .eq("id", item.id)
      .eq("stock", item.stock)
      .select()
      .maybeSingle();
    if (error || !upd) return showCmd("❌ already sold — try again");

    if (item.currency === "points") setPoints((x) => x - item.price);
    if (item.currency === "gems") setGems((x) => x - item.price);
    if (item.currency === "tokens") setTokens((x) => x - item.price);

    // Apply effect
    switch (item.effect_kind) {
      case "points": setPoints((x) => x + item.effect_amount); break;
      case "gems": setGems((x) => x + item.effect_amount); break;
      case "tokens": setTokens((x) => x + item.effect_amount); break;
      case "upgrade_all":
        setOwned((o) => {
          const nx = { ...o };
          for (const u of UPGRADES) nx[u.id] = (nx[u.id] ?? 0) + item.effect_amount;
          return nx;
        });
        break;
      case "godmode_5min":
        setGodmodeUntil(Date.now() + 5 * 60 * 1000);
        break;
    }
    await supabase.from("shop_purchases").insert({
      user_id: userId,
      item_id: item.id,
      item_name: item.name,
      price_paid: item.price,
      currency: item.currency,
    });
    showCmd(`✅ bought ${item.icon} ${item.name}`);
  };

  const createShopItem = async () => {
    const name = newItemName.trim();
    if (!name) return showCmd("name required");
    const { error } = await supabase.from("admin_shop_items").insert({
      name,
      description: newItemDesc,
      icon: newItemIcon || "🎁",
      price: Number(newItemPrice) || 0,
      currency: newItemCurrency,
      stock: Number(newItemStock) || 0,
      effect_kind: newItemEffect,
      effect_amount: Number(newItemEffectAmt) || 0,
      created_by: userId,
    });
    if (error) showCmd("❌ " + error.message);
    else {
      showCmd("✅ item added");
      setNewItemName(""); setNewItemDesc("");
    }
  };

  const restockItem = async (id: string, current: number, by: number) => {
    const { error } = await supabase.from("admin_shop_items").update({ stock: current + by }).eq("id", id);
    if (error) showCmd("❌ " + error.message);
    else showCmd(`✅ +${by} stock`);
  };

  const deleteItem = async (id: string) => {
    if (!confirm("Delete this item?")) return;
    const { error } = await supabase.from("admin_shop_items").update({ active: false }).eq("id", id);
    if (error) showCmd("❌ " + error.message);
  };

  const logout = async () => {
    await supabase.from("profiles").update({ is_online: false }).eq("id", userId);
    await supabase.auth.signOut();
  };

  const weatherSecsLeft = weather ? Math.max(0, Math.ceil((weather.expiresAt - now) / 1000)) : 0;
  const godmodeSecsLeft = godmodeActive ? Math.ceil((godmodeUntil - now) / 1000) : 0;

  return (
    <div className="min-h-screen bg-background text-foreground font-mono">
      <div className="border-b border-foreground/30 bg-foreground/5 px-4 py-2 text-center text-xs">
        ⚠️ PARODY GAME — No real scamming. No real money. Just clicks.
      </div>

      {banner && (
        <div className="bg-foreground text-background px-4 py-3 text-center font-bold animate-pulse">
          📣 {banner.from}: {banner.msg}
        </div>
      )}

      {weather && weatherSecsLeft > 0 && (
        <div className="bg-blue-500/20 border-b border-blue-400/40 px-4 py-2 text-center text-sm">
          {weather.icon} <b>{weather.label}</b> active — ×{weather.multiplier} CPS — {weatherSecsLeft}s left
        </div>
      )}
      {godmodeActive && (
        <div className="bg-yellow-400/20 border-b border-yellow-400/40 px-4 py-2 text-center text-sm">
          🔱 GODMODE ×100 — {godmodeSecsLeft}s left
        </div>
      )}
      {frozen && <div className="bg-cyan-400/20 border-b border-cyan-400/40 px-4 py-2 text-center text-sm">🧊 FROZEN — no CPS</div>}
      {globalMult !== 1 && !weather && (
        <div className="bg-purple-400/20 border-b border-purple-400/40 px-4 py-2 text-center text-sm">🌍 Global multiplier ×{globalMult}</div>
      )}

      <header className="px-6 py-4 border-b border-foreground/20 flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-bold tracking-tight">
          <span className="opacity-60">$</span> ./fake-scam-clicker.exe
        </h1>
        <div className="flex items-center gap-3 text-sm flex-wrap">
          <span className="opacity-70">🟢 {onlineCount}</span>
          <span>💎 {fmt(gems)}</span>
          <span>🎟️ {fmt(tokens)}</span>
          <span>
            {isAdmin && (
              <button
                onClick={() => setAdminPanelOpen((v) => !v)}
                title="Press 9 to toggle"
                className="text-yellow-400 font-bold mr-1 hover:underline"
              >[ADMIN]</button>
            )}
            <span className="opacity-80">{username}</span>
            {muted && <span className="ml-1 text-red-400">🔇</span>}
          </span>
          <button onClick={logout} className="border border-foreground/30 rounded px-2 py-1 text-xs hover:bg-foreground/10">
            log out
          </button>
        </div>
      </header>

      {isAdmin && adminPanelOpen && (
        <div className="border-b border-yellow-400/40 bg-yellow-400/5 px-4 py-3 space-y-2">
          <div className="max-w-[1500px] mx-auto flex flex-wrap items-center gap-2 text-xs">
            <span className="text-yellow-400 font-bold">👑 ADMIN</span>

            <AdminInput label="give pts" value={adminGiveAmt} setValue={setAdminGiveAmt} onSend={() => runCommand(`/give ${adminGiveAmt}`)} />
            <AdminInput label="💎 gems" value={adminGemsAmt} setValue={setAdminGemsAmt} onSend={() => runCommand(`/givegems ${adminGemsAmt}`)} />
            <AdminInput label="🎟️ tokens" value={adminTokensAmt} setValue={setAdminTokensAmt} onSend={() => runCommand(`/givetokens ${adminTokensAmt}`)} />
            <AdminInput label="N of all" value={adminGiveAllN} setValue={setAdminGiveAllN} onSend={() => runCommand(`/giveall ${adminGiveAllN}`)} />

            <button onClick={() => runCommand("/godmode")} className="border border-foreground/30 rounded px-2 py-1 hover:bg-foreground/10">🔱 godmode</button>
            <button onClick={() => { if (confirm("Wipe everyone?")) runCommand("/reset"); }} className="border border-red-400/50 text-red-400 rounded px-2 py-1 hover:bg-red-400/10">💀 reset</button>
            <button onClick={() => runCommand("/freeze")} className="border border-cyan-400/50 text-cyan-400 rounded px-2 py-1 hover:bg-cyan-400/10">🧊 freeze</button>
            <button onClick={() => runCommand("/unfreeze")} className="border border-foreground/30 rounded px-2 py-1 hover:bg-foreground/10">🔥 unfreeze</button>
            <button onClick={() => { if (confirm("Clear chat?")) runCommand("/clearchat"); }} className="border border-foreground/30 rounded px-2 py-1 hover:bg-foreground/10">🧹 clear chat</button>

            <AdminInput label="×mult" value={adminMultVal} setValue={setAdminMultVal} onSend={() => runCommand(`/multiplier ${adminMultVal}`)} />

            <div className="flex items-center gap-1 border border-foreground/30 rounded px-2 py-1">
              <input value={adminAnnounce} onChange={(e) => setAdminAnnounce(e.target.value)} placeholder="announce…" className="w-32 bg-foreground/10 rounded px-1 outline-none" />
              <button onClick={() => { if (adminAnnounce.trim()) { runCommand(`/announce ${adminAnnounce}`); setAdminAnnounce(""); } }} className="border border-foreground/30 rounded px-2 hover:bg-foreground/10">📣</button>
            </div>
          </div>

          {/* Weather row */}
          <div className="max-w-[1500px] mx-auto flex flex-wrap items-center gap-2 text-xs">
            <span className="opacity-70">⛅ weather:</span>
            {Object.entries(WEATHER_PRESETS).map(([k, v]) => (
              <button key={k} onClick={() => runCommand(`/weather ${k} ${adminWeatherDur}`)} className="border border-foreground/30 rounded px-2 py-1 hover:bg-foreground/10" title={`×${v.multiplier}`}>
                {v.icon} {v.label}
              </button>
            ))}
            <div className="flex items-center gap-1 border border-foreground/30 rounded px-2 py-1">
              <span className="opacity-70">dur(s):</span>
              <input value={adminWeatherDur} onChange={(e) => setAdminWeatherDur(e.target.value)} className="w-14 bg-foreground/10 rounded px-1 outline-none" />
            </div>
            <button onClick={() => runCommand("/clearweather")} className="border border-foreground/30 rounded px-2 py-1 hover:bg-foreground/10">☀️ clear</button>
          </div>

          {/* User mgmt row */}
          <div className="max-w-[1500px] mx-auto flex flex-wrap items-center gap-2 text-xs">
            <span className="opacity-70">👤 user:</span>
            <input value={adminUserTarget} onChange={(e) => setAdminUserTarget(e.target.value)} placeholder="username" className="w-28 bg-foreground/10 border border-foreground/30 rounded px-2 py-1 outline-none" />
            <button onClick={() => adminUserTarget && runCommand(`/grantadmin ${adminUserTarget}`)} className="border border-foreground/30 rounded px-2 py-1 hover:bg-foreground/10">+admin</button>
            <button onClick={() => adminUserTarget && runCommand(`/revokeadmin ${adminUserTarget}`)} className="border border-foreground/30 rounded px-2 py-1 hover:bg-foreground/10">-admin</button>
            <button onClick={() => adminUserTarget && runCommand(`/mute ${adminUserTarget}`)} className="border border-foreground/30 rounded px-2 py-1 hover:bg-foreground/10">🔇 mute</button>
            <button onClick={() => adminUserTarget && runCommand(`/unmute ${adminUserTarget}`)} className="border border-foreground/30 rounded px-2 py-1 hover:bg-foreground/10">🔊 unmute</button>
            {cmdMsg && <span className="opacity-80">— {cmdMsg}</span>}
          </div>

          {/* Shop creator */}
          <div className="max-w-[1500px] mx-auto border-t border-yellow-400/30 pt-2 flex flex-wrap items-center gap-1 text-xs">
            <span className="text-yellow-400 font-bold">🏪 add shop item:</span>
            <input value={newItemName} onChange={(e) => setNewItemName(e.target.value)} placeholder="name" className="w-28 bg-foreground/10 border border-foreground/30 rounded px-1 py-1 outline-none" />
            <input value={newItemDesc} onChange={(e) => setNewItemDesc(e.target.value)} placeholder="desc" className="w-32 bg-foreground/10 border border-foreground/30 rounded px-1 py-1 outline-none" />
            <input value={newItemIcon} onChange={(e) => setNewItemIcon(e.target.value)} placeholder="🎁" className="w-12 bg-foreground/10 border border-foreground/30 rounded px-1 py-1 outline-none text-center" />
            <input value={newItemPrice} onChange={(e) => setNewItemPrice(e.target.value)} placeholder="price" className="w-20 bg-foreground/10 border border-foreground/30 rounded px-1 py-1 outline-none" />
            <select value={newItemCurrency} onChange={(e) => setNewItemCurrency(e.target.value as "points" | "gems" | "tokens")} className="bg-foreground/10 border border-foreground/30 rounded px-1 py-1 outline-none">
              <option value="points">pts</option>
              <option value="gems">💎</option>
              <option value="tokens">🎟️</option>
            </select>
            <input value={newItemStock} onChange={(e) => setNewItemStock(e.target.value)} placeholder="stock" className="w-16 bg-foreground/10 border border-foreground/30 rounded px-1 py-1 outline-none" />
            <select value={newItemEffect} onChange={(e) => setNewItemEffect(e.target.value as ShopItem["effect_kind"])} className="bg-foreground/10 border border-foreground/30 rounded px-1 py-1 outline-none">
              <option value="points">+pts</option>
              <option value="gems">+💎</option>
              <option value="tokens">+🎟️</option>
              <option value="upgrade_all">+N all upgrades</option>
              <option value="godmode_5min">godmode 5min</option>
            </select>
            <input value={newItemEffectAmt} onChange={(e) => setNewItemEffectAmt(e.target.value)} placeholder="amt" className="w-20 bg-foreground/10 border border-foreground/30 rounded px-1 py-1 outline-none" />
            <button onClick={createShopItem} className="border border-yellow-400/50 text-yellow-400 rounded px-2 py-1 hover:bg-yellow-400/10">+ add</button>
          </div>
        </div>
      )}

      <main className="grid lg:grid-cols-[1fr_360px_320px] gap-4 p-4 max-w-[1500px] mx-auto">
        <section className="flex flex-col items-center justify-center min-h-[60vh] order-1 space-y-4">
          <div className="text-center">
            <div className="text-sm opacity-60">FAKE INTERNET POINTS</div>
            <div className="text-6xl font-bold tabular-nums">{fmt(points)}</div>
            <div className="text-sm opacity-70 mt-1">
              {fmt(cps)}/sec · +{perClick}/click
              {effectiveMult !== 1 && <span className="ml-2 text-yellow-400">×{effectiveMult.toFixed(2)}</span>}
            </div>
          </div>

          <button
            onClick={click}
            className={`relative select-none text-[10rem] leading-none transition-transform ${pulse ? "scale-95" : "scale-100"} cursor-pointer`}
            aria-label="Click"
          >
            🖥️
            {floats.map((f) => (
              <span key={f.id} className="pointer-events-none absolute text-2xl font-bold animate-[float_0.9s_ease-out_forwards]" style={{ left: f.x, top: f.y }}>
                +{fmt(f.v)}
              </span>
            ))}
          </button>

          {/* Admin shop */}
          {shopItems.length > 0 && (
            <div className="w-full max-w-2xl border border-yellow-400/40 rounded p-3 bg-yellow-400/5">
              <h3 className="font-bold mb-2 text-yellow-400">🏪 admin_shop — limited stock</h3>
              <div className="grid sm:grid-cols-2 gap-2">
                {shopItems.map((it) => {
                  const curIcon = it.currency === "points" ? "pts" : it.currency === "gems" ? "💎" : "🎟️";
                  const out = it.stock <= 0;
                  return (
                    <div key={it.id} className="border border-foreground/30 rounded p-2 text-xs bg-background">
                      <div className="flex justify-between items-start gap-2">
                        <div className="flex-1 min-w-0">
                          <div className="font-bold truncate">{it.icon} {it.name}</div>
                          <div className="opacity-70 truncate">{it.description}</div>
                          <div className="mt-1">{fmt(it.price)} {curIcon} · stock: <b className={out ? "text-red-400" : "text-green-400"}>{it.stock}</b></div>
                        </div>
                        <div className="flex flex-col gap-1">
                          <button disabled={out} onClick={() => buyShopItem(it)} className="border border-foreground/30 rounded px-2 py-1 hover:bg-foreground/10 disabled:opacity-40">buy</button>
                          {isAdmin && (
                            <>
                              <button onClick={() => restockItem(it.id, it.stock, 10)} className="border border-yellow-400/40 text-yellow-400 rounded px-1 text-[10px] hover:bg-yellow-400/10">+10</button>
                              <button onClick={() => deleteItem(it.id)} className="border border-red-400/40 text-red-400 rounded px-1 text-[10px] hover:bg-red-400/10">del</button>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </section>

        <aside className="space-y-2 order-2 max-h-[80vh] overflow-y-auto pr-1">
          <h2 className="text-lg font-bold mb-3 border-b border-foreground/20 pb-2 sticky top-0 bg-background">
            📂 /shady_upgrades
          </h2>
          {UPGRADES.map((u) => {
            const can = points >= u.baseCost;
            const n = owned[u.id] ?? 0;
            return (
              <button key={u.id} onClick={() => buy(u)} disabled={!can} className={`w-full text-left border border-foreground/30 p-2 rounded transition-all ${can ? "bg-foreground/10 hover:bg-foreground/20" : "opacity-40 cursor-not-allowed"}`}>
                <div className="flex items-start gap-2">
                  <div className="text-2xl">{u.icon}</div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-baseline gap-2">
                      <span className="font-bold truncate text-sm">{u.name}</span>
                      <span className="text-xs opacity-60">×{n}</span>
                    </div>
                    <div className="text-xs opacity-70 truncate">{u.desc}</div>
                    <div className="text-xs mt-1 flex justify-between">
                      <span>{fmt(u.baseCost)}</span>
                      <span className="opacity-70">+{u.cps}/s</span>
                    </div>
                  </div>
                </div>
              </button>
            );
          })}
        </aside>

        <aside className="order-3 flex flex-col border border-foreground/30 rounded h-[80vh] bg-foreground/5">
          <div className="border-b border-foreground/20 px-3 py-2 font-bold flex items-center justify-between">
            <span>💬 global_chat</span>
            {isAdmin && <span className="text-xs opacity-60" title="Type /help">/help</span>}
          </div>
          <div className="flex-1 overflow-y-auto p-2 space-y-1 text-sm">
            {chatMsgs.length === 0 && <div className="opacity-50 text-xs text-center py-4">no messages yet — say hi 👋</div>}
            {chatMsgs.map((m) => (
              <div key={m.id} className="break-words">
                <span className={m.is_admin ? "text-yellow-400 font-bold" : "font-bold opacity-80"}>
                  {m.is_admin && "👑"}
                  {m.username}:
                </span>{" "}
                <span>{m.content}</span>
              </div>
            ))}
            <div ref={chatEndRef} />
          </div>
          {cmdMsg && <div className="px-3 py-1 text-xs border-t border-foreground/20 bg-foreground/10">{cmdMsg}</div>}
          <form onSubmit={sendChat} className="border-t border-foreground/20 p-2 flex gap-1">
            <input value={chatInput} onChange={(e) => setChatInput(e.target.value)} placeholder={muted ? "🔇 muted" : isAdmin ? "msg or /command" : "type a message…"} maxLength={500} className="flex-1 bg-foreground/10 border border-foreground/30 rounded px-2 py-1 text-sm outline-none focus:border-foreground/60" />
            <button type="submit" className="border border-foreground/30 rounded px-3 py-1 text-sm hover:bg-foreground/10">send</button>
          </form>
        </aside>
      </main>

      <style>{`
        @keyframes float {
          0% { transform: translate(-50%, 0); opacity: 1; }
          100% { transform: translate(-50%, -80px); opacity: 0; }
        }
      `}</style>
    </div>
  );
}

function AdminInput({ label, value, setValue, onSend }: { label: string; value: string; setValue: (v: string) => void; onSend: () => void }) {
  return (
    <div className="flex items-center gap-1 border border-foreground/30 rounded px-2 py-1">
      <span className="opacity-70">{label}:</span>
      <input value={value} onChange={(e) => setValue(e.target.value)} className="w-16 bg-foreground/10 rounded px-1 outline-none" />
      <button onClick={onSend} className="border border-foreground/30 rounded px-2 hover:bg-foreground/10">go</button>
    </div>
  );
}
