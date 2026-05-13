import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState, useRef, useCallback } from "react";

export const Route = createFileRoute("/")({
  component: Index,
  head: () => ({
    meta: [
      { title: "Baby Boxer 9000 — Harmless Parody Game" },
      {
        name: "description",
        content:
          "A silly parody game where you press S to box cartoon babies. Not real. Level up your imaginary power.",
      },
    ],
  }),
});

function fmt(n: number) {
  if (n < 1000) return Math.floor(n).toString();
  const u = ["", "K", "M", "B", "T"];
  let i = 0;
  while (n >= 1000 && i < u.length - 1) {
    n /= 1000;
    i++;
  }
  return n.toFixed(2) + u[i];
}

type Baby = {
  id: number;
  x: number;
  y: number;
  hp: number;
  maxHp: number;
  hit: number;
};

type Hit = { id: number; x: number; y: number; dmg: number; crit: boolean };

function Index() {
  const [score, setScore] = useState(0);
  const [coins, setCoins] = useState(0);
  const [power, setPower] = useState(1);
  const [crit, setCrit] = useState(0); // crit chance %
  const [combo, setCombo] = useState(0);
  const [babies, setBabies] = useState<Baby[]>([]);
  const [hits, setHits] = useState<Hit[]>([]);
  const [shake, setShake] = useState(false);
  const nextId = useRef(1);
  const comboTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const spawn = useCallback(() => {
    setBabies((bs) => {
      if (bs.length >= 6) return bs;
      const id = nextId.current++;
      const hp = 3 + Math.floor(Math.random() * 4);
      return [
        ...bs,
        {
          id,
          x: 8 + Math.random() * 84,
          y: 15 + Math.random() * 70,
          hp,
          maxHp: hp,
          hit: 0,
        },
      ];
    });
  }, []);

  useEffect(() => {
    spawn();
    spawn();
    spawn();
    const t = setInterval(spawn, 1400);
    return () => clearInterval(t);
  }, [spawn]);

  const punch = useCallback(() => {
    setBabies((bs) => {
      if (bs.length === 0) return bs;
      const target = bs[0];
      const isCrit = Math.random() * 100 < crit;
      const dmg = isCrit ? power * 3 : power;
      const newHp = target.hp - dmg;

      const hitId = nextId.current++;
      setHits((h) => [
        ...h,
        { id: hitId, x: target.x, y: target.y, dmg, crit: isCrit },
      ]);
      setTimeout(
        () => setHits((h) => h.filter((x) => x.id !== hitId)),
        700,
      );

      setShake(true);
      setTimeout(() => setShake(false), 90);

      setCombo((c) => c + 1);
      if (comboTimer.current) clearTimeout(comboTimer.current);
      comboTimer.current = setTimeout(() => setCombo(0), 1500);

      if (newHp <= 0) {
        setScore((s) => s + dmg + 5);
        setCoins((c) => c + 1 + Math.floor(power / 4));
        return bs.slice(1).map((b, i) =>
          i === 0 ? b : b,
        );
      }
      return bs.map((b) =>
        b.id === target.id
          ? { ...b, hp: newHp, hit: Date.now() }
          : b,
      );
    });
    setScore((s) => s + power);
  }, [power, crit]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.repeat) return;
      if (e.key === "s" || e.key === "S") {
        e.preventDefault();
        punch();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [punch]);

  const upgrades = [
    {
      id: "power",
      name: "💪 Punch Power +1",
      cost: Math.ceil(10 * Math.pow(1.4, power - 1)),
      buy: () => setPower((p) => p + 1),
    },
    {
      id: "crit",
      name: "🎯 Crit Chance +5%",
      cost: Math.ceil(25 * Math.pow(1.5, crit / 5)),
      disabled: crit >= 80,
      buy: () => setCrit((c) => Math.min(80, c + 5)),
    },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground font-mono">
      <div className="border-b border-foreground/30 bg-foreground/5 px-4 py-2 text-center text-xs">
        ⚠️ PARODY GAME — Cartoon babies only. No real babies harmed. It's a
        joke.
      </div>

      <header className="px-6 py-4 border-b border-foreground/20 flex flex-wrap gap-4 items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">
          <span className="opacity-60">$</span> ./baby-boxer-9000.exe
        </h1>
        <div className="text-sm opacity-80">
          Press <kbd className="border border-foreground/40 px-2 py-0.5 rounded">S</kbd> to box
        </div>
      </header>

      <main className="grid lg:grid-cols-[1fr_320px] gap-6 p-4 lg:p-6 max-w-7xl mx-auto">
        <section>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4 text-center text-sm">
            <div className="border border-foreground/30 rounded p-2">
              <div className="opacity-60 text-xs">SCORE</div>
              <div className="text-lg font-bold tabular-nums">{fmt(score)}</div>
            </div>
            <div className="border border-foreground/30 rounded p-2">
              <div className="opacity-60 text-xs">COINS</div>
              <div className="text-lg font-bold tabular-nums">{fmt(coins)}</div>
            </div>
            <div className="border border-foreground/30 rounded p-2">
              <div className="opacity-60 text-xs">POWER</div>
              <div className="text-lg font-bold tabular-nums">{power}</div>
            </div>
            <div className="border border-foreground/30 rounded p-2">
              <div className="opacity-60 text-xs">CRIT</div>
              <div className="text-lg font-bold tabular-nums">{crit}%</div>
            </div>
          </div>

          <div
            className={`relative w-full aspect-[4/3] border-2 border-foreground/40 rounded-lg overflow-hidden bg-foreground/5 ${
              shake ? "translate-x-0.5 -translate-y-0.5" : ""
            } transition-transform`}
          >
            {/* ring */}
            <div className="absolute inset-4 border border-dashed border-foreground/30 rounded" />

            {babies.map((b, i) => (
              <div
                key={b.id}
                className="absolute -translate-x-1/2 -translate-y-1/2 select-none"
                style={{ left: `${b.x}%`, top: `${b.y}%` }}
              >
                <div
                  className={`text-5xl transition-transform ${
                    Date.now() - b.hit < 100 ? "scale-75 rotate-12" : "scale-100"
                  } ${i === 0 ? "drop-shadow-[0_0_12px_oklch(0.92_0.18_145/0.7)]" : "opacity-70"}`}
                >
                  👶
                </div>
                <div className="mt-1 w-12 h-1.5 bg-foreground/20 rounded overflow-hidden">
                  <div
                    className="h-full bg-foreground transition-all"
                    style={{ width: `${(b.hp / b.maxHp) * 100}%` }}
                  />
                </div>
                {i === 0 && (
                  <div className="text-[10px] text-center opacity-70 mt-0.5">
                    TARGET
                  </div>
                )}
              </div>
            ))}

            {hits.map((h) => (
              <div
                key={h.id}
                className={`absolute -translate-x-1/2 pointer-events-none font-bold animate-[float_0.7s_ease-out_forwards] ${
                  h.crit ? "text-3xl" : "text-xl"
                }`}
                style={{ left: `${h.x}%`, top: `${h.y}%` }}
              >
                {h.crit ? `CRIT! -${h.dmg}` : `-${h.dmg}`}
              </div>
            ))}

            {combo > 1 && (
              <div className="absolute top-2 right-3 text-sm font-bold opacity-80">
                COMBO ×{combo}
              </div>
            )}

            {babies.length === 0 && (
              <div className="absolute inset-0 flex items-center justify-center text-sm opacity-60">
                spawning...
              </div>
            )}
          </div>

          <button
            onClick={punch}
            className="mt-4 w-full border border-foreground/40 hover:bg-foreground/10 active:scale-95 transition py-3 rounded font-bold cursor-pointer"
          >
            👊 BOX [S]
          </button>

          <p className="mt-4 text-xs opacity-60 text-center">
            This is a cartoon parody. Babies are emoji. No real harm. Please
            don't actually box babies, that would be very bad.
          </p>
        </section>

        <aside>
          <h2 className="text-lg font-bold mb-3 border-b border-foreground/20 pb-2">
            🛒 /upgrades
          </h2>
          <div className="space-y-2">
            {upgrades.map((u) => {
              const can = coins >= u.cost && !u.disabled;
              return (
                <button
                  key={u.id}
                  onClick={() => {
                    if (!can) return;
                    setCoins((c) => c - u.cost);
                    u.buy();
                  }}
                  disabled={!can}
                  className={`w-full text-left border border-foreground/30 p-3 rounded transition ${
                    can
                      ? "hover:bg-foreground/15 cursor-pointer"
                      : "opacity-40 cursor-not-allowed"
                  }`}
                >
                  <div className="font-bold">{u.name}</div>
                  <div className="text-xs opacity-70 mt-1">
                    {u.disabled ? "MAXED" : `cost: ${u.cost} coins`}
                  </div>
                </button>
              );
            })}
          </div>
        </aside>
      </main>

      <style>{`
        @keyframes float {
          0% { transform: translate(-50%, 0); opacity: 1; }
          100% { transform: translate(-50%, -60px); opacity: 0; }
        }
      `}</style>
    </div>
  );
}
