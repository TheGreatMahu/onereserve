import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  FaUser, FaBus, FaTrain, FaPlane, FaHotel,
  FaTicketAlt, FaEdit, FaSave, FaTimes,
  FaEnvelope, FaPhone, FaCalendarAlt, FaArrowRight
} from "react-icons/fa";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import BookingHistory from "../components/BookingHistory";
import { useAuth } from "../App";
import authService from "../services/auth.service";
import bookingService from "../services/booking.service";
import { formatBookingDate } from "../utils/formatDate";
import { formatPrice } from "../utils/formatPrice";
import toast from "react-hot-toast";

// ── Mock booking data (fallback) ─────────────────────────────────────────────
const MOCK_BOOKINGS = [
  {
    id: "BK001", type: "bus", status: "confirmed",
    from: "Dhaka", to: "Chittagong", operator: "Green Line",
    date: new Date(), departureTime: new Date(Date.now() + 86400000).toISOString(),
    arrivalTime: new Date(Date.now() + 86400000 + 18000000).toISOString(),
    totalAmount: 1050, passengers: 1, seatNumbers: ["4A"],
    class: "AC", paymentMethod: "bKash",
  },
  {
    id: "BK002", type: "flight", status: "completed",
    from: "Dhaka", to: "Cox's Bazar", operator: "Novoair",
    date: new Date(Date.now() - 86400000 * 7),
    departureTime: new Date(Date.now() - 86400000 * 7).toISOString(),
    arrivalTime: new Date(Date.now() - 86400000 * 7 + 3600000).toISOString(),
    totalAmount: 6500, passengers: 2, seatNumbers: ["14A", "14B"],
    class: "Economy", paymentMethod: "Card",
  },
  {
    id: "BK003", type: "hotel", status: "confirmed",
    hotelName: "Long Beach Hotel Cox's Bazar",
    checkIn: new Date(Date.now() + 86400000 * 3),
    checkOut: new Date(Date.now() + 86400000 * 5),
    totalAmount: 9500, passengers: 2, paymentMethod: "Nagad",
  },
  {
    id: "BK004", type: "train", status: "cancelled",
    from: "Dhaka", to: "Sylhet", operator: "Bangladesh Railway",
    date: new Date(Date.now() - 86400000 * 14),
    departureTime: new Date(Date.now() - 86400000 * 14).toISOString(),
    arrivalTime: new Date(Date.now() - 86400000 * 14 + 21600000).toISOString(),
    totalAmount: 450, passengers: 1, seatNumbers: ["5C"],
    class: "Snigdha", paymentMethod: "bKash",
  },
];

const TABS = [
  { id: "bookings", label: "My Bookings", Icon: FaTicketAlt },
  { id: "profile", label: "Profile", Icon: FaUser },
];

export default function DashboardPage() {
  const { user, login } = useAuth();
  const [activeTab, setActiveTab] = useState("bookings");
  const [bookings, setBookings] = useState([]);
  const [loadingBookings, setLoadingBookings] = useState(true);
  const [editingProfile, setEditingProfile] = useState(false);
  const [profileForm, setProfileForm] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: user?.phone || "",
  });
  const [savingProfile, setSavingProfile] = useState(false);

  // ── Load Bookings ──────────────────────────────────────────────────────────
  useEffect(() => {
    const load = async () => {
      setLoadingBookings(true);
      try {
        const data = await bookingService.getMyBookings();
        setBookings(data);
      } catch {
        setBookings(MOCK_BOOKINGS);
      } finally {
        setLoadingBookings(false);
      }
    };
    load();
  }, []);

  const handleCancelBooking = (id) => {
    setBookings((prev) =>
      prev.map((b) => (b.id === id ? { ...b, status: "cancelled" } : b))
    );
  };

  const handleSaveProfile = async () => {
    setSavingProfile(true);
    try {
      const updated = await authService.updateProfile(profileForm);
      login(updated, localStorage.getItem("or_token"));
      toast.success("Profile updated!");
      setEditingProfile(false);
    } catch {
      toast.error("Failed to update profile");
    } finally {
      setSavingProfile(false);
    }
  };

  // ── Stats ──────────────────────────────────────────────────────────────────
  const stats = {
    total: bookings.length,
    confirmed: bookings.filter((b) => b.status === "confirmed").length,
    completed: bookings.filter((b) => b.status === "completed").length,
    totalSpent: bookings
      .filter((b) => b.status !== "cancelled")
      .reduce((sum, b) => sum + (b.totalAmount || 0), 0),
  };

  return (
    <div className="min-h-screen bg-cream flex flex-col">
      <Navbar />

      {/* ── Dashboard Header ───────────────────────────────────────────────── */}
      <div className="bg-navy-900 pt-20 pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            {/* Avatar */}
            <div className="w-14 h-14 bg-gold-500 rounded-2xl flex items-center justify-center flex-shrink-0">
              <span className="font-display text-2xl font-700 text-navy-900">
                {user?.name?.charAt(0)?.toUpperCase() || "U"}
              </span>
            </div>
            <div>
              <h1 className="font-display text-3xl font-700 text-white">
                Welcome, {user?.name?.split(" ")[0]}
              </h1>
              <p className="font-body text-sm text-white/50 mt-0.5">{user?.email}</p>
            </div>
          </div>

          {/* Stats Row */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6">
            {[
              { label: "Total Bookings", value: stats.total, icon: FaTicketAlt, color: "text-white" },
              { label: "Upcoming", value: stats.confirmed, icon: FaCalendarAlt, color: "text-gold-400" },
              { label: "Completed", value: stats.completed, icon: FaPlane, color: "text-green-400" },
              { label: "Total Spent", value: formatPrice(stats.totalSpent), icon: null, color: "text-gold-400" },
            ].map(({ label, value, icon: Icon, color }) => (
              <div key={label} className="bg-white/5 border border-white/10 rounded-xl p-4">
                <p className="font-body text-xs text-white/40 mb-1">{label}</p>
                <p className={`font-display text-2xl font-700 ${color}`}>{value}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Main Content ───────────────────────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full flex-1">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">

          {/* Sidebar */}
          <aside className="lg:col-span-1">
            <div className="card p-4 space-y-1 mb-5">
              {TABS.map(({ id, label, Icon }) => (
                <button
                  key={id}
                  onClick={() => setActiveTab(id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-body text-sm font-700
                              transition-all duration-150
                              ${activeTab === id
                                ? "bg-teal-950 text-white"
                                : "text-teal-950/70 hover:bg-cream hover:text-teal-950"}`}
                >
                  <Icon size={15} />
                  {label}
                </button>
              ))}
            </div>

            {/* Quick Book Links */}
            <div className="card p-5">
              <h3 className="font-display text-lg font-600 text-teal-950 mb-3">Quick Book</h3>
              <div className="space-y-2">
                {[
                  { Icon: FaBus, label: "Book Bus", to: "/search?type=bus" },
                  { Icon: FaTrain, label: "Book Train", to: "/search?type=train" },
                  { Icon: FaPlane, label: "Book Flight", to: "/search?type=flight" },
                  { Icon: FaHotel, label: "Find Hotel", to: "/results/hotels" },
                ].map(({ Icon, label, to }) => (
                  <Link key={to} to={to}
                    className="flex items-center justify-between px-3 py-2.5 rounded-lg
                               hover:bg-cream transition-colors group">
                    <div className="flex items-center gap-2.5">
                      <Icon size={14} className="text-teal-700" />
                      <span className="font-body text-sm text-navy-900">{label}</span>
                    </div>
                    <FaArrowRight size={11} className="text-teal-950/30 group-hover:text-teal-700 transition-colors" />
                  </Link>
                ))}
              </div>
            </div>
          </aside>

          {/* Main Panel */}
          <main className="lg:col-span-3">

            {/* ── Bookings Tab ──────────────────────────────────────────────── */}
            {activeTab === "bookings" && (
              <BookingHistory
                bookings={bookings}
                loading={loadingBookings}
                onCancel={handleCancelBooking}
              />
            )}

            {/* ── Profile Tab ───────────────────────────────────────────────── */}
            {activeTab === "profile" && (
              <div className="card p-6 animate-fade-in">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="font-display text-2xl font-700 text-teal-950">My Profile</h2>
                  {!editingProfile ? (
                    <button
                      onClick={() => setEditingProfile(true)}
                      className="flex items-center gap-2 bg-cream hover:bg-cream-dark
                                 text-teal-950 font-body text-sm font-700 px-4 py-2 rounded-lg 
                                 transition-all duration-150"
                    >
                      <FaEdit size={13} />
                      Edit Profile
                    </button>
                  ) : (
                    <div className="flex gap-2">
                      <button
                        onClick={() => { setEditingProfile(false); setProfileForm({ name: user?.name || "", email: user?.email || "", phone: user?.phone || "" }); }}
                        className="flex items-center gap-2 text-red-500 hover:bg-red-50 
                                   font-body text-sm font-700 px-4 py-2 rounded-lg transition-all"
                      >
                        <FaTimes size={12} />
                        Cancel
                      </button>
                      <button
                        onClick={handleSaveProfile}
                        disabled={savingProfile}
                        className="flex items-center gap-2 bg-teal-950 hover:bg-teal-800 
                                   text-white font-body text-sm font-700 px-4 py-2 rounded-lg 
                                   transition-all active:scale-95"
                      >
                        <FaSave size={13} />
                        {savingProfile ? "Saving..." : "Save"}
                      </button>
                    </div>
                  )}
                </div>

                {/* Avatar Display */}
                <div className="flex items-center gap-5 mb-8 pb-6 border-b border-cream-dark">
                  <div className="w-20 h-20 bg-gold-500 rounded-2xl flex items-center justify-center flex-shrink-0">
                    <span className="font-display text-4xl font-700 text-navy-900">
                      {user?.name?.charAt(0)?.toUpperCase() || "U"}
                    </span>
                  </div>
                  <div>
                    <h3 className="font-display text-2xl font-600 text-teal-950">{user?.name}</h3>
                    <p className="font-body text-sm text-teal-950/60">{user?.email}</p>
                    <span className="tag bg-teal-950/8 text-teal-700 mt-1 text-xs">
                      Member since {formatBookingDate(user?.createdAt || new Date())}
                    </span>
                  </div>
                </div>

                {/* Profile Fields */}
                <div className="space-y-5">
                  <ProfileField
                    icon={FaUser}
                    label="Full Name"
                    value={profileForm.name}
                    editing={editingProfile}
                    onChange={(v) => setProfileForm({ ...profileForm, name: v })}
                  />
                  <ProfileField
                    icon={FaEnvelope}
                    label="Email Address"
                    value={profileForm.email}
                    editing={editingProfile}
                    type="email"
                    onChange={(v) => setProfileForm({ ...profileForm, email: v })}
                  />
                  <ProfileField
                    icon={FaPhone}
                    label="Phone Number"
                    value={profileForm.phone}
                    editing={editingProfile}
                    placeholder="01XXXXXXXXX"
                    onChange={(v) => setProfileForm({ ...profileForm, phone: v })}
                  />
                </div>

                {/* Change Password */}
                {!editingProfile && (
                  <div className="mt-8 pt-6 border-t border-cream-dark">
                    <h3 className="font-display text-xl font-600 text-teal-950 mb-1">Security</h3>
                    <p className="font-body text-sm text-teal-950/60 mb-4">
                      Keep your account secure with a strong password.
                    </p>
                    <button className="btn-outline text-sm px-5 py-2.5">
                      Change Password
                    </button>
                  </div>
                )}
              </div>
            )}
          </main>
        </div>
      </div>

      <Footer />
    </div>
  );
}

function ProfileField({ icon: Icon, label, value, editing, onChange, type = "text", placeholder = "" }) {
  return (
    <div className="flex items-start gap-4">
      <div className="w-10 h-10 bg-cream rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5">
        <Icon size={15} className="text-teal-700" />
      </div>
      <div className="flex-1">
        <label className="block font-body text-xs font-700 text-teal-950/50 uppercase tracking-wider mb-1.5">
          {label}
        </label>
        {editing ? (
          <input
            type={type}
            className="input-field text-sm py-2.5"
            value={value || ""}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder || label}
          />
        ) : (
          <p className="font-body text-sm font-600 text-navy-900">
            {value || <span className="text-teal-950/40 font-400">Not set</span>}
          </p>
        )}
      </div>
    </div>
  );
}