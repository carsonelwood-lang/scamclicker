import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";

export const Route = createFileRoute("/")({
  component: Index,
  head: () => ({
    meta: [
      { title: "Vroomly — Fake Supercar Dealership (Parody)" },
      {
        name: "description",
        content:
          "Browse and 'buy' fake supercars with imaginary money. 100% parody — nothing is real.",
      },
    ],
  }),
});

type Car = {
  id: string;
  name: string;
  tagline: string;
  price: number;
  hp: number;
  topSpeed: number;
  zeroTo60: number;
  emoji: string;
  color: string;
};

const CARS: Car[] = [
  { id: "1", name: "Lamborgotti Veneficus", tagline: "Italian thunder, made up", price: 2_400_000, hp: 820, topSpeed: 355, zeroTo60: 2.4, emoji: "🏎️", color: "#ffb800" },
  { id: "2", name: "Ferreti Spaghettissima", tagline: "Sounds like pasta, drives like a dream", price: 1_900_000, hp: 780, topSpeed: 340, zeroTo60: 2.6, emoji: "🚗", color: "#e10600" },
  { id: "3", name: "Bugotti Cherrón", tagline: "1500 imaginary horsepower", price: 4_500_000, hp: 1500, topSpeed: 420, zeroTo60: 2.1, emoji: "🚙", color: "#0033a0" },
  { id: "4", name: "McLearn P2000", tagline: "British, fast, fictional", price: 3_100_000, hp: 980, topSpeed: 372, zeroTo60: 2.3, emoji: "🏎️", color: "#ff8a00" },
  { id: "5", name: "Porshe 919 Phantom", tagline: "You can't see it because it isn't real", price: 1_650_000, hp: 700, topSpeed: 330, zeroTo60: 2.7, emoji: "🚗", color: "#c0c0c0" },
  { id: "6", name: "Koenigseggz Jeskö", tagline: "More Z's than letters in your name", price: 3_800_000, hp: 1280, topSpeed: 410, zeroTo60: 2.2, emoji: "🚙", color: "#00d1b2" },
  { id: "7", name: "Aston Martyr DB-Fake", tagline: "James Bond's pretend backup car", price: 2_200_000, hp: 715, topSpeed: 339, zeroTo60: 2.8, emoji: "🏎️", color: "#1d4e2a" },
  { id: "8", name: "Pagana Huyara R", tagline: "Hand-built by imagination", price: 5_200_000, hp: 850, topSpeed: 360, zeroTo60: 2.5, emoji: "🚗", color: "#7a00ff" },
];

const STARTING_BALANCE = 10_000_000;

function fmtMoney(n: number) {
  return "$" + n.toLocaleString("en-US");
}

function Index() {
  const [balance, setBalance] = useState(STARTING_BALANCE);
  const [garage, setGarage] = useState<Car[]>([]);
  const [purchase, setPurchase] = useState<Car | null>(null);
  const [error, setError] = useState<string | null>(null);

  const buy = (car: Car) => {
    if (balance < car.price) {
      setError(`Not enough fake money for the ${car.name}.`);
      setTimeout(() => setError(null), 2500);
      return;
    }
    setBalance((b) => b - car.price);
    setGarage((g) => [...g, car]);
    setPurchase(car);
  };

  const reset = () => {
    setBalance(STARTING_BALANCE);
    setGarage([]);
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="border-b border-foreground/30 bg-foreground/5 px-4 py-2 text-center text-xs">
        ⚠️ PARODY — None of these cars exist. None of this money is real. You will not receive a car.
      </div>

      <header className="border-b border-foreground/20 px-6 py-5 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            VROOMLY<span className="opacity-60">™</span>
          </h1>
          <p className="text-sm opacity-70">Premium Imaginary Supercars · Est. 5 minutes ago</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-right">
            <div className="text-xs opacity-60">FAKE BALANCE</div>
            <div className="text-xl font-bold tabular-nums">{fmtMoney(balance)}</div>
          </div>
          <button
            onClick={reset}
            className="border border-foreground/40 hover:bg-foreground/10 px-3 py-2 text-sm rounded cursor-pointer"
          >
            Reset
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-6">
        {error && (
          <div className="mb-4 border border-foreground/40 bg-foreground/10 px-4 py-2 rounded text-sm">
            {error}
          </div>
        )}

        <section className="mb-10">
          <h2 className="text-xl font-bold mb-4 border-b border-foreground/20 pb-2">
            🏁 The Showroom
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {CARS.map((car) => (
              <article
                key={car.id}
                className="border border-foreground/30 rounded-lg overflow-hidden hover:border-foreground/60 transition flex flex-col"
              >
                <div
                  className="h-40 flex items-center justify-center text-7xl"
                  style={{ background: `linear-gradient(135deg, ${car.color}33, ${car.color}10)` }}
                >
                  <span style={{ filter: `drop-shadow(0 6px 12px ${car.color}88)` }}>
                    {car.emoji}
                  </span>
                </div>
                <div className="p-4 flex-1 flex flex-col">
                  <h3 className="font-bold text-lg leading-tight">{car.name}</h3>
                  <p className="text-xs opacity-70 mb-3">{car.tagline}</p>
                  <div className="grid grid-cols-3 gap-2 text-center text-xs mb-4">
                    <div><div className="opacity-60">HP</div><div className="font-bold">{car.hp}</div></div>
                    <div><div className="opacity-60">TOP</div><div className="font-bold">{car.topSpeed} km/h</div></div>
                    <div><div className="opacity-60">0–60</div><div className="font-bold">{car.zeroTo60}s</div></div>
                  </div>
                  <div className="mt-auto flex items-center justify-between gap-2">
                    <div className="font-bold tabular-nums">{fmtMoney(car.price)}</div>
                    <button
                      onClick={() => buy(car)}
                      className="border border-foreground/40 hover:bg-foreground hover:text-background px-3 py-1.5 rounded text-sm font-bold cursor-pointer transition"
                    >
                      Buy (fake)
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section>
          <h2 className="text-xl font-bold mb-4 border-b border-foreground/20 pb-2">
            🅿️ Your Imaginary Garage ({garage.length})
          </h2>
          {garage.length === 0 ? (
            <p className="text-sm opacity-60">Empty. Buy a car above. It will not arrive.</p>
          ) : (
            <ul className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {garage.map((car, i) => (
                <li key={i} className="border border-foreground/30 rounded p-3 flex items-center gap-3">
                  <span className="text-3xl">{car.emoji}</span>
                  <div className="flex-1 min-w-0">
                    <div className="font-bold truncate">{car.name}</div>
                    <div className="text-xs opacity-70">{fmtMoney(car.price)}</div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>

        <p className="text-xs opacity-50 mt-12 text-center max-w-xl mx-auto">
          Vroomly is a parody. Names, specs, and prices are made up. No vehicles will be
          delivered. No payment is processed. Please do not call our (nonexistent) sales line.
        </p>
      </main>

      {purchase && (
        <div
          className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50"
          onClick={() => setPurchase(null)}
        >
          <div
            className="bg-background border-2 border-foreground/60 rounded-lg p-6 max-w-md w-full text-center"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="text-6xl mb-3">{purchase.emoji}</div>
            <h3 className="text-2xl font-bold mb-1">Congrats! (not really)</h3>
            <p className="opacity-80 mb-4">
              You "bought" a <strong>{purchase.name}</strong> for{" "}
              <strong>{fmtMoney(purchase.price)}</strong>.
            </p>
            <p className="text-xs opacity-60 mb-5">
              Estimated delivery: never. This car does not exist.
            </p>
            <button
              onClick={() => setPurchase(null)}
              className="border border-foreground/40 hover:bg-foreground hover:text-background px-4 py-2 rounded font-bold cursor-pointer transition"
            >
              Cool, thanks
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
