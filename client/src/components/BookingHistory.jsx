import React, { useState } from "react";
import {
  FaBus, FaTrain, FaPlane, FaHotel, FaFileDownload,
  FaTimes, FaChevronDown, FaChevronUp
} from "react-icons/fa";
import { formatBookingDate, formatTime } from "../utils/formatDate";
import { formatPrice } from "../utils/formatPrice";
import { BOOKING_STATUS } from "../utils/constants";
import bookingService from "../services/booking.service";
import toast from "react-hot-toast";

const TYPE_ICONS = {
  bus: FaBus, train: FaTrain, flight: FaPlane, hotel: FaHotel,
};

function BookingCard({ booking, onCancel }) {
  const [expanded, setExpanded] = useState(false);
  const [cancelling, setCancelling] = useState(false);

  const Icon = TYPE_ICONS[booking.type] || FaBus;
  const status = BOOKING_STATUS[booking.status] || BOOKING_STATUS.pending;

  const handleCancel = async () => {
    if (!window.confirm("Are you sure you want to cancel this booking?")) return;
    setCancelling(true);
    try {
      await bookingService.cancelBooking(booking.id);
      toast.success("Booking cancelled successfully");
      onCancel && onCancel(booking.id);
    } catch (err) {
      toast.error(err.message || "Failed to cancel booking");
    } finally {
      setCancelling(false);
    }
  };

  const handleDownload = async () => {
    try {
      await bookingService.downloadTicket(booking.id);
      toast.success("Ticket downloaded!");
    } catch {
      toast.error("Download failed");
    }
  };

  return (
    <div className="card p-5 animate-slide-up">
      <div className="flex items-start justify-between gap-4">
        {/* Left: Icon + Info */}
        <div className="flex items-start gap-4">
          <div className="w-11 h-11 bg-cream rounded-xl flex items-center justify-center flex-shrink-0">
            <Icon size={20} className="text-teal-700" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="font-display text-lg font-600 text-teal-950 capitalize">
                {booking.type} Booking
              </h3>
              <span className={`tag text-xs ${status.color}`}>{status.label}</span>
            </div>

            {booking.type !== "hotel" ? (
              <p className="font-body text-sm text-navy-900 mt-0.5">
                {booking.from} → {booking.to}
              </p>
            ) : (
              <p className="font-body text-sm text-navy-900 mt-0.5">{booking.hotelName}</p>
            )}

            <p className="font-body text-xs text-teal-950/50 mt-0.5">
              {booking.type !== "hotel"
                ? `${formatBookingDate(booking.date)} · ${formatTime(booking.departureTime)}`
                : `${formatBookingDate(booking.checkIn)} – ${formatBookingDate(booking.checkOut)}`}
            </p>

            <p className="font-body text-xs text-teal-950/40 mt-0.5">
              Booking ID: #{booking.id}
            </p>
          </div>
        </div>

        {/* Right: Price */}
        <div className="text-right flex-shrink-0">
          <p className="font-display text-xl font-700 text-teal-950">
            {formatPrice(booking.totalAmount)}
          </p>
          <p className="font-body text-xs text-teal-950/50">
            {booking.passengers > 1 ? `${booking.passengers} passengers` : "1 passenger"}
          </p>
        </div>
      </div>

      {/* Expand Toggle */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="mt-3 flex items-center gap-1 font-body text-xs text-teal-700 hover:text-teal-950 transition-colors"
      >
        {expanded ? <><FaChevronUp size={10} /> Hide details</> : <><FaChevronDown size={10} /> View details</>}
      </button>

      {/* Expanded Details */}
      {expanded && (
        <div className="mt-4 pt-4 border-t border-cream-dark space-y-2 animate-fade-in">
          {booking.seatNumbers && (
            <div className="flex justify-between">
              <span className="font-body text-xs text-teal-950/60">Seat(s)</span>
              <span className="font-body text-xs font-700 text-navy-900">{booking.seatNumbers.join(", ")}</span>
            </div>
          )}
          {booking.operator && (
            <div className="flex justify-between">
              <span className="font-body text-xs text-teal-950/60">Operator</span>
              <span className="font-body text-xs font-700 text-navy-900">{booking.operator}</span>
            </div>
          )}
          {booking.class && (
            <div className="flex justify-between">
              <span className="font-body text-xs text-teal-950/60">Class</span>
              <span className="font-body text-xs font-700 text-navy-900">{booking.class}</span>
            </div>
          )}
          <div className="flex justify-between">
            <span className="font-body text-xs text-teal-950/60">Payment</span>
            <span className="font-body text-xs font-700 text-navy-900 capitalize">{booking.paymentMethod || "Online"}</span>
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="mt-4 flex items-center gap-3 flex-wrap">
        <button
          onClick={handleDownload}
          className="flex items-center gap-1.5 bg-cream hover:bg-cream-dark text-teal-950 
                     font-body text-xs font-700 px-3 py-2 rounded-lg transition-all duration-150"
        >
          <FaFileDownload size={12} />
          Download Ticket
        </button>

        {booking.status === "confirmed" && (
          <button
            onClick={handleCancel}
            disabled={cancelling}
            className="flex items-center gap-1.5 text-red-500 hover:bg-red-50 
                       font-body text-xs font-700 px-3 py-2 rounded-lg transition-all duration-150"
          >
            <FaTimes size={12} />
            {cancelling ? "Cancelling..." : "Cancel Booking"}
          </button>
        )}
      </div>
    </div>
  );
}

export default function BookingHistory({ bookings = [], loading = false, onCancel }) {
  const [filter, setFilter] = useState("all");

  const tabs = ["all", "confirmed", "pending", "cancelled", "completed"];
  const filtered = filter === "all" ? bookings : bookings.filter((b) => b.status === filter);

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-32 rounded-2xl skeleton" />
        ))}
      </div>
    );
  }

  return (
    <div>
      {/* Filter Tabs */}
      <div className="flex gap-1 p-1 bg-cream rounded-xl mb-5 overflow-x-auto">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setFilter(tab)}
            className={`px-3 py-2 rounded-lg font-body text-xs font-700 whitespace-nowrap
                        transition-all duration-200 capitalize
                        ${filter === tab ? "bg-teal-950 text-white" : "text-teal-950/60 hover:text-teal-950"}`}
          >
            {tab}
            {tab !== "all" && (
              <span className="ml-1 font-body font-400">
                ({bookings.filter((b) => b.status === tab).length})
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Booking List */}
      {filtered.length === 0 ? (
        <div className="text-center py-16">
          <div className="w-16 h-16 bg-cream rounded-full flex items-center justify-center mx-auto mb-4">
            <FaHotel size={24} className="text-teal-950/30" />
          </div>
          <p className="font-display text-xl font-600 text-teal-950/60">No bookings found</p>
          <p className="font-body text-sm text-teal-950/40 mt-1">
            {filter === "all" ? "You haven't made any bookings yet." : `No ${filter} bookings.`}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map((booking) => (
            <BookingCard key={booking.id} booking={booking} onCancel={onCancel} />
          ))}
        </div>
      )}
    </div>
  );
}