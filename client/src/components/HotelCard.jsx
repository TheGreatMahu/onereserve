import React from "react";
import { useNavigate } from "react-router-dom";
import {
  FaStar, FaMapMarkerAlt, FaWifi, FaParking, FaSwimmingPool,
  FaDumbbell, FaUtensils, FaSnowflake, FaChevronRight
} from "react-icons/fa";
import { formatPrice, formatPricePerNight } from "../utils/formatPrice";
import { useSearch } from "../App";

const AMENITY_ICONS = {
  wifi: { icon: FaWifi, label: "WiFi" },
  parking: { icon: FaParking, label: "Parking" },
  pool: { icon: FaSwimmingPool, label: "Pool" },
  gym: { icon: FaDumbbell, label: "Gym" },
  restaurant: { icon: FaUtensils, label: "Restaurant" },
  ac: { icon: FaSnowflake, label: "AC" },
};

function StarRating({ rating }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <FaStar
          key={i}
          size={12}
          className={i <= Math.round(rating) ? "text-gold-500" : "text-cream-dark"}
        />
      ))}
      <span className="font-body text-xs font-700 text-navy-900 ml-1">{rating}</span>
    </div>
  );
}

export default function HotelCard({ hotel, checkIn, checkOut }) {
  const navigate = useNavigate();
  const { setSelectedHotel } = useSearch();

  const {
    id, name, location, rating, reviewCount,
    pricePerNight, amenities = [], images = [],
    roomsLeft, category, distance,
  } = hotel;

  const nights = checkIn && checkOut
    ? Math.ceil((new Date(checkOut) - new Date(checkIn)) / (1000 * 60 * 60 * 24))
    : 1;

  const handleSelect = () => {
    setSelectedHotel(hotel);
    navigate("/booking?type=hotel");
  };

  const imgSrc = images[0] || `https://placehold.co/400x250/0B3D40/F5EFE6?text=${encodeURIComponent(name)}`;

  return (
    <div className="card overflow-hidden animate-slide-up">
      {/* Hotel Image */}
      <div className="relative h-48 bg-cream overflow-hidden">
        <img
          src={imgSrc}
          alt={name}
          className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
          onError={(e) => {
            e.target.src = `https://placehold.co/400x250/0B3D40/F5EFE6?text=${encodeURIComponent(name)}`;
          }}
        />
        {/* Category badge */}
        {category && (
          <span className="absolute top-3 left-3 tag bg-navy-900/80 text-gold-400 backdrop-blur-sm">
            {category}
          </span>
        )}
        {/* Rooms left */}
        {roomsLeft && roomsLeft <= 3 && (
          <span className="absolute top-3 right-3 tag bg-red-500 text-white">
            Only {roomsLeft} left!
          </span>
        )}
      </div>

      {/* Hotel Info */}
      <div className="p-5">
        <div className="flex items-start justify-between gap-2 mb-2">
          <h3 className="font-display text-xl font-600 text-teal-950 leading-tight">{name}</h3>
          <StarRating rating={rating} />
        </div>

        <div className="flex items-center gap-1.5 mb-3">
          <FaMapMarkerAlt size={11} className="text-gold-500 flex-shrink-0" />
          <span className="font-body text-xs text-teal-950/60">{location}</span>
          {distance && (
            <span className="font-body text-xs text-teal-950/40 ml-1">· {distance} from center</span>
          )}
        </div>

        {/* Amenities */}
        <div className="flex flex-wrap gap-2 mb-4">
          {amenities.slice(0, 5).map((key) => {
            const a = AMENITY_ICONS[key];
            if (!a) return null;
            return (
              <div key={key}
                className="flex items-center gap-1 bg-cream rounded-full px-2.5 py-1">
                <a.icon size={10} className="text-teal-700" />
                <span className="font-body text-xs text-teal-950/70">{a.label}</span>
              </div>
            );
          })}
        </div>

        {/* Price + CTA */}
        <div className="flex items-end justify-between pt-3 border-t border-cream-dark">
          <div>
            <p className="font-display text-2xl font-700 text-teal-950">
              {formatPricePerNight(pricePerNight)}
            </p>
            {nights > 1 && (
              <p className="font-body text-xs text-teal-950/50">
                Total: {formatPrice(pricePerNight * nights)} · {nights} nights
              </p>
            )}
            {reviewCount && (
              <p className="font-body text-xs text-teal-950/40 mt-0.5">
                {reviewCount} reviews
              </p>
            )}
          </div>

          <button
            onClick={handleSelect}
            className="flex items-center gap-1.5 bg-teal-950 hover:bg-teal-800 text-white 
                       font-body text-sm font-700 px-4 py-2.5 rounded-lg 
                       transition-all duration-200 active:scale-95 shadow-card"
          >
            Book Now
            <FaChevronRight size={11} />
          </button>
        </div>
      </div>
    </div>
  );
}