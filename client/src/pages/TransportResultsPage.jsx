// Paste your TransportResultsPage.jsx content here
import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaFilter, FaSortAmountDown, FaTimes, FaChevronDown,
  FaBus, FaTrain, FaPlane, FaSearch, FaHotel, FaArrowRight
} from "react-icons/fa";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import TransportCard from "../components/TransportCard";
import SearchForm from "../components/SearchForm";
import LoadingSpinner from "../components/LoadingSpinner";
import { useSearch } from "../App";
import { formatBookingDate } from "../utils/formatDate";
import { ALL_LOCATIONS, PRICE_RANGES } from "../utils/constants";
import transportService from "../services/transport.service";

// ── Mock data generator (used when backend is unavailable) ────────────────────
const MOCK_OPERATORS = {
  bus: ["Shyamoli Paribahan", "Hanif Enterprise", "Green Line", "Soudia", "Na-Stara"],
  train: ["Bangladesh Railway"],
  flight: ["Biman Bangladesh Airlines", "US-Bangla Airlines", "Novoair"],
};

const MOCK_CLASSES = {
  bus: ["AC", "Non-AC", "Sleeper AC"],
  train: ["Shovon", "Shovon Chair", "Snigdha", "AC Berth"],
  flight: ["Economy", "Business"],
};

const generateMockSchedules = (type, origin, destination, date, count = 8) => {
  const operators = MOCK_OPERATORS[type] || MOCK_OPERATORS.bus;
  const classes = MOCK_CLASSES[type] || MOCK_CLASSES.bus;
  const baseDate = date ? new Date(date) : new Date();

  return Array.from({ length: count }, (_, i) => {
    const depHour = 6 + i * 2;
    const durationMins = type === "bus" ? 180 + i * 15 : type === "train" ? 240 + i * 20 : 60 + i * 10;
    const dep = new Date(baseDate);
    dep.setHours(depHour, 0, 0, 0);
    const arr = new Date(dep.getTime() + durationMins * 60000);
    const prices = { bus: 350 + i * 80, train: 400 + i * 100, flight: 3500 + i * 800 };

    return {
      id: `${type}-${i + 1}`,
      type,
      operator: operators[i % operators.length],
      from: origin || "Dhaka",
      to: destination || "Chittagong",
      departureTime: dep.toISOString(),
      arrivalTime: arr.toISOString(),
      price: prices[type],
      class: classes[i % classes.length],
      seats: { available: Math.max(0, 40 - i * 5), total: 40 },
      rating: (3.5 + (i % 3) * 0.5).toFixed(1),
      amenities: ["ac", "wifi", "charging"].slice(0, (i % 3) + 1),
      ...(type === "bus" ? { busNumber: `BD-${1000 + i}` } : {}),
      ...(type === "train" ? { trainNumber: `T-${700 + i}` } : {}),
      ...(type === "flight" ? { flightNumber: `BG-${200 + i}` } : {}),
    };
  });
};

// ── Sort Options ──────────────────────────────────────────────────────────────
const SORT_OPTIONS = [
  { value: "departure", label: "Departure Time" },
  { value: "price_asc", label: "Price: Low to High" },
  { value: "price_desc", label: "Price: High to Low" },
  { value: "duration", label: "Shortest Duration" },
  { value: "rating", label: "Highest Rated" },
];

export default function TransportResultsPage() {
  const navigate = useNavigate();
  const { searchParams } = useSearch();
  const { type, origin, destination, date, passengers } = searchParams;

  const [schedules, setSchedules] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [sortBy, setSortBy] = useState("departure");
  const [filters, setFilters] = useState({
    priceRange: null,
    operators: [],
    classes: [],
    amenities: [],
    timeOfDay: [], // morning | afternoon | evening | night
  });

  const originLabel = ALL_LOCATIONS.find((l) => l.value === origin)?.label || origin;
  const destLabel = ALL_LOCATIONS.find((l) => l.value === destination)?.label || destination;

  // ── Fetch Schedules ────────────────────────────────────────────────────────
  useEffect(() => {
    if (!origin || !destination) { navigate("/search"); return; }
    setLoading(true);
    const fetch = async () => {
      try {
        const data = await transportService.search({ type, origin, destination, date, passengers });
        setSchedules(data);
      } catch {
        // Fallback to mock data
        setSchedules(generateMockSchedules(type, originLabel, destLabel, date));
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [type, origin, destination, date, passengers]);

  // ── Apply Filters + Sort ──────────────────────────────────────────────────
  useEffect(() => {
    let result = [...schedules];

    if (filters.priceRange) {
      result = result.filter(
        (s) => s.price >= filters.priceRange.min && s.price <= (filters.priceRange.max || Infinity)
      );
    }
    if (filters.operators.length) {
      result = result.filter((s) => filters.operators.includes(s.operator));
    }
    if (filters.classes.length) {
      result = result.filter((s) => filters.classes.includes(s.class));
    }
    if (filters.amenities.length) {
      result = result.filter((s) =>
        filters.amenities.every((a) => (s.amenities || []).includes(a))
      );
    }
    if (filters.timeOfDay.length) {
      result = result.filter((s) => {
        const hour = new Date(s.departureTime).getHours();
        return filters.timeOfDay.some((t) => {
          if (t === "morning") return hour >= 5 && hour < 12;
          if (t === "afternoon") return hour >= 12 && hour < 17;
          if (t === "evening") return hour >= 17 && hour < 21;
          if (t === "night") return hour >= 21 || hour < 5;
          return false;
        });
      });
    }

    // Sort
    result.sort((a, b) => {
      if (sortBy === "departure") return new Date(a.departureTime) - new Date(b.departureTime);
      if (sortBy === "price_asc") return a.price - b.price;
      if (sortBy === "price_desc") return b.price - a.price;
      if (sortBy === "duration") {
        const dA = new Date(a.arrivalTime) - new Date(a.departureTime);
        const dB = new Date(b.arrivalTime) - new Date(b.departureTime);
        return dA - dB;
      }
      if (sortBy === "rating") return (b.rating || 0) - (a.rating || 0);
      return 0;
    });

    setFiltered(result);
  }, [schedules, filters, sortBy]);

  const toggleFilter = (key, value) => {
    setFilters((prev) => {
      const arr = prev[key];
      return {
        ...prev,
        [key]: arr.includes(value) ? arr.filter((v) => v !== value) : [...arr, value],
      };
    });
  };

  const clearFilters = () =>
    setFilters({ priceRange: null, operators: [], classes: [], amenities: [], timeOfDay: [] });

  const activeFilterCount =
    (filters.priceRange ? 1 : 0) +
    filters.operators.length +
    filters.classes.length +
    filters.amenities.length +
    filters.timeOfDay.length;

  const allOperators = [...new Set(schedules.map((s) => s.operator))];
  const allClasses = [...new Set(schedules.map((s) => s.class).filter(Boolean))];

  const TypeIcon = type === "train" ? FaTrain : type === "flight" ? FaPlane : FaBus;

  return (
    <div className="min-h-screen bg-cream flex flex-col">
      <Navbar />

      {/* ── Result Header ─────────────────────────────────────────────────── */}
      <div className="bg-navy-900 pt-20 pb-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <TypeIcon className="text-gold-400" size={16} />
                <span className="font-body text-xs font-700 text-gold-400 uppercase tracking-wider capitalize">
                  {type} Results
                </span>
              </div>
              <h1 className="font-display text-3xl font-700 text-white">
                {originLabel} <span className="text-gold-400 mx-2">→</span> {destLabel}
              </h1>
              <p className="font-body text-sm text-white/50 mt-1">
                {formatBookingDate(date)} · {passengers} passenger{passengers > 1 ? "s" : ""}
              </p>
            </div>
            <button
              onClick={() => setShowSearch(!showSearch)}
              className="flex items-center gap-2 bg-white/10 hover:bg-white/20 
                         text-white font-body text-sm px-4 py-2 rounded-lg 
                         border border-white/20 transition-all duration-200"
            >
              <FaSearch size={12} />
              Modify Search
              <FaChevronDown size={10} className={`transition-transform ${showSearch ? "rotate-180" : ""}`} />
            </button>
          </div>

          {/* Expandable Search Form */}
          {showSearch && (
            <div className="mt-5 animate-slide-up">
              <SearchForm compact />
            </div>
          )}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 w-full flex-1">
        <div className="flex flex-col lg:flex-row gap-6">

          {/* ── Sidebar Filters ─────────────────────────────────────────────── */}
          <aside className={`lg:w-64 flex-shrink-0 ${showFilters ? "block" : "hidden lg:block"}`}>
            <div className="card p-5 sticky top-20">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-display text-lg font-600 text-teal-950">Filters</h3>
                {activeFilterCount > 0 && (
                  <button onClick={clearFilters}
                    className="font-body text-xs text-red-500 hover:underline flex items-center gap-1">
                    <FaTimes size={10} /> Clear all
                  </button>
                )}
              </div>

              {/* Price Range */}
              <div className="mb-5 pb-5 border-b border-cream-dark">
                <h4 className="font-body text-xs font-700 uppercase tracking-wider text-teal-950/60 mb-3">
                  Price Range
                </h4>
                <div className="space-y-2">
                  {PRICE_RANGES.map((range) => (
                    <label key={range.label} className="flex items-center gap-2 cursor-pointer group">
                      <input
                        type="radio"
                        name="price"
                        checked={filters.priceRange?.label === range.label}
                        onChange={() => setFilters((p) => ({ ...p, priceRange: range }))}
                        className="accent-teal-950"
                      />
                      <span className="font-body text-sm text-navy-900 group-hover:text-teal-700 transition-colors">
                        {range.label}
                      </span>
                    </label>
                  ))}
                  {filters.priceRange && (
                    <button onClick={() => setFilters((p) => ({ ...p, priceRange: null }))}
                      className="font-body text-xs text-red-500 hover:underline mt-1">
                      Clear
                    </button>
                  )}
                </div>
              </div>

              {/* Departure Time */}
              <div className="mb-5 pb-5 border-b border-cream-dark">
                <h4 className="font-body text-xs font-700 uppercase tracking-wider text-teal-950/60 mb-3">
                  Departure Time
                </h4>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { val: "morning", label: "Morning", sub: "5am–12pm" },
                    { val: "afternoon", label: "Afternoon", sub: "12pm–5pm" },
                    { val: "evening", label: "Evening", sub: "5pm–9pm" },
                    { val: "night", label: "Night", sub: "9pm–5am" },
                  ].map(({ val, label, sub }) => (
                    <button
                      key={val}
                      onClick={() => toggleFilter("timeOfDay", val)}
                      className={`p-2 rounded-lg border text-center transition-all duration-150
                                  ${filters.timeOfDay.includes(val)
                                    ? "bg-teal-950 border-teal-950 text-white"
                                    : "bg-cream border-teal-950/20 hover:border-teal-700"}`}
                    >
                      <p className="font-body text-xs font-700">{label}</p>
                      <p className={`font-body text-xs ${filters.timeOfDay.includes(val) ? "text-white/60" : "text-teal-950/40"}`}>{sub}</p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Operators */}
              {allOperators.length > 0 && (
                <div className="mb-5 pb-5 border-b border-cream-dark">
                  <h4 className="font-body text-xs font-700 uppercase tracking-wider text-teal-950/60 mb-3">
                    Operators
                  </h4>
                  <div className="space-y-2">
                    {allOperators.map((op) => (
                      <label key={op} className="flex items-center gap-2 cursor-pointer group">
                        <input
                          type="checkbox"
                          checked={filters.operators.includes(op)}
                          onChange={() => toggleFilter("operators", op)}
                          className="accent-teal-950"
                        />
                        <span className="font-body text-sm text-navy-900 group-hover:text-teal-700 transition-colors leading-tight">
                          {op}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
              )}

              {/* Classes */}
              {allClasses.length > 0 && (
                <div>
                  <h4 className="font-body text-xs font-700 uppercase tracking-wider text-teal-950/60 mb-3">
                    Class
                  </h4>
                  <div className="space-y-2">
                    {allClasses.map((cls) => (
                      <label key={cls} className="flex items-center gap-2 cursor-pointer group">
                        <input
                          type="checkbox"
                          checked={filters.classes.includes(cls)}
                          onChange={() => toggleFilter("classes", cls)}
                          className="accent-teal-950"
                        />
                        <span className="font-body text-sm text-navy-900 group-hover:text-teal-700 transition-colors">
                          {cls}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </aside>

          {/* ── Main Results ──────────────────────────────────────────────────── */}
          <div className="flex-1 min-w-0">
            {/* Results Bar */}
            <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className={`lg:hidden flex items-center gap-2 px-3 py-2 rounded-lg border font-body text-sm font-700
                              transition-all duration-150
                              ${showFilters ? "bg-teal-950 border-teal-950 text-white" : "bg-white border-teal-950/20 text-teal-950"}`}
                >
                  <FaFilter size={12} />
                  Filters {activeFilterCount > 0 && `(${activeFilterCount})`}
                </button>

                {!loading && (
                  <p className="font-body text-sm text-teal-950/60">
                    <span className="font-700 text-teal-950">{filtered.length}</span> result{filtered.length !== 1 ? "s" : ""} found
                  </p>
                )}
              </div>

              {/* Sort */}
              <div className="flex items-center gap-2">
                <FaSortAmountDown size={13} className="text-teal-950/50" />
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="bg-white border border-teal-950/20 rounded-lg px-3 py-2 
                             font-body text-sm text-navy-900 focus:outline-none 
                             focus:ring-2 focus:ring-teal-700/40 cursor-pointer"
                >
                  {SORT_OPTIONS.map(({ value, label }) => (
                    <option key={value} value={value}>{label}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Active filter chips */}
            {activeFilterCount > 0 && (
              <div className="flex flex-wrap gap-2 mb-4">
                {filters.priceRange && (
                  <span className="flex items-center gap-1.5 bg-teal-950 text-white 
                                   font-body text-xs px-3 py-1.5 rounded-full">
                    {filters.priceRange.label}
                    <button onClick={() => setFilters((p) => ({ ...p, priceRange: null }))}>
                      <FaTimes size={9} />
                    </button>
                  </span>
                )}
                {[...filters.operators, ...filters.classes, ...filters.timeOfDay].map((v) => (
                  <span key={v} className="flex items-center gap-1.5 bg-teal-950 text-white 
                                            font-body text-xs px-3 py-1.5 rounded-full capitalize">
                    {v}
                    <button onClick={() => {
                      if (filters.operators.includes(v)) toggleFilter("operators", v);
                      else if (filters.classes.includes(v)) toggleFilter("classes", v);
                      else if (filters.timeOfDay.includes(v)) toggleFilter("timeOfDay", v);
                    }}>
                      <FaTimes size={9} />
                    </button>
                  </span>
                ))}
              </div>
            )}

            {/* Results List */}
            {loading ? (
              <div className="space-y-4">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="h-36 rounded-2xl skeleton" />
                ))}
              </div>
            ) : filtered.length === 0 ? (
              <div className="text-center py-20 card">
                <TypeIcon size={40} className="text-teal-950/20 mx-auto mb-4" />
                <h3 className="font-display text-2xl font-600 text-teal-950/60 mb-2">
                  No {type}s found
                </h3>
                <p className="font-body text-sm text-teal-950/40 mb-5">
                  Try adjusting your filters or search for a different date.
                </p>
                <button onClick={clearFilters}
                  className="btn-outline text-sm px-5 py-2">
                  Clear Filters
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {filtered.map((s) => (
                  <TransportCard key={s.id} schedule={s} />
                ))}
              </div>
            )}

            {/* Hotel CTA */}
            {!loading && filtered.length > 0 && destination && (
              <div className="mt-8 bg-teal-950 rounded-2xl p-6 flex flex-col sm:flex-row 
                              items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gold-500/20 rounded-xl flex items-center justify-center flex-shrink-0">
                    <FaHotel size={20} className="text-gold-400" />
                  </div>
                  <div>
                    <h3 className="font-display text-xl font-600 text-white">
                      Need a hotel in {destLabel}?
                    </h3>
                    <p className="font-body text-sm text-white/60">
                      Browse and book hotels near your destination.
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => navigate(`/results/hotels?destination=${destination}`)}
                  className="flex items-center gap-2 bg-gold-500 hover:bg-gold-400 
                             text-navy-900 font-body font-700 px-5 py-2.5 rounded-xl 
                             transition-all duration-200 shadow-gold whitespace-nowrap"
                >
                  View Hotels <FaArrowRight size={13} />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}