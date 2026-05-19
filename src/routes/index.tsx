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
  const [owned, setOwned] = useState<Record<string, number>>({});
  const [username, setUsername] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);
  const [floats, setFloats] = useState<{ id: number; x: number; y: number; v: number }[]>([]);
  const [pulse, setPulse] = useState(false);
  const [chatInput, setChatInput] = useState("");
  const [chatMsgs, setChatMsgs] = useState<ChatMsg[]>([]);
  const [onlineCount, setOnlineCount] = useState(0);
  const [banner, setBanner] = useState<{ from: string; msg: string } | null>(null);
  const [cmdMsg, setCmdMsg] = useState("");
  const [adminGiveAmt, setAdminGiveAmt] = useState("1000");
  const [adminGiveAllN, setAdminGiveAllN] = useState("100");
  const [adminAnnounce, setAdminAnnounce] = useState("");
  const [adminUserTarget, setAdminUserTarget] = useState("");
  const [adminPanelOpen, setAdminPanelOpen] = useState(true);
  const floatId = useRef(0);
  const stateRef = useRef({ points: 0, owned: {} as Record<string, number> });
  const chatEndRef = useRef<HTMLDivElement>(null);
  const loadedRef = useRef(false);

  // load profile + role
  useEffect(() => {
    let mounted = true;
    (async () => {
      const [{ data: prof }, { data: roles }] = await Promise.all([
        supabase.from("profiles").select("username, points, owned").eq("id", userId).maybeSingle(),
        supabase.from("user_roles").select("role").eq("user_id", userId),
      ]);
      if (!mounted) return;
      if (prof) {
        setUsername(prof.username);
        setPoints(Number(prof.points) || 0);
        setOwned((prof.owned as Record<string, number>) || {});
        stateRef.current = {
          points: Number(prof.points) || 0,
          owned: (prof.owned as Record<string, number>) || {},
        };
      }
      setIsAdmin(!!roles?.some((r) => r.role === "admin"));
      loadedRef.current = true;

      // mark online
      await supabase
        .from("profiles")
        .update({ is_online: true, last_seen: new Date().toISOString() })
        .eq("id", userId);

      // load recent chat
      const { data: msgs } = await supabase
        .from("chat_messages")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(50);
      if (msgs && mounted) setChatMsgs(msgs.reverse() as ChatMsg[]);

      // online count
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

  // sync state ref
  useEffect(() => {
    stateRef.current = { points, owned };
  }, [points, owned]);

  // periodic save + heartbeat
  useEffect(() => {
    const save = () => {
      if (!loadedRef.current) return;
      supabase
        .from("profiles")
        .update({
          points: stateRef.current.points,
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

  // save + mark offline on unload
  useEffect(() => {
    const handler = () => {
      if (!loadedRef.current) return;
      supabase
        .from("profiles")
        .update({
          points: stateRef.current.points,
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


  // toggle admin panel with "9" key (admins only)
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

  // realtime: chat + broadcasts + online count

  useEffect(() => {
    const chatCh = supabase
      .channel("chat-room")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "chat_messages" },
        (payload) => {
          setChatMsgs((m) => [...m, payload.new as ChatMsg].slice(-100));
        }
      )
      .on(
        "postgres_changes",
        { event: "DELETE", schema: "public", table: "chat_messages" },
        (payload) => {
          setChatMsgs((m) => m.filter((x) => x.id !== (payload.old as { id: string }).id));
        }
      )
      .subscribe();

    const bcCh = supabase
      .channel("broadcasts-room")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "broadcasts" },
        (payload) => {
          applyBroadcast(payload.new as { kind: string; payload: Record<string, unknown>; admin_name: string });
        }
      )
      .subscribe();

    const presenceCh = supabase
      .channel("profiles-online")
      .on(
        "postgres_changes",
        { event: "UPDATE", schema: "public", table: "profiles" },
        async () => {
          const { count } = await supabase
            .from("profiles")
            .select("id", { count: "exact", head: true })
            .eq("is_online", true);
          setOnlineCount(count ?? 0);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(chatCh);
      supabase.removeChannel(bcCh);
      supabase.removeChannel(presenceCh);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // scroll chat
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMsgs]);

  const cps = UPGRADES.reduce((s, u) => s + (owned[u.id] ?? 0) * u.cps, 0);
  const perClick = 1 + Math.floor(cps * 0.05);

  // tick
  useEffect(() => {
    const t = setInterval(() => setPoints((p) => p + cps / 10), 100);
    return () => clearInterval(t);
  }, [cps]);

  const applyBroadcast = (b: { kind: string; payload: Record<string, unknown>; admin_name: string }) => {
    const adminName = b.admin_name;
    if (b.kind === "give_points") {
      const amt = Number(b.payload.amount) || 0;
      setPoints((p) => p + amt);
      setBanner({ from: adminName, msg: `gave everyone +${fmt(amt)} points` });
    } else if (b.kind === "give_all") {
      const n = Number(b.payload.amount) || 0;
      setOwned((o) => {
        const nx = { ...o };
        for (const u of UPGRADES) nx[u.id] = (nx[u.id] ?? 0) + n;
        return nx;
      });
      setBanner({ from: adminName, msg: `gave everyone +${n} of every upgrade` });
    } else if (b.kind === "godmode") {
      setOwned((o) => {
        const nx = { ...o };
        for (const u of UPGRADES) nx[u.id] = (nx[u.id] ?? 0) + 9999;
        return nx;
      });
      setPoints((p) => p + 1e15);
      setBanner({ from: adminName, msg: `🔱 GODMODE for all` });
    } else if (b.kind === "announce") {
      setBanner({ from: adminName, msg: String(b.payload.text || "") });
    } else if (b.kind === "reset") {
      setPoints(0);
      setOwned({});
      setBanner({ from: adminName, msg: "wiped everyone's progress 💀" });
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

  const runCommand = async (raw: string): Promise<boolean> => {
    if (!raw.startsWith("/")) return false;
    const parts = raw.slice(1).split(/\s+/);
    const cmd = parts[0].toLowerCase();
    const arg = parts.slice(1).join(" ");

    if (cmd === "help") {
      showCmd(
        isAdmin
          ? "/give N · /giveall N · /godmode · /announce <msg> · /reset · /grantadmin <user> · /revokeadmin <user>"
          : "no commands available — you're not admin"
      );
      return true;
    }

    if (!isAdmin) {
      showCmd("❌ admin only");
      return true;
    }

    const broadcast = async (kind: string, payload: Record<string, unknown>) => {
      const { error } = await supabase
        .from("broadcasts")
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        .insert({ admin_id: userId, admin_name: username, kind, payload: payload as any });
      if (error) showCmd("❌ " + error.message);
      else showCmd("✅ sent");
    };

    if (cmd === "give") {
      const n = Number(arg);
      if (!n || n <= 0) return showCmd("usage: /give <amount>"), true;
      await broadcast("give_points", { amount: n });
    } else if (cmd === "giveall") {
      const n = Number(arg);
      if (!n || n <= 0) return showCmd("usage: /giveall <n>"), true;
      await broadcast("give_all", { amount: n });
    } else if (cmd === "godmode") {
      await broadcast("godmode", {});
    } else if (cmd === "announce") {
      if (!arg) return showCmd("usage: /announce <msg>"), true;
      await broadcast("announce", { text: arg });
    } else if (cmd === "reset") {
      await broadcast("reset", {});
    } else if (cmd === "grantadmin") {
      if (!arg) return showCmd("usage: /grantadmin <username>"), true;
      const { data: prof } = await supabase
        .from("profiles")
        .select("id")
        .eq("username", arg)
        .maybeSingle();
      if (!prof) return showCmd("❌ user not found"), true;
      const { error } = await supabase
        .from("user_roles")
        .insert({ user_id: prof.id, role: "admin" });
      showCmd(error ? "❌ " + error.message : `✅ ${arg} is now admin`);
    } else if (cmd === "revokeadmin") {
      if (!arg) return showCmd("usage: /revokeadmin <username>"), true;
      const { data: prof } = await supabase
        .from("profiles")
        .select("id")
        .eq("username", arg)
        .maybeSingle();
      if (!prof) return showCmd("❌ user not found"), true;
      const { error } = await supabase
        .from("user_roles")
        .delete()
        .eq("user_id", prof.id)
        .eq("role", "admin");
      showCmd(error ? "❌ " + error.message : `✅ revoked ${arg}`);
    } else {
      showCmd("❌ unknown command — try /help");
    }
    return true;
  };

  const sendChat = async (e: React.FormEvent) => {
    e.preventDefault();
    const text = chatInput.trim();
    if (!text) return;
    setChatInput("");
    if (await runCommand(text)) return;
    const { error } = await supabase.from("chat_messages").insert({
      user_id: userId,
      username,
      content: text.slice(0, 500),
      is_admin: isAdmin,
    });
    if (error) showCmd("❌ " + error.message);
  };

  const logout = async () => {
    await supabase.from("profiles").update({ is_online: false }).eq("id", userId);
    await supabase.auth.signOut();
  };

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

      <header className="px-6 py-4 border-b border-foreground/20 flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-bold tracking-tight">
          <span className="opacity-60">$</span> ./fake-scam-clicker.exe
        </h1>
        <div className="flex items-center gap-3 text-sm">
          <span className="opacity-70">🟢 {onlineCount} online</span>
          <span>
            {isAdmin && (
              <button
                onClick={() => setAdminPanelOpen((v) => !v)}
                title="Press 9 to toggle"
                className="text-yellow-400 font-bold mr-1 hover:underline"
              >[ADMIN]</button>
            )}
            <span className="opacity-80">{username}</span>
          </span>
          <button
            onClick={logout}
            className="border border-foreground/30 rounded px-2 py-1 text-xs hover:bg-foreground/10"
          >
            log out
          </button>
        </div>
      </header>

      {/* Cheat code bar */}
      <div className="border-b border-foreground/20 bg-foreground/5 px-4 py-2 flex flex-wrap items-center justify-center gap-2 text-xs">
        <span className="opacity-70">🎮 cheat code:</span>
        <form
          onSubmit={(e) => { e.preventDefault(); applyCheat(cheatInput); setCheatInput(""); }}
          className="flex gap-1"
        >
          <input
            value={cheatInput}
            onChange={(e) => setCheatInput(e.target.value)}
            placeholder="enter code…"
            className="bg-foreground/10 border border-foreground/30 rounded px-2 py-1 outline-none focus:border-foreground/60 w-32"
          />
          <button className="border border-foreground/30 rounded px-2 py-1 hover:bg-foreground/10">go</button>
        </form>
        {["100", "200", "500", "GODMODE"].map((c) => (
          <button
            key={c}
            onClick={() => applyCheat(c)}
            className="border border-foreground/30 rounded px-2 py-1 hover:bg-foreground/10"
          >
            {c}
          </button>
        ))}
        {cheatMsg && <span className="opacity-80">— {cheatMsg}</span>}
      </div>

      {isAdmin && adminPanelOpen && (
        <div className="border-b border-yellow-400/40 bg-yellow-400/5 px-4 py-3">
          <div className="max-w-[1500px] mx-auto flex flex-wrap items-center gap-2 text-xs">
            <span className="text-yellow-400 font-bold">👑 ADMIN PANEL</span>

            <div className="flex items-center gap-1 border border-foreground/30 rounded px-2 py-1">
              <span className="opacity-70">give pts:</span>
              <input
                value={adminGiveAmt}
                onChange={(e) => setAdminGiveAmt(e.target.value)}
                className="w-20 bg-foreground/10 rounded px-1 outline-none"
              />
              <button
                onClick={() => runCommand(`/give ${adminGiveAmt}`)}
                className="border border-foreground/30 rounded px-2 hover:bg-foreground/10"
              >send</button>
            </div>

            <div className="flex items-center gap-1 border border-foreground/30 rounded px-2 py-1">
              <span className="opacity-70">give N of all:</span>
              <input
                value={adminGiveAllN}
                onChange={(e) => setAdminGiveAllN(e.target.value)}
                className="w-16 bg-foreground/10 rounded px-1 outline-none"
              />
              <button
                onClick={() => runCommand(`/giveall ${adminGiveAllN}`)}
                className="border border-foreground/30 rounded px-2 hover:bg-foreground/10"
              >send</button>
            </div>

            <button
              onClick={() => runCommand("/godmode")}
              className="border border-foreground/30 rounded px-2 py-1 hover:bg-foreground/10"
            >🔱 godmode all</button>

            <button
              onClick={() => { if (confirm("Wipe everyone's progress?")) runCommand("/reset"); }}
              className="border border-red-400/50 text-red-400 rounded px-2 py-1 hover:bg-red-400/10"
            >💀 reset all</button>

            <div className="flex items-center gap-1 border border-foreground/30 rounded px-2 py-1">
              <input
                value={adminAnnounce}
                onChange={(e) => setAdminAnnounce(e.target.value)}
                placeholder="announce…"
                className="w-32 bg-foreground/10 rounded px-1 outline-none"
              />
              <button
                onClick={() => { if (adminAnnounce.trim()) { runCommand(`/announce ${adminAnnounce}`); setAdminAnnounce(""); } }}
                className="border border-foreground/30 rounded px-2 hover:bg-foreground/10"
              >📣</button>
            </div>

            <div className="flex items-center gap-1 border border-foreground/30 rounded px-2 py-1">
              <span className="opacity-70">user:</span>
              <input
                value={adminUserTarget}
                onChange={(e) => setAdminUserTarget(e.target.value)}
                placeholder="username"
                className="w-24 bg-foreground/10 rounded px-1 outline-none"
              />
              <button
                onClick={() => adminUserTarget && runCommand(`/grantadmin ${adminUserTarget}`)}
                className="border border-foreground/30 rounded px-2 hover:bg-foreground/10"
              >+admin</button>
              <button
                onClick={() => adminUserTarget && runCommand(`/revokeadmin ${adminUserTarget}`)}
                className="border border-foreground/30 rounded px-2 hover:bg-foreground/10"
              >-admin</button>
            </div>

            {cmdMsg && <span className="opacity-80">— {cmdMsg}</span>}
          </div>
        </div>
      )}

      <main className="grid lg:grid-cols-[1fr_360px_320px] gap-4 p-4 max-w-[1500px] mx-auto">
        {/* Click area */}
        <section className="flex flex-col items-center justify-center min-h-[60vh] order-1">
          <div className="text-center mb-6">
            <div className="text-sm opacity-60">FAKE INTERNET POINTS</div>
            <div className="text-6xl font-bold tabular-nums">{fmt(points)}</div>
            <div className="text-sm opacity-70 mt-1">
              {fmt(cps)}/sec · +{perClick}/click
            </div>
          </div>

          <button
            onClick={click}
            className={`relative select-none text-[10rem] leading-none transition-transform ${
              pulse ? "scale-95" : "scale-100"
            } cursor-pointer`}
            aria-label="Click"
          >
            🖥️
            {floats.map((f) => (
              <span
                key={f.id}
                className="pointer-events-none absolute text-2xl font-bold animate-[float_0.9s_ease-out_forwards]"
                style={{ left: f.x, top: f.y }}
              >
                +{f.v}
              </span>
            ))}
          </button>
        </section>

        {/* Shop */}
        <aside className="space-y-2 order-2 max-h-[80vh] overflow-y-auto pr-1">
          <h2 className="text-lg font-bold mb-3 border-b border-foreground/20 pb-2 sticky top-0 bg-background">
            📂 /shady_upgrades
          </h2>
          {UPGRADES.map((u) => {
            const can = points >= u.baseCost;
            const n = owned[u.id] ?? 0;
            return (
              <button
                key={u.id}
                onClick={() => buy(u)}
                disabled={!can}
                className={`w-full text-left border border-foreground/30 p-2 rounded transition-all ${
                  can ? "bg-foreground/10 hover:bg-foreground/20" : "opacity-40 cursor-not-allowed"
                }`}
              >
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

        {/* Chat */}
        <aside className="order-3 flex flex-col border border-foreground/30 rounded h-[80vh] bg-foreground/5">
          <div className="border-b border-foreground/20 px-3 py-2 font-bold flex items-center justify-between">
            <span>💬 global_chat</span>
            {isAdmin && (
              <span className="text-xs opacity-60" title="Type /help for commands">/help</span>
            )}
          </div>
          <div className="flex-1 overflow-y-auto p-2 space-y-1 text-sm">
            {chatMsgs.length === 0 && (
              <div className="opacity-50 text-xs text-center py-4">no messages yet — say hi 👋</div>
            )}
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
          {cmdMsg && (
            <div className="px-3 py-1 text-xs border-t border-foreground/20 bg-foreground/10">
              {cmdMsg}
            </div>
          )}
          <form onSubmit={sendChat} className="border-t border-foreground/20 p-2 flex gap-1">
            <input
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              placeholder={isAdmin ? "msg or /command" : "type a message…"}
              maxLength={500}
              className="flex-1 bg-foreground/10 border border-foreground/30 rounded px-2 py-1 text-sm outline-none focus:border-foreground/60"
            />
            <button
              type="submit"
              className="border border-foreground/30 rounded px-3 py-1 text-sm hover:bg-foreground/10"
            >
              send
            </button>
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
