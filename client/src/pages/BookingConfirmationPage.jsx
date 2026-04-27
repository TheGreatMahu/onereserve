import React, { useEffect, useRef } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import {
  FaCheckCircle, FaFileDownload, FaShareAlt, FaHome,
  FaHotel, FaBus, FaTrain, FaPlane, FaMapMarkerAlt,
  FaCalendarAlt, FaUsers, FaTag
} from "react-icons/fa";
import Navbar from "../components/Navbar";
import { formatBookingDate, formatTime } from "../utils/formatDate";
import { formatPrice } from "../utils/formatPrice";
import bookingService from "../services/booking.service";
import toast from "react-hot-toast";

const TYPE_ICONS = { bus: FaBus, train: FaTrain, flight: FaPlane, hotel: FaHotel };

// Confetti-ish animation using CSS
function ConfettiDot({ style }) {
  return <div className="absolute w-2 h-2 rounded-full animate-bounce" style={style} />;
}

export default function BookingConfirmationPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const ticketRef = useRef(null);

  const { booking, item, type } = location.state || {};

  useEffect(() => {
    if (!booking) { navigate("/dashboard"); }
  }, [booking]);

  if (!booking) return null;

  const bookingId = booking?.id || booking?.bookingId || `OR-${Date.now()}`;
  const TypeIcon = TYPE_ICONS[type] || FaBus;

  const handleDownload = async () => {
    try {
      await bookingService.downloadTicket(bookingId);
      toast.success("Ticket downloaded!");
    } catch {
      toast.error("Download failed. Please try from My Bookings.");
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: "My OneReserve Booking",
        text: `Booking #${bookingId} confirmed via OneReserve!`,
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(`Booking #${bookingId} confirmed via OneReserve!`);
      toast.success("Booking info copied to clipboard!");
    }
  };

  const confettiColors = ["#C9963A", "#146A70", "#0B3D40", "#D4A847", "#20AAAD"];
  const dots = Array.from({ length: 12 }, (_, i) => ({
    backgroundColor: confettiColors[i % confettiColors.length],
    top: `${Math.random() * 60}%`,
    left: `${Math.random() * 100}%`,
    animationDelay: `${Math.random() * 1}s`,
    animationDuration: `${0.8 + Math.random() * 0.6}s`,
  }));

  return (
    <div className="min-h-screen bg-cream flex flex-col">
      <Navbar />

      <div className="flex-1 flex flex-col items-center justify-center px-4 py-16 pt-24">
        {/* ── Success Animation ───────────────────────────────────────────── */}
        <div className="relative mb-6">
          {dots.map((style, i) => <ConfettiDot key={i} style={style} />)}
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center
                          animate-[fadeIn_0.5s_ease-out]">
            <FaCheckCircle size={40} className="text-green-500" />
          </div>
        </div>

        <h1 className="font-display text-4xl md:text-5xl font-700 text-teal-950 text-center mb-2 animate-slide-up">
          Booking Confirmed!
        </h1>
        <p className="font-body text-teal-950/60 text-center mb-2 animate-slide-up"
          style={{ animationDelay: "0.1s" }}>
          Your booking is confirmed. Check your email for details.
        </p>
        <div className="flex items-center gap-2 bg-teal-950 text-gold-400 rounded-full px-4 py-1.5 mb-10
                        animate-slide-up" style={{ animationDelay: "0.15s" }}>
          <FaTag size={12} />
          <span className="font-body text-sm font-700">Booking ID: #{bookingId}</span>
        </div>

        {/* ── Ticket Card ─────────────────────────────────────────────────── */}
        <div
          ref={ticketRef}
          className="w-full max-w-lg bg-white rounded-2xl shadow-card-hover overflow-hidden animate-slide-up"
          style={{ animationDelay: "0.2s" }}
        >
          {/* Ticket Header */}
          <div className="bg-teal-950 px-6 py-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gold-500/20 rounded-xl flex items-center justify-center">
                  <TypeIcon size={20} className="text-gold-400" />
                </div>
                <div>
                  <p className="font-body text-xs text-white/50 uppercase tracking-wider capitalize">
                    {type} Ticket
                  </p>
                  <p className="font-display text-lg font-600 text-white">
                    {type === "hotel" ? item?.name : item?.operator}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-body text-xs text-white/50">Total Paid</p>
                <p className="font-display text-xl font-700 text-gold-400">
                  {formatPrice(booking?.totalAmount || 0)}
                </p>
              </div>
            </div>
          </div>

          {/* Dashed Separator (ticket punch) */}
          <div className="relative">
            <div className="absolute -left-4 top-1/2 -translate-y-1/2 w-8 h-8 bg-cream rounded-full" />
            <div className="absolute -right-4 top-1/2 -translate-y-1/2 w-8 h-8 bg-cream rounded-full" />
            <div className="border-t-2 border-dashed border-cream-dark mx-4" />
          </div>

          {/* Ticket Body */}
          <div className="px-6 py-5">
            {type !== "hotel" ? (
              <>
                {/* Transport Ticket */}
                <div className="flex items-center justify-between mb-5">
                  <div>
                    <p className="font-display text-3xl font-700 text-teal-950">
                      {formatTime(item?.departureTime)}
                    </p>
                    <p className="font-body text-sm text-teal-950/60">{item?.from}</p>
                  </div>
                  <div className="flex flex-col items-center gap-1">
                    <div className="h-px w-20 bg-teal-950/20" />
                    <TypeIcon size={16} className="text-teal-700" />
                    <div className="h-px w-20 bg-teal-950/20" />
                  </div>
                  <div className="text-right">
                    <p className="font-display text-3xl font-700 text-teal-950">
                      {formatTime(item?.arrivalTime)}
                    </p>
                    <p className="font-body text-sm text-teal-950/60">{item?.to}</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <InfoBox icon={FaCalendarAlt} label="Date" value={formatBookingDate(booking?.date || new Date())} />
                  <InfoBox icon={FaUsers} label="Passengers" value={booking?.passengers || 1} />
                  {booking?.seats?.length > 0 && (
                    <InfoBox icon={FaTag} label="Seats" value={booking.seats.join(", ")} />
                  )}
                  <InfoBox icon={FaTag} label="Class" value={item?.class || "Standard"} />
                </div>
              </>
            ) : (
              <>
                {/* Hotel Ticket */}
                <div className="grid grid-cols-2 gap-4">
                  <InfoBox icon={FaMapMarkerAlt} label="Location" value={item?.location} />
                  <InfoBox icon={FaUsers} label="Guests" value={booking?.guests || 1} />
                  <InfoBox icon={FaCalendarAlt} label="Check-in" value={formatBookingDate(booking?.checkIn || new Date())} />
                  <InfoBox icon={FaCalendarAlt} label="Check-out" value={formatBookingDate(booking?.checkOut || new Date())} />
                </div>
              </>
            )}
          </div>

          {/* Ticket Footer */}
          <div className="bg-cream px-6 py-4 flex items-center justify-between">
            <div>
              <p className="font-body text-xs text-teal-950/40">Payment Method</p>
              <p className="font-body text-sm font-700 text-navy-900 capitalize">
                {booking?.paymentMethod || "Online Payment"}
              </p>
            </div>
            <div className="text-right">
              <p className="font-body text-xs text-teal-950/40">Status</p>
              <span className="tag bg-green-100 text-green-700 text-xs font-700">
                ✓ Confirmed
              </span>
            </div>
          </div>
        </div>

        {/* ── Action Buttons ─────────────────────────────────────────────── */}
        <div className="flex flex-wrap gap-3 mt-8 justify-center animate-slide-up"
          style={{ animationDelay: "0.3s" }}>
          <button
            onClick={handleDownload}
            className="flex items-center gap-2 bg-teal-950 hover:bg-teal-800 
                       text-white font-body text-sm font-700 px-5 py-3 rounded-xl 
                       transition-all duration-200 shadow-card active:scale-95"
          >
            <FaFileDownload size={15} />
            Download Ticket
          </button>
          <button
            onClick={handleShare}
            className="flex items-center gap-2 bg-white hover:bg-cream border border-teal-950/20
                       text-teal-950 font-body text-sm font-700 px-5 py-3 rounded-xl 
                       transition-all duration-200 active:scale-95"
          >
            <FaShareAlt size={14} />
            Share
          </button>
          <Link
            to="/dashboard"
            className="flex items-center gap-2 bg-white hover:bg-cream border border-teal-950/20
                       text-teal-950 font-body text-sm font-700 px-5 py-3 rounded-xl 
                       transition-all duration-200 active:scale-95"
          >
            <FaHome size={14} />
            My Bookings
          </Link>
        </div>

        {/* What's Next */}
        <div className="mt-10 max-w-lg w-full animate-fade-in" style={{ animationDelay: "0.4s" }}>
          <div className="card p-5">
            <h3 className="font-display text-lg font-600 text-teal-950 mb-3">What's Next?</h3>
            <div className="space-y-3">
              {[
                { num: "1", text: "You'll receive a confirmation email with your ticket." },
                { num: "2", text: "Download or save your ticket before departure." },
                { num: "3", text: "Arrive 30 minutes early and show your ticket at boarding." },
              ].map(({ num, text }) => (
                <div key={num} className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-teal-950 text-white rounded-full flex items-center justify-center 
                                  font-body text-xs font-700 flex-shrink-0 mt-0.5">
                    {num}
                  </div>
                  <p className="font-body text-sm text-teal-950/70">{text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function InfoBox({ icon: Icon, label, value }) {
  return (
    <div className="bg-cream rounded-xl p-3">
      <div className="flex items-center gap-1.5 mb-1">
        <Icon size={11} className="text-teal-700" />
        <p className="font-body text-xs text-teal-950/50 uppercase tracking-wider">{label}</p>
      </div>
      <p className="font-body text-sm font-700 text-navy-900 truncate">{value}</p>
    </div>
  );
}