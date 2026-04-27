import React from "react";
import { useSearchParams } from "react-router-dom";
import { FaCompass, FaBus, FaTrain, FaPlane, FaHotel } from "react-icons/fa";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import SearchForm from "../components/SearchForm";

const TIPS = [
  {
    Icon: FaBus,
    title: "Bus Travel",
    tip: "Book 1–2 days in advance for popular routes. AC buses fill up fast on weekends.",
  },
  {
    Icon: FaTrain,
    title: "Train Travel",
    tip: "Intercity trains need early booking. Shovon Chair is budget-friendly.",
  },
  {
    Icon: FaPlane,
    title: "Flight Travel",
    tip: "Book 2–3 weeks ahead for best fares. Check baggage policy before booking.",
  },
  {
    Icon: FaHotel,
    title: "Hotel Booking",
    tip: "Book hotels alongside transport for the best availability at your destination.",
  },
];

export default function SearchPage() {
  const [searchParams] = useSearchParams();
  const typeParam = searchParams.get("type");

  return (
    <div className="min-h-screen bg-cream flex flex-col">
      <Navbar />

      {/* ── Header ────────────────────────────────────────────────────────── */}
      <div className="bg-navy-900 pt-24 pb-10 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-0 w-64 h-64 bg-gold-500/8 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-0 w-80 h-80 bg-teal-500/8 rounded-full blur-3xl" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3 mb-3">
            <FaCompass className="text-gold-400" size={18} />
            <span className="font-body text-xs font-700 tracking-widest uppercase text-gold-400">
              Plan Your Journey
            </span>
          </div>
          <h1 className="font-display text-4xl md:text-5xl font-700 text-white mb-2">
            Search Trips
          </h1>
          <p className="font-body text-white/60">
            Find the best buses, trains, and flights — then book a hotel at your destination.
          </p>
        </div>
      </div>

      {/* ── Search Form ───────────────────────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-5 w-full relative z-10">
        <SearchForm />
      </div>

      {/* ── Travel Tips ───────────────────────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 w-full">
        <h2 className="font-display text-2xl font-600 text-teal-950 mb-6">Travel Tips</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {TIPS.map(({ Icon, title, tip }) => (
            <div key={title} className="card p-5">
              <div className="w-10 h-10 bg-cream rounded-xl flex items-center justify-center mb-3">
                <Icon size={18} className="text-teal-700" />
              </div>
              <h3 className="font-display text-lg font-600 text-teal-950 mb-2">{title}</h3>
              <p className="font-body text-xs text-teal-950/60 leading-relaxed">{tip}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="flex-1" />
      <Footer />
    </div>
  );
}
