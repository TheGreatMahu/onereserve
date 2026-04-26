import React, { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import {
  FaBus, FaTrain, FaPlane, FaHotel, FaRoute,
  FaShieldAlt, FaHeadset, FaCheckCircle, FaArrowRight
} from "react-icons/fa";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import SearchForm from "../components/SearchForm";

const STATS = [
  { value: "50,000+", label: "Happy Travelers" },
  { value: "200+", label: "Routes Covered" },
  { value: "500+", label: "Hotels Listed" },
  { value: "98%", label: "Satisfaction Rate" },
];

const FEATURES = [
  {
    Icon: FaBus,
    title: "Bus Tickets",
    desc: "Search and book from top operators like Hanif, Shyamoli, Green Line across Bangladesh.",
    color: "bg-emerald-50 text-emerald-700",
  },
  {
    Icon: FaTrain,
    title: "Train Tickets",
    desc: "Book Bangladesh Railway trains from Shovon to AC Berth with real-time availability.",
    color: "bg-blue-50 text-blue-700",
  },
  {
    Icon: FaPlane,
    title: "Flight Tickets",
    desc: "Domestic & international flights including Biman, US-Bangla, Emirates, and more.",
    color: "bg-purple-50 text-purple-700",
  },
  {
    Icon: FaHotel,
    title: "Hotel Booking",
    desc: "Discover and reserve hotels at your destination — from budget to luxury.",
    color: "bg-amber-50 text-amber-700",
  },
  {
    Icon: FaRoute,
    title: "Route Visualization",
    desc: "See map-based routes from your origin to destination and to your hotel.",
    color: "bg-rose-50 text-rose-700",
  },
  {
    Icon: FaShieldAlt,
    title: "Secure Booking",
    desc: "All transactions are encrypted. Easy modification and cancellation support.",
    color: "bg-teal-50 text-teal-700",
  },
];

const POPULAR_DESTINATIONS = [
  { name: "Cox's Bazar", desc: "World's longest sea beach", emoji: "🌊" },
  { name: "Sylhet", desc: "Tea gardens & natural beauty", emoji: "🍃" },
  { name: "Sundarbans", desc: "Largest mangrove forest", emoji: "🐅" },
  { name: "Chittagong", desc: "Port city & hill tracts", emoji: "⛵" },
];

export default function LandingPage() {
  const heroRef = useRef(null);

  useEffect(() => {
    const el = heroRef.current;
    if (!el) return;
    const onMouseMove = (e) => {
      const { clientX, clientY, currentTarget } = e;
      const { left, top, width, height } = currentTarget.getBoundingClientRect();
      const x = ((clientX - left) / width - 0.5) * 20;
      const y = ((clientY - top) / height - 0.5) * 20;
      el.style.backgroundPosition = `calc(50% + ${x}px) calc(50% + ${y}px)`;
    };
    el.addEventListener("mousemove", onMouseMove);
    return () => el.removeEventListener("mousemove", onMouseMove);
  }, []);

  return (
    <div className="min-h-screen bg-cream">
      <Navbar />

      {/* ── Hero Section ────────────────────────────────────────────── */}
      <section
        ref={heroRef}
        className="relative min-h-screen flex items-center overflow-hidden"
        style={{
          background: "linear-gradient(135deg, #0A1628 0%, #0B3D40 50%, #105A5F 100%)",
          backgroundSize: "200% 200%",
          transition: "background-position 0.3s ease",
        }}
      >
        {/* Decorative elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 w-72 h-72 bg-gold-500/10 rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 
                          w-[600px] h-[600px] border border-white/5 rounded-full" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 
                          w-[800px] h-[800px] border border-white/3 rounded-full" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16 w-full">
          {/* Headline */}
          <div className="text-center mb-10 animate-slide-up">
            <span className="inline-block font-body text-xs font-700 tracking-widest 
                             uppercase text-gold-400 bg-gold-500/10 border border-gold-500/20 
                             rounded-full px-4 py-1.5 mb-5">
              Bangladesh's Smart Travel Platform
            </span>
            <h1 className="font-display text-5xl md:text-7xl font-700 text-white leading-tight mb-5">
              Travel Smarter,<br />
              <span className="text-gold-400">Book Simpler</span>
            </h1>
            <p className="font-body text-lg text-white/60 max-w-2xl mx-auto leading-relaxed">
              One platform for all your travel needs — buses, trains, flights, and hotels.
              Plan your perfect journey across Bangladesh and beyond.
            </p>
          </div>

          {/* Search Form */}
          <div className="max-w-4xl mx-auto animate-slide-up" style={{ animationDelay: "0.15s" }}>
            <SearchForm />
          </div>

          {/* Quick Links */}
          <div className="flex flex-wrap items-center justify-center gap-3 mt-6 animate-fade-in"
            style={{ animationDelay: "0.3s" }}>
            {[
              { Icon: FaBus, label: "Book Bus", to: "/search?type=bus" },
              { Icon: FaTrain, label: "Book Train", to: "/search?type=train" },
              { Icon: FaPlane, label: "Book Flight", to: "/search?type=flight" },
              { Icon: FaHotel, label: "Find Hotels", to: "/results/hotels" },
            ].map(({ Icon, label, to }) => (
              <Link key={to} to={to}
                className="flex items-center gap-2 bg-white/10 hover:bg-white/20 
                           backdrop-blur-sm text-white/80 hover:text-white 
                           font-body text-sm px-4 py-2 rounded-full 
                           border border-white/10 transition-all duration-200">
                <Icon size={13} />
                {label}
              </Link>
            ))}
          </div>
        </div>

        {/* Wave divider */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 80" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 80L1440 80L1440 40C1200 0 960 80 720 40C480 0 240 80 0 40L0 80Z"
              fill="#F5EFE6" />
          </svg>
        </div>
      </section>

      {/* ── Stats Section ────────────────────────────────────────────── */}
      <section className="bg-cream py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {STATS.map(({ value, label }) => (
              <div key={label} className="text-center">
                <p className="font-display text-4xl font-700 text-teal-950">{value}</p>
                <p className="font-body text-sm text-teal-950/60 mt-1">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Features Section ─────────────────────────────────────────── */}
      <section className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="section-title mb-3">Everything You Need</h2>
            <p className="font-body text-teal-950/60 max-w-xl mx-auto">
              OneReserve brings together all travel services into one seamless experience.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {FEATURES.map(({ Icon, title, desc, color }) => (
              <div key={title} className="card p-6 group">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${color}`}>
                  <Icon size={22} />
                </div>
                <h3 className="font-display text-xl font-600 text-teal-950 mb-2">{title}</h3>
                <p className="font-body text-sm text-teal-950/60 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Popular Destinations ─────────────────────────────────────── */}
      <section className="bg-cream py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-10">
            <div>
              <h2 className="section-title">Popular Destinations</h2>
              <p className="font-body text-teal-950/60 mt-2">Explore Bangladesh's most visited places</p>
            </div>
            <Link to="/search"
              className="hidden md:flex items-center gap-2 font-body text-sm font-700 text-teal-700 hover:text-teal-950 transition-colors">
              View All <FaArrowRight size={12} />
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {POPULAR_DESTINATIONS.map(({ name, desc, emoji }) => (
              <Link
                key={name}
                to={`/search?destination=${name.toLowerCase().replace(/[' ]/g, "_")}`}
                className="card p-6 group text-center hover:-translate-y-1 transition-all duration-300"
              >
                <div className="text-5xl mb-3">{emoji}</div>
                <h3 className="font-display text-xl font-600 text-teal-950 mb-1">{name}</h3>
                <p className="font-body text-xs text-teal-950/60">{desc}</p>
                <div className="mt-3 flex items-center justify-center gap-1 text-gold-500 
                               font-body text-xs font-700 group-hover:gap-2 transition-all">
                  Explore <FaArrowRight size={10} />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── Why Choose Us ────────────────────────────────────────────── */}
      <section className="bg-navy-900 py-20 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 right-0 w-96 h-96 bg-gold-500/5 rounded-full blur-3xl" />
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="font-display text-4xl md:text-5xl font-700 text-white leading-tight mb-5">
                Why Travelers Choose <span className="text-gold-400">OneReserve</span>
              </h2>
              <p className="font-body text-white/60 leading-relaxed mb-8">
                We combine convenience, reliability, and smart technology to make your travel
                experience seamless from start to finish.
              </p>
              <div className="space-y-4">
                {[
                  "Real-time seat availability with 5-minute seat lock",
                  "Integrated transport + hotel booking in one platform",
                  "Map-based route visualization to your destination",
                  "Easy cancellation and modification policies",
                  "Secure payment with instant confirmation",
                ].map((item) => (
                  <div key={item} className="flex items-start gap-3">
                    <FaCheckCircle className="text-gold-400 mt-0.5 flex-shrink-0" size={16} />
                    <span className="font-body text-sm text-white/70">{item}</span>
                  </div>
                ))}
              </div>
              <Link
                to="/register"
                className="inline-flex items-center gap-2 mt-8 bg-gold-500 hover:bg-gold-400 
                           text-navy-900 font-body font-800 px-6 py-3 rounded-lg 
                           transition-all duration-200 shadow-gold active:scale-95"
              >
                Start Your Journey <FaArrowRight size={13} />
              </Link>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {[
                { Icon: FaHeadset, title: "24/7 Support", desc: "Always here to help" },
                { Icon: FaShieldAlt, title: "Secure Payments", desc: "Your data is safe" },
                { Icon: FaCheckCircle, title: "Instant Confirm", desc: "Bookings in seconds" },
                { Icon: FaRoute, title: "Smart Routes", desc: "Best paths suggested" },
              ].map(({ Icon, title, desc }) => (
                <div key={title}
                  className="bg-white/5 border border-white/10 rounded-2xl p-5 
                             hover:bg-white/10 transition-all duration-200">
                  <Icon size={24} className="text-gold-400 mb-3" />
                  <h4 className="font-display text-lg font-600 text-white mb-1">{title}</h4>
                  <p className="font-body text-xs text-white/50">{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA Section ──────────────────────────────────────────────── */}
      <section className="bg-cream py-20">
        <div className="max-w-3xl mx-auto text-center px-4">
          <h2 className="section-title mb-4">Ready to Explore Bangladesh?</h2>
          <p className="font-body text-teal-950/60 mb-8">
            Join thousands of travelers who plan their journeys with OneReserve.
            Sign up free and start booking today.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link
              to="/register"
              className="bg-teal-950 hover:bg-teal-800 text-white font-body font-700 
                         px-8 py-3.5 rounded-xl transition-all duration-200 shadow-card active:scale-95"
            >
              Create Free Account
            </Link>
            <Link
              to="/search"
              className="border-2 border-teal-950 text-teal-950 font-body font-700 
                         px-8 py-3.5 rounded-xl hover:bg-teal-950 hover:text-white 
                         transition-all duration-200 active:scale-95"
            >
              Search Trips
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}