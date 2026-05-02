import { useEffect, useState } from "react";

const API_URL = "/api";

interface Car {
  id: number;
  model: string;
  image: string;
  price_lakh: number;
  fuel: string;
  mileage_kmpl: number;
  safety_rating: number;
  boot_space_l: number;
  type: string;
  best_for: string;
  reason?: string;
  score?: number;
}

interface Filters {
  budget?: number;
  fuel?: string;
  usage?: string;
  priority?: string;
}

export default function App() {
  const [cars, setCars] = useState<Car[]>([]);
  const [filteredCars, setFilteredCars] = useState<Car[]>([]);
  const [filters, setFilters] = useState<Filters>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchCars();
  }, []);

  const fetchCars = async () => {
    try {
      const res = await fetch(`${API_URL}/cars`);
      const data = await res.json();

      setCars(data);
      setFilteredCars(data);
    } catch {
      setError("Unable to load cars.");
    }
  };

  const applyFilters = async () => {
  const hasAtLeastOneFilter =
    filters.budget ||
    filters.fuel ||
    filters.usage ||
    filters.priority;

  if (!hasAtLeastOneFilter) {
    setError("Please select at least one filter.");
    return;
  }

  setLoading(true);
  setError("");

  try {
    const activeFilters = Object.fromEntries(
      Object.entries(filters).filter(
        ([, value]) => value !== undefined && value !== ""
      )
    );

    const res = await fetch(`${API_URL}/shortlist`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(activeFilters),
    });

    const data = await res.json();
    const shortlist = Array.isArray(data) ? data : data.shortlist;

    setFilteredCars(shortlist);
  } catch {
    setError("Failed to filter cars.");
  } finally {
    setLoading(false);
  }
};

  const resetFilters = () => {
    setFilters({});
    setFilteredCars(cars);
    setError("");
  };

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="glass-header sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-6 py-5 flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-bold gradient-text">
              Car Advisor
            </h1>
            <p className="text-gray-500 text-sm mt-1">
              Smart recommendations for your next car
            </p>
          </div>

          <div className="badge-modern">
            {filteredCars.length} Cars
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="max-w-7xl mx-auto px-6 pt-10 pb-6">
        <div className="max-w-3xl">
          <h2 className="text-5xl font-bold leading-tight">
            Find your next car
            <span className="gradient-text"> with confidence</span>
          </h2>

          <p className="text-lg text-gray-500 mt-4">
            Explore premium recommendations based on your
            budget, fuel preference, driving style, and priorities.
          </p>
        </div>
      </section>

      {/* Main Layout */}
      <div className="max-w-7xl mx-auto px-6 pb-10 grid lg:grid-cols-4 gap-8">
        {/* Sidebar Filters */}
        <aside>
          <div className="card-premium rounded-3xl p-6 sticky top-24 border-glow">
            <h2 className="text-xl font-bold mb-6">
              Customize Search
            </h2>

            <div className="space-y-6">
              {/* Budget */}
              <div>
                <label className="font-medium block mb-3">
                  Budget
                </label>

                <input
                  type="range"
                  min="3"
                  max="30"
                  step="0.5"
                  value={filters.budget || 3}
                  onChange={(e) =>
                    setFilters({
                      ...filters,
                      budget: parseFloat(e.target.value),
                    })
                  }
                  className="w-full"
                />

                <div className="mt-3 badge-modern inline-block">
                  {filters.budget
                    ? `₹${filters.budget}L`
                    : "Not selected"}
                </div>
              </div>

              {/* Fuel */}
              <div>
                <label className="font-medium block mb-3">
                  Fuel Type
                </label>

                <select
                  className="input-modern w-full"
                  value={filters.fuel || ""}
                  onChange={(e) =>
                    setFilters({
                      ...filters,
                      fuel: e.target.value,
                    })
                  }
                >
                  <option value="">Select fuel</option>
                  <option>Petrol</option>
                  <option>Diesel</option>
                  <option>EV</option>
                  <option>Any</option>
                </select>
              </div>

              {/* Usage */}
              <div>
                <label className="font-medium block mb-3">
                  Usage
                </label>

                <select
                  className="input-modern w-full"
                  value={filters.usage || ""}
                  onChange={(e) =>
                    setFilters({
                      ...filters,
                      usage: e.target.value,
                    })
                  }
                >
                  <option value="">Select usage</option>
                  <option value="city">City</option>
                  <option value="highway">Highway</option>
                  <option value="family">Family</option>
                </select>
              </div>

              {/* Priority */}
              <div>
                <label className="font-medium block mb-3">
                  Priority
                </label>

                <select
                  className="input-modern w-full"
                  value={filters.priority || ""}
                  onChange={(e) =>
                    setFilters({
                      ...filters,
                      priority: e.target.value,
                    })
                  }
                >
                  <option value="">Select priority</option>
                  <option value="safety">Safety</option>
                  <option value="mileage">Mileage</option>
                  <option value="boot">Boot Space</option>
                </select>
              </div>

              {/* Buttons */}
              <div className="space-y-3 pt-2">
                <button
                  onClick={applyFilters}
                  disabled={loading}
                  className="btn-primary w-full"
                >
                  {loading ? "Finding Cars..." : "Apply Filters"}
                </button>

                <button
                  onClick={resetFilters}
                  className="btn-secondary w-full"
                >
                  Reset Filters
                </button>
              </div>
            </div>
          </div>
        </aside>

        {/* Car Grid */}
        <main className="lg:col-span-3">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 rounded-2xl p-4 mb-6">
              {error}
            </div>
          )}

          {/* Loading State */}
          {loading ? (
            <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((item) => (
                <div
                  key={item}
                  className="card-premium rounded-3xl p-5"
                >
                  <div className="skeleton h-44 w-full mb-4 rounded-2xl" />
                  <div className="skeleton h-6 w-40 mb-4" />
                  <div className="space-y-3">
                    <div className="skeleton h-4 w-full" />
                    <div className="skeleton h-4 w-full" />
                    <div className="skeleton h-4 w-full" />
                  </div>
                </div>
              ))}
            </div>
          ) : filteredCars.length > 0 ? (
            <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredCars.map((car) => (
                <div
                  key={car.id}
                  className="card-premium rounded-3xl hover-lift fade-in overflow-hidden"
                >
                  {/* Car Image */}
                  <div className="h-44 overflow-hidden">
                    <img
                      src={car.image}
                      alt={car.model}
                      className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                      loading="lazy"
                      onError={(e) => {
                        e.currentTarget.src =
                          "https://via.placeholder.com/500x300?text=No+Image";
                      }}
                    />
                  </div>

                  {/* Content */}
                  <div className="p-5">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-bold text-xl">
                        {car.model}
                      </h3>

                      {car.score && (
                        <span className="badge-modern">
                          {car.score}/100
                        </span>
                      )}
                    </div>

                    <div className="flex gap-2 mb-4 flex-wrap">
                      <span className="chip">{car.type}</span>
                      <span className="chip">{car.fuel}</span>
                    </div>

                    <div className="space-y-3 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-500">
                          Price
                        </span>
                        <span className="font-medium">
                          ₹{car.price_lakh}L
                        </span>
                      </div>

                      <div className="flex justify-between">
                        <span className="text-gray-500">
                          Mileage
                        </span>
                        <span className="font-medium">
                          {car.mileage_kmpl} kmpl
                        </span>
                      </div>

                      <div className="flex justify-between">
                        <span className="text-gray-500">
                          Safety
                        </span>
                        <span className="font-medium">
                          {car.safety_rating}/5
                        </span>
                      </div>

                      <div className="flex justify-between">
                        <span className="text-gray-500">
                          Boot Space
                        </span>
                        <span className="font-medium">
                          {car.boot_space_l}L
                        </span>
                      </div>
                    </div>

                    {car.reason && (
                      <div className="mt-5 bg-slate-50 rounded-2xl p-4 text-sm text-gray-600">
                        {car.reason}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="card-premium rounded-3xl p-12 text-center">
              <h3 className="text-xl font-semibold mb-2">
                No cars found
              </h3>
              <p className="text-gray-500">
                Try changing your filters.
              </p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}