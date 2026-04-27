import React, { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Select from "react-select";
import {
  FaFilter, FaSortAmountDown, FaTimes, FaStar,
  FaMapMarkerAlt, FaUsers, FaCalendarAlt, FaSearch
} from "react-icons/fa";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import HotelCard from "../components/HotelCard";
import { ALL_LOCATIONS, HOTEL_AMENITIES } from "../utils/constants";
import hotelService from "../services/hotel.service";
import { formatDate } from "../utils/formatDate";

// ── Mock Hotel Generator ──────────────────────────────────────────────────────
const MOCK_HOTELS = [
  {
    id: "h1", name: "Pan Pacific Sonargaon", location: "Karwan Bazar, Dhaka",
    rating: 4.8, reviewCount: 1240, pricePerNight: 8500,
    amenities: ["wifi", "pool", "gym", "restaurant", "parking", "ac"],
    category: "5 Star", roomsLeft: 3, distance: "2.5 km",
    images: []
  },
  {
    id: "h2", name: "Radisson Blu Dhaka", location: "Airport Road, Dhaka",
    rating: 4.7, reviewCount: 985, pricePerNight: 7200,
    amenities: ["wifi", "pool", "gym", "restaurant", "ac"],
    category: "5 Star", roomsLeft: 8, distance: "4 km",
    images: []
  },
  {
    id: "h3", name: "Hotel Seaview Cox's Bazar", location: "Marine Drive, Cox's Bazar",
    rating: 4.3, reviewCount: 632, pricePerNight: 3500,
    amenities: ["wifi", "restaurant", "parking", "ac"],
    category: "4 Star", roomsLeft: 12, distance: "300 m from beach",
    images: []
  },
  {
    id: "h4", name: "Long Beach Hotel", location: "Kolatoli, Cox's Bazar",
    rating: 4.5, reviewCount: 820, pricePerNight: 4200,
    amenities: ["wifi", "pool", "restaurant", "ac", "parking"],
    category: "4 Star", roomsLeft: 5, distance: "100 m from beach",
    images: []
  },
  {
    id: "h5", name: "Hotel Grand Sylhet", location: "Zindabazar, Sylhet",
    rating: 4.1, reviewCount: 390, pricePerNight: 2200,
    amenities: ["wifi", "restaurant", "ac"],
    category: "3 Star", roomsLeft: 15, distance: "City center",
    images: []
  },
  {
    id: "h6", name: "Hotel Agrabad Chittagong", location: "Agrabad, Chittagong",
    rating: 4.0, reviewCount: 510, pricePerNight: 2800,
    amenities: ["wifi", "restaurant", "parking", "ac"],
    category: "3 Star", roomsLeft: 9, distance: "Port area",
    images: []
  },
  {
    id: "h7", name: "Rose View Hotel", location: "Ambarkhana, Sylhet",
    rating: 4.2, reviewCount: 445, pricePerNight: 3000,
    amenities: ["wifi", "pool", "restaurant", "ac"],
    category: "4 Star", roomsLeft: 7, distance: "2 km",
    images: []
  },
  {
    id: "h8", name: "Hotel 71", location: "Shahbag, Dhaka",
    rating: 3.8, reviewCount: 290, pricePerNight: 1800,
    amenities: ["wifi", "ac", "parking"],
    category: "3 Star", roomsLeft: 20, distance: "1 km",
    images: []
  },
];

const SORT_OPTIONS = [
  { value: "recommended", label: "Recommended" },
  { value: "price_asc", label: "Price: Low to High" },
  { value: "price_desc", label: "Price: High to Low" },
  { value: "rating", label: "Highest Rated" },
  { value: "reviews", label: "Most Reviewed" },
];

const STAR_OPTIONS = [5, 4, 3, 2, 1];
const PRICE_RANGES = [
  { label: "Under ৳2,000", min: 0, max: 2000 },
  { label: "৳2,000 – ৳4,000", min: 2000, max: 4000 },
  { label: "৳4,000 – ৳7,000", min: 4000, max: 7000 },
  { label: "Above ৳7,000", min: 7000, max: Infinity },
];

const locationOptions = ALL_LOCATIONS.map((l) => ({ value: l.value, label: l.label }));

const selectStyles = {
  control: (base, state) => ({
    ...base,
    backgroundColor: "#F5EFE6",
    border: state.isFocused ? "2px solid #146A70" : "1px solid rgba(11,61,64,0.2)",
    borderRadius: "8px",
    boxShadow: "none",
    fontFamily: "'Nunito', sans-serif",
    fontSize: "14px",
    minHeight: "44px",
    "&:hover": { borderColor: "#146A70" },
  }),
  option: (base, { isSelected, isFocused }) => ({
    ...base,
    backgroundColor: isSelected ? "#0B3D40" : isFocused ? "#EDE4D6" : "white",
    color: isSelected ? "white" : "#0A1628",
    fontFamily: "'Nunito', sans-serif",
    fontSize: "14px",
  }),
  menu: (base) => ({ ...base, borderRadius: "12px", overflow: "hidden" }),
  singleValue: (base) => ({ ...base, color: "#0A1628" }),
  placeholder: (base) => ({ ...base, color: "rgba(10,22,40,0.4)" }),
};

export default function HotelListingPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const [destParam] = useState(searchParams.get("destination") || "");
  const [destination, setDestination] = useState(
    locationOptions.find((l) => l.value === destParam) || null
  );
  const [checkIn, setCheckIn] = useState(new Date());
  const [checkOut, setCheckOut] = useState(new Date(Date.now() + 86400000 * 2));
  const [guests, setGuests] = useState(1);

  const [hotels, setHotels] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState("recommended");

  const [filters, setFilters] = useState({
    priceRange: null,
    stars: [],
    amenities: [],
  });

  // ── Fetch ──────────────────────────────────────────────────────────────────
  useEffect(() => {
    setLoading(true);
    const fetch = async () => {
      try {
        const data = await hotelService.search({
          destination: destination?.value,
          checkIn: formatDate(checkIn, "yyyy-MM-dd"),
          checkOut: formatDate(checkOut, "yyyy-MM-dd"),
          guests,
        });
        setHotels(data);
      } catch {
        setHotels(MOCK_HOTELS);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [destination, checkIn, checkOut, guests]);

  // ── Filter + Sort ──────────────────────────────────────────────────────────
  useEffect(() => {
    let result = [...hotels];

    if (filters.priceRange) {
      result = result.filter(
        (h) => h.pricePerNight >= filters.priceRange.min &&
          h.pricePerNight <= (filters.priceRange.max || Infinity)
      );
    }
    if (filters.stars.length) {
      result = result.filter((h) => filters.stars.includes(Math.floor(h.rating)));
    }
    if (filters.amenities.length) {
      result = result.filter((h) =>
        filters.amenities.every((a) => (h.amenities || []).includes(a))
      );
    }

    result.sort((a, b) => {
      if (sortBy === "price_asc") return a.pricePerNight - b.pricePerNight;
      if (sortBy === "price_desc") return b.pricePerNight - a.pricePerNight;
      if (sortBy === "rating") return b.rating - a.rating;
      if (sortBy === "reviews") return (b.reviewCount || 0) - (a.reviewCount || 0);
      return 0;
    });

    setFiltered(result);
  }, [hotels, filters, sortBy]);

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
    setFilters({ priceRange: null, stars: [], amenities: [] });

  const activeCount =
    (filters.priceRange ? 1 : 0) + filters.stars.length + filters.amenities.length;

  const nights = Math.max(1, Math.ceil((checkOut - checkIn) / 86400000));

  return (
    <div className="min-h-screen bg-cream flex flex-col">
      <Navbar />

      {/* ── Header ────────────────────────────────────────────────────────── */}
      <div className="bg-navy-900 pt-20 pb-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 mb-2">
            <FaMapMarkerAlt className="text-gold-400" size={16} />
            <span className="font-body text-xs font-700 text-gold-400 uppercase tracking-wider">
              Hotel Search
            </span>
          </div>
          <h1 className="font-display text-3xl font-700 text-white mb-4">
            {destination ? `Hotels in ${destination.label}` : "Find Hotels"}
          </h1>

          {/* Search Bar */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
            <div className="lg:col-span-2">
              <label className="block font-body text-xs font-700 text-white/50 uppercase tracking-wider mb-1">
                <FaMapMarkerAlt className="inline mr-1" /> Destination
              </label>
              <Select
                options={locationOptions}
                value={destination}
                onChange={setDestination}
                placeholder="Select city"
                styles={selectStyles}
                isSearchable
              />
            </div>
            <div>
              <label className="block font-body text-xs font-700 text-white/50 uppercase tracking-wider mb-1">
                <FaCalendarAlt className="inline mr-1" /> Check-in
              </label>
              <DatePicker
                selected={checkIn}
                onChange={setCheckIn}
                minDate={new Date()}
                dateFormat="dd MMM yyyy"
                className="w-full bg-cream border border-teal-950/20 rounded-lg px-4 py-2.5 
                           font-body text-sm text-navy-900 focus:outline-none focus:ring-2 focus:ring-teal-700/40"
              />
            </div>
            <div>
              <label className="block font-body text-xs font-700 text-white/50 uppercase tracking-wider mb-1">
                <FaCalendarAlt className="inline mr-1" /> Check-out
              </label>
              <DatePicker
                selected={checkOut}
                onChange={setCheckOut}
                minDate={checkIn || new Date()}
                dateFormat="dd MMM yyyy"
                className="w-full bg-cream border border-teal-950/20 rounded-lg px-4 py-2.5 
                           font-body text-sm text-navy-900 focus:outline-none focus:ring-2 focus:ring-teal-700/40"
              />
            </div>
            <div>
              <label className="block font-body text-xs font-700 text-white/50 uppercase tracking-wider mb-1">
                <FaUsers className="inline mr-1" /> Guests
              </label>
              <div className="flex items-center gap-2 bg-cream border border-teal-950/20 rounded-lg px-4 py-2">
                <button onClick={() => setGuests(Math.max(1, guests - 1))}
                  className="w-7 h-7 rounded-full bg-teal-950 text-white flex items-center justify-center text-lg">−</button>
                <span className="flex-1 text-center font-body text-sm font-700 text-navy-900">{guests}</span>
                <button onClick={() => setGuests(Math.min(8, guests + 1))}
                  className="w-7 h-7 rounded-full bg-teal-950 text-white flex items-center justify-center text-lg">+</button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 w-full flex-1">
        <div className="flex flex-col lg:flex-row gap-6">

          {/* ── Sidebar ───────────────────────────────────────────────────── */}
          <aside className={`lg:w-64 flex-shrink-0 ${showFilters ? "block" : "hidden lg:block"}`}>
            <div className="card p-5 sticky top-20">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-display text-lg font-600 text-teal-950">Filters</h3>
                {activeCount > 0 && (
                  <button onClick={clearFilters}
                    className="font-body text-xs text-red-500 hover:underline flex items-center gap-1">
                    <FaTimes size={10} /> Clear
                  </button>
                )}
              </div>

              {/* Price Range */}
              <div className="mb-5 pb-5 border-b border-cream-dark">
                <h4 className="font-body text-xs font-700 uppercase tracking-wider text-teal-950/60 mb-3">Price / Night</h4>
                <div className="space-y-2">
                  {PRICE_RANGES.map((range) => (
                    <label key={range.label} className="flex items-center gap-2 cursor-pointer">
                      <input type="radio" name="hotel-price"
                        checked={filters.priceRange?.label === range.label}
                        onChange={() => setFilters((p) => ({ ...p, priceRange: range }))}
                        className="accent-teal-950" />
                      <span className="font-body text-sm text-navy-900">{range.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Star Rating */}
              <div className="mb-5 pb-5 border-b border-cream-dark">
                <h4 className="font-body text-xs font-700 uppercase tracking-wider text-teal-950/60 mb-3">Star Rating</h4>
                <div className="space-y-2">
                  {STAR_OPTIONS.map((star) => (
                    <label key={star} className="flex items-center gap-2 cursor-pointer">
                      <input type="checkbox"
                        checked={filters.stars.includes(star)}
                        onChange={() => toggleFilter("stars", star)}
                        className="accent-teal-950" />
                      <div className="flex items-center gap-1">
                        {Array.from({ length: star }).map((_, i) => (
                          <FaStar key={i} size={11} className="text-gold-500" />
                        ))}
                        {Array.from({ length: 5 - star }).map((_, i) => (
                          <FaStar key={i} size={11} className="text-cream-dark" />
                        ))}
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              {/* Amenities */}
              <div>
                <h4 className="font-body text-xs font-700 uppercase tracking-wider text-teal-950/60 mb-3">Amenities</h4>
                <div className="space-y-2">
                  {HOTEL_AMENITIES.map(({ key, label }) => (
                    <label key={key} className="flex items-center gap-2 cursor-pointer">
                      <input type="checkbox"
                        checked={filters.amenities.includes(key)}
                        onChange={() => toggleFilter("amenities", key)}
                        className="accent-teal-950" />
                      <span className="font-body text-sm text-navy-900">{label}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </aside>

          {/* ── Hotel Grid ────────────────────────────────────────────────── */}
          <div className="flex-1 min-w-0">
            {/* Toolbar */}
            <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className={`lg:hidden flex items-center gap-2 px-3 py-2 rounded-lg border font-body text-sm font-700
                              ${showFilters ? "bg-teal-950 border-teal-950 text-white" : "bg-white border-teal-950/20 text-teal-950"}`}
                >
                  <FaFilter size={12} />
                  Filters {activeCount > 0 && `(${activeCount})`}
                </button>
                {!loading && (
                  <p className="font-body text-sm text-teal-950/60">
                    <span className="font-700 text-teal-950">{filtered.length}</span> hotels found
                    {destination ? ` in ${destination.label}` : ""} · <span className="font-600">{nights} night{nights !== 1 ? "s" : ""}</span>
                  </p>
                )}
              </div>
              <div className="flex items-center gap-2">
                <FaSortAmountDown size={13} className="text-teal-950/50" />
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="bg-white border border-teal-950/20 rounded-lg px-3 py-2 
                             font-body text-sm text-navy-900 focus:outline-none focus:ring-2 focus:ring-teal-700/40"
                >
                  {SORT_OPTIONS.map(({ value, label }) => (
                    <option key={value} value={value}>{label}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Hotel Cards */}
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div key={i} className="rounded-2xl overflow-hidden">
                    <div className="h-48 skeleton" />
                    <div className="p-5 space-y-3 bg-white">
                      <div className="h-4 skeleton rounded w-3/4" />
                      <div className="h-3 skeleton rounded w-1/2" />
                      <div className="h-3 skeleton rounded w-full" />
                    </div>
                  </div>
                ))}
              </div>
            ) : filtered.length === 0 ? (
              <div className="text-center py-20 card">
                <FaSearch size={36} className="text-teal-950/20 mx-auto mb-4" />
                <h3 className="font-display text-2xl font-600 text-teal-950/60 mb-2">No hotels found</h3>
                <p className="font-body text-sm text-teal-950/40 mb-5">
                  Try changing your filters or destination.
                </p>
                <button onClick={clearFilters} className="btn-outline text-sm px-5 py-2">
                  Clear Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                {filtered.map((hotel) => (
                  <HotelCard key={hotel.id} hotel={hotel} checkIn={checkIn} checkOut={checkOut} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}