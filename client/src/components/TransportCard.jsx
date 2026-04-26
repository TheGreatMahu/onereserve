import React from "react";
import { useNavigate } from "react-router-dom";
import {
  FaBus, FaTrain, FaPlane, FaClock, FaCouch, FaStar,
  FaWifi, FaSnowflake, FaBolt, FaChevronRight
} from "react-icons/fa";
import { formatPrice } from "../utils/formatPrice";
import { formatTime, formatDuration } from "../utils/formatDate";
import { useSearch } from "../App";

const TYPE_ICONS = { bus: FaBus, train: FaTrain, flight: FaPlane };
const TYPE_COLORS = {
  bus: "bg-emerald-50 text-emerald-700",
  train: "bg-blue-50 text-blue-700",
  flight: "bg-purple-50 text-purple-700",
};

const AMENITY_ICONS = {
  wifi: { icon: FaWifi, label: "WiFi" },
  ac: { icon: FaSnowflake, label: "AC" },
  charging: { icon: FaBolt, label: "Charging" },
};

export default function TransportCard({ schedule, onSelect }) {
  const navigate = useNavigate();
  const { setSelectedTransport } = useSearch();

  const {
    id, type = "bus", operator, departureTime, arrivalTime,
    from, to, price, seats, rating, amenities = [], class: seatClass,
    busNumber, trainNumber, flightNumber,
  } = schedule;

  const Icon = TYPE_ICONS[type] || FaBus;
  const vehicleId = busNumber || trainNumber || flightNumber;
  const seatsLeft = seats?.available ?? 0;
  const lowSeats = seatsLeft > 0 && seatsLeft <= 5;

  const handleSelect = () => {
    setSelectedTransport(schedule);
    if (onSelect) onSelect(schedule);
    else navigate("/booking");
  };

  return (
    <div className="card p-5 animate-slide-up">
      <div className="flex flex-col sm:flex-row sm:items-center gap-4">
        {/* Operator Info */}
        <div className="flex items-center gap-3 sm:w-44 flex-shrink-0">
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${TYPE_COLORS[type]}`}>
            <Icon size={18} />
          </div>
          <div>
            <p className="font-body text-sm font-700 text-navy-900 leading-tight">{operator}</p>
            {vehicleId && (
              <p className="font-body text-xs text-teal-950/50">{vehicleId}</p>
            )}
            {seatClass && (
              <span className="tag bg-teal-950/8 text-teal-700 mt-0.5">
                {seatClass}
              </span>
            )}
          </div>
        </div>

        {/* Route Timeline */}
        <div className="flex-1 flex items-center gap-3">
          {/* Departure */}
          <div className="text-center">
            <p className="font-display text-xl font-600 text-navy-900">{formatTime(departureTime)}</p>
            <p className="font-body text-xs text-teal-950/60 mt-0.5">{from}</p>
          </div>

          {/* Duration Line */}
          <div className="flex-1 flex flex-col items-center gap-1">
            <div className="flex items-center gap-2 w-full">
              <div className="h-px flex-1 bg-teal-950/20" />
              <div className="flex items-center gap-1 text-teal-950/50">
                <FaClock size={10} />
                <span className="font-body text-xs">{formatDuration(departureTime, arrivalTime)}</span>
              </div>
              <div className="h-px flex-1 bg-teal-950/20" />
            </div>
            {/* Amenities */}
            <div className="flex gap-1.5 mt-0.5">
              {amenities.map((key) => {
                const a = AMENITY_ICONS[key];
                if (!a) return null;
                return (
                  <div key={key} title={a.label}
                    className="w-5 h-5 bg-cream rounded-full flex items-center justify-center text-teal-700">
                    <a.icon size={9} />
                  </div>
                );
              })}
            </div>
          </div>

          {/* Arrival */}
          <div className="text-center">
            <p className="font-display text-xl font-600 text-navy-900">{formatTime(arrivalTime)}</p>
            <p className="font-body text-xs text-teal-950/60 mt-0.5">{to}</p>
          </div>
        </div>

        {/* Price + Seat + CTA */}
        <div className="flex sm:flex-col items-center sm:items-end gap-4 sm:gap-2 sm:min-w-[140px]">
          <div className="text-right">
            <p className="font-display text-2xl font-700 text-teal-950">{formatPrice(price)}</p>
            <p className="font-body text-xs text-teal-950/50">per person</p>
          </div>

          <div className="flex flex-col items-end gap-1.5">
            {rating && (
              <div className="flex items-center gap-1">
                <FaStar className="text-gold-500" size={11} />
                <span className="font-body text-xs font-700 text-navy-900">{rating}</span>
              </div>
            )}
            {lowSeats && (
              <span className="tag bg-red-50 text-red-600">
                Only {seatsLeft} left!
              </span>
            )}
            {seatsLeft === 0 && (
              <span className="tag bg-gray-100 text-gray-500">Sold Out</span>
            )}
          </div>

          <button
            onClick={handleSelect}
            disabled={seatsLeft === 0}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-lg font-body text-sm font-700 
                        transition-all duration-200 active:scale-95
                        ${seatsLeft === 0
                          ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                          : "bg-teal-950 hover:bg-teal-800 text-white shadow-card"}`}
          >
            {seatsLeft === 0 ? "Full" : "Select"}
            {seatsLeft > 0 && <FaChevronRight size={11} />}
          </button>
        </div>
      </div>

      {/* Seat count bar */}
      {seatsLeft > 0 && (
        <div className="mt-3 pt-3 border-t border-cream-dark">
          <div className="flex items-center justify-between mb-1">
            <span className="font-body text-xs text-teal-950/50 flex items-center gap-1">
              <FaCouch size={10} /> {seatsLeft} seats available
            </span>
            <span className="font-body text-xs text-teal-950/40">
              {seats?.total - seatsLeft} booked
            </span>
          </div>
          <div className="w-full h-1.5 bg-cream-dark rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ${lowSeats ? "bg-red-400" : "bg-teal-600"}`}
              style={{ width: `${(seatsLeft / (seats?.total || 40)) * 100}%` }}
            />
          </div>
        </div>
      )}
    </div>
  );
}