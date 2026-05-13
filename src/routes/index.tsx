import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";

export const Route = createFileRoute("/")({
  component: Index,
  head: () => ({
    meta: [
      { title: "Vroomly — Supercar Showroom" },
      {
        name: "description",
        content:
          "Browse real supercars and 'buy' them with imaginary money. Showroom-style spec sheets and pretend purchases.",
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
  image: string;
};

// Real cars, real specs (approx). Photos via Unsplash.
const CARS: Car[] = [
  {
    id: "1",
    name: "Lamborghini Aventador SVJ",
    tagline: "6.5L naturally aspirated V12",
    price: 517_770,
    hp: 759,
    topSpeed: 350,
    zeroTo60: 2.8,
    image: "https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=1200&q=80",
  },
  {
    id: "2",
    name: "Ferrari SF90 Stradale",
    tagline: "Plug-in hybrid, 4WD, twin-turbo V8",
    price: 524_275,
    hp: 986,
    topSpeed: 340,
    zeroTo60: 2.5,
    image: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=1200&q=80",
  },
  {
    id: "3",
    name: "Bugatti Chiron Super Sport",
    tagline: "Quad-turbo W16, 1600 hp",
    price: 3_825_000,
    hp: 1577,
    topSpeed: 440,
    zeroTo60: 2.4,
    image: "https://images.unsplash.com/photo-1607603750909-408e193868c7?w=1200&q=80",
  },
  {
    id: "4",
    name: "McLaren 765LT",
    tagline: "Long Tail, twin-turbo V8",
    price: 382_500,
    hp: 755,
    topSpeed: 330,
    zeroTo60: 2.7,
    image: "https://images.unsplash.com/photo-1612825173281-9a193378527e?w=1200&q=80",
  },
  {
    id: "5",
    name: "Porsche 911 GT3 RS",
    tagline: "Track weapon, 9000 rpm flat-six",
    price: 241_300,
    hp: 518,
    topSpeed: 296,
    zeroTo60: 3.0,
    image: "https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?w=1200&q=80",
  },
  {
    id: "6",
    name: "Koenigsegg Jesko Absolut",
    tagline: "Built for the highest speed possible",
    price: 2_800_000,
    hp: 1600,
    topSpeed: 480,
    zeroTo60: 2.5,
    image: "https://images.unsplash.com/photo-1611821064430-0d40291d0f0b?w=1200&q=80",
  },
  {
    id: "7",
    name: "Aston Martin Valkyrie",
    tagline: "F1-derived 6.5L V12 hybrid",
    price: 3_000_000,
    hp: 1160,
    topSpeed: 354,
    zeroTo60: 2.5,
    image: "https://images.unsplash.com/photo-1626668893632-6f3a4466d22f?w=1200&q=80",
  },
  {
    id: "8",
    name: "Pagani Huayra R",
    tagline: "Track-only, 6.0L V12, no turbos",
    price: 2_600_000,
    hp: 838,
    topSpeed: 383,
    zeroTo60: 2.7,
    image: "https://images.unsplash.com/photo-1625231334168-35067f8853ed?w=1200&q=80",
  },
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
      setError(`Not enough balance for the ${car.name}.`);
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
      <header className="border-b border-foreground/20 px-6 py-5 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            VROOMLY<span className="opacity-60">™</span>
          </h1>
          <p className="text-sm opacity-70">The Supercar Showroom</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-right">
            <div className="text-xs opacity-60">BALANCE</div>
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
                <div className="aspect-[16/10] overflow-hidden bg-foreground/5">
                  <img
                    src={car.image}
                    alt={car.name}
                    loading="lazy"
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                  />
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
                      Buy
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section>
          <h2 className="text-xl font-bold mb-4 border-b border-foreground/20 pb-2">
            🅿️ Your Garage ({garage.length})
          </h2>
          {garage.length === 0 ? (
            <p className="text-sm opacity-60">Empty. Buy a car above.</p>
          ) : (
            <ul className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {garage.map((car, i) => (
                <li key={i} className="border border-foreground/30 rounded p-3 flex items-center gap-3">
                  <img src={car.image} alt={car.name} className="w-16 h-12 object-cover rounded" />
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
          Showroom demo — purchases are simulated and no payment is processed.
        </p>
      </main>

      {purchase && (
        <div
          className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50"
          onClick={() => setPurchase(null)}
        >
          <div
            className="bg-background border-2 border-foreground/60 rounded-lg overflow-hidden max-w-md w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <img src={purchase.image} alt={purchase.name} className="w-full aspect-[16/10] object-cover" />
            <div className="p-6 text-center">
              <h3 className="text-2xl font-bold mb-1">It's yours.</h3>
              <p className="opacity-80 mb-4">
                You bought a <strong>{purchase.name}</strong> for{" "}
                <strong>{fmtMoney(purchase.price)}</strong>.
              </p>
              <button
                onClick={() => setPurchase(null)}
                className="border border-foreground/40 hover:bg-foreground hover:text-background px-4 py-2 rounded font-bold cursor-pointer transition"
              >
                Add to garage
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
