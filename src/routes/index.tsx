import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState, useRef } from "react";

export const Route = createFileRoute("/")({
  component: Index,
  head: () => ({
    meta: [
      { title: "Fake Scam Clicker — A Harmless Parody Game" },
      {
        name: "description",
        content:
          "A satirical cookie-clicker style game. Click the computer, earn fake internet points. No actual scamming — it's a joke.",
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
];

function fmt(n: number) {
  if (n < 1000) return n.toFixed(n < 10 ? 1 : 0);
  const units = ["", "K", "M", "B", "T", "Qa", "Qi"];
  let i = 0;
  while (n >= 1000 && i < units.length - 1) {
    n /= 1000;
    i++;
  }
  return n.toFixed(2) + units[i];
}

function Index() {
  const [points, setPoints] = useState(0);
  const [owned, setOwned] = useState<Record<string, number>>({});
  const [floats, setFloats] = useState<{ id: number; x: number; y: number; v: number }[]>([]);
  const [pulse, setPulse] = useState(false);
  const [cheat, setCheat] = useState("");
  const [cheatMsg, setCheatMsg] = useState("");
  const floatId = useRef(0);

  const grant = (amount: number) => {
    setOwned((o) => {
      const next = { ...o };
      for (const u of UPGRADES) next[u.id] = (next[u.id] ?? 0) + amount;
      return next;
    });
  };

  const submitCheat = (e: React.FormEvent) => {
    e.preventDefault();
    const code = cheat.trim().toLowerCase();
    if (code === "") return;
    if (code === "100") {
      grant(100);
      setCheatMsg("✅ +100 of everything");
    } else if (code === "200") {
      grant(200);
      setCheatMsg("✅ +200 of everything");
    } else if (code === "500") {
      grant(500);
      setCheatMsg("✅ +500 of everything");
    } else if (code === "godmode") {
      grant(9999);
      setPoints((p) => p + 1e15);
      setCheatMsg("🔱 GODMODE ACTIVATED");
    } else {
      setCheatMsg("❌ invalid code");
    }
    setCheat("");
    setTimeout(() => setCheatMsg(""), 2000);
  };

  const cps = UPGRADES.reduce((s, u) => s + (owned[u.id] ?? 0) * u.cps, 0);
  const perClick = 1 + Math.floor(cps * 0.05);

  useEffect(() => {
    const t = setInterval(() => setPoints((p) => p + cps / 10), 100);
    return () => clearInterval(t);
  }, [cps]);

  const click = (e: React.MouseEvent) => {
    setPoints((p) => p + perClick);
    setPulse(true);
    setTimeout(() => setPulse(false), 80);
    const id = ++floatId.current;
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    setFloats((f) => [
      ...f,
      { id, x: e.clientX - rect.left, y: e.clientY - rect.top, v: perClick },
    ]);
    setTimeout(() => setFloats((f) => f.filter((x) => x.id !== id)), 900);
  };

  const cost = (u: Upgrade) => Math.ceil(u.baseCost * Math.pow(1.15, owned[u.id] ?? 0));
  const buy = (u: Upgrade) => {
    const c = cost(u);
    if (points < c) return;
    setPoints((p) => p - c);
    setOwned((o) => ({ ...o, [u.id]: (o[u.id] ?? 0) + 1 }));
  };

  return (
    <div className="min-h-screen bg-background text-foreground font-mono">
      <div className="border-b border-foreground/30 bg-foreground/5 px-4 py-2 text-center text-xs">
        ⚠️ PARODY GAME — No real scamming. No real money. Just clicks.
      </div>

      <header className="px-6 py-4 border-b border-foreground/20 flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-bold tracking-tight">
          <span className="opacity-60">$</span> ./fake-scam-clicker.exe
        </h1>
        <form onSubmit={submitCheat} className="flex items-center gap-2">
          <span className="text-xs opacity-60">cheat:</span>
          <input
            value={cheat}
            onChange={(e) => setCheat(e.target.value)}
            placeholder="enter code…"
            className="bg-foreground/10 border border-foreground/30 rounded px-2 py-1 text-sm font-mono outline-none focus:border-foreground/60 w-36"
          />
          <button
            type="submit"
            className="border border-foreground/30 rounded px-3 py-1 text-sm hover:bg-foreground/10"
          >
            run
          </button>
          {cheatMsg && <span className="text-xs opacity-80">{cheatMsg}</span>}
        </form>
      </header>

      <main className="grid lg:grid-cols-[1fr_400px] gap-6 p-6 max-w-7xl mx-auto">
        {/* Click area */}
        <section className="flex flex-col items-center justify-center min-h-[60vh]">
          <div className="text-center mb-6">
            <div className="text-sm opacity-60">FAKE INTERNET POINTS</div>
            <div className="text-6xl font-bold tabular-nums">{fmt(points)}</div>
            <div className="text-sm opacity-70 mt-1">
              {fmt(cps)}/sec · +{perClick}/click
            </div>
          </div>

          <button
            onClick={click}
            className={`relative select-none text-[12rem] leading-none transition-transform ${
              pulse ? "scale-95" : "scale-100"
            } hover:drop-shadow-[0_0_30px_oklch(0.92_0.18_145/0.6)] cursor-pointer`}
            aria-label="Click to scam (not really)"
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

          <div className="mt-8 text-center text-sm opacity-70 max-w-md">
            Click the computer to "scam." Buy upgrades to "scam" automatically.
            None of this does anything in real life. It's a joke. Please don't actually scam people.
          </div>
        </section>

        {/* Shop */}
        <aside className="space-y-2">
          <h2 className="text-lg font-bold mb-3 border-b border-foreground/20 pb-2">
            📂 /shady_upgrades
          </h2>
          {UPGRADES.map((u) => {
            const c = cost(u);
            const can = points >= c;
            const n = owned[u.id] ?? 0;
            return (
              <button
                key={u.id}
                onClick={() => buy(u)}
                disabled={!can}
                className={`w-full text-left border border-foreground/30 p-3 rounded transition-all ${
                  can
                    ? "bg-foreground/10 hover:bg-foreground/20 cursor-pointer hover:border-foreground/60"
                    : "opacity-40 cursor-not-allowed"
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className="text-3xl">{u.icon}</div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-baseline gap-2">
                      <span className="font-bold truncate">{u.name}</span>
                      <span className="text-xs opacity-60">×{n}</span>
                    </div>
                    <div className="text-xs opacity-70 truncate">{u.desc}</div>
                    <div className="text-sm mt-1 flex justify-between">
                      <span>cost: {fmt(c)}</span>
                      <span className="opacity-70">+{u.cps}/s</span>
                    </div>
                  </div>
                </div>
              </button>
            );
          })}
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
