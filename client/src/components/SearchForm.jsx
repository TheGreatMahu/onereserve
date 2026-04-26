import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Select from "react-select";
import {
  FaBus, FaTrain, FaPlane, FaMapMarkerAlt, FaCalendarAlt,
  FaUsers, FaExchangeAlt, FaSearch
} from "react-icons/fa";
import { BD_LOCATIONS, INTERNATIONAL_LOCATIONS } from "../utils/constants";
import { useSearch } from "../App";
import toast from "react-hot-toast";

const TRANSPORT_TABS = [
  { value: "bus", label: "Bus", Icon: FaBus },
  { value: "train", label: "Train", Icon: FaTrain },
  { value: "flight", label: "Flight", Icon: FaPlane },
];

const locationOptions = [
  {
    label: "Bangladesh",
    options: BD_LOCATIONS.map((l) => ({ value: l.value, label: l.label })),
  },
  {
    label: "International",
    options: INTERNATIONAL_LOCATIONS.map((l) => ({ value: l.value, label: l.label })),
  },
];

const selectStyles = {
  control: (base, state) => ({
    ...base,
    backgroundColor: "#F5EFE6",
    border: state.isFocused ? "2px solid #146A70" : "1px solid rgba(11,61,64,0.2)",
    borderRadius: "8px",
    boxShadow: "none",
    fontFamily: "'Nunito', sans-serif",
    fontSize: "14px",
    cursor: "pointer",
    minHeight: "48px",
    "&:hover": { borderColor: "#146A70" },
  }),
  option: (base, { isSelected, isFocused }) => ({
    ...base,
    backgroundColor: isSelected ? "#0B3D40" : isFocused ? "#EDE4D6" : "white",
    color: isSelected ? "white" : "#0A1628",
    fontFamily: "'Nunito', sans-serif",
    fontSize: "14px",
    cursor: "pointer",
  }),
  groupHeading: (base) => ({
    ...base,
    color: "#C9963A",
    fontFamily: "'Nunito', sans-serif",
    fontWeight: 700,
    fontSize: "11px",
    letterSpacing: "0.05em",
    textTransform: "uppercase",
  }),
  menu: (base) => ({ ...base, borderRadius: "12px", overflow: "hidden", boxShadow: "0 8px 32px rgba(11,61,64,0.15)" }),
  singleValue: (base) => ({ ...base, color: "#0A1628" }),
  placeholder: (base) => ({ ...base, color: "rgba(10,22,40,0.4)" }),
};

export default function SearchForm({ compact = false }) {
  const { searchParams, setSearchParams } = useSearch();
  const navigate = useNavigate();
  const [type, setType] = useState(searchParams.type || "bus");
  const [origin, setOrigin] = useState(null);
  const [destination, setDestination] = useState(null);
  const [date, setDate] = useState(searchParams.date || new Date());
  const [passengers, setPassengers] = useState(1);
  const [tripType, setTripType] = useState("one-way");
  const [returnDate, setReturnDate] = useState(null);

  const swapLocations = () => {
    const temp = origin;
    setOrigin(destination);
    setDestination(temp);
  };

  const handleSearch = () => {
    if (!origin) return toast.error("Please select origin location");
    if (!destination) return toast.error("Please select destination");
    if (origin.value === destination.value) return toast.error("Origin and destination cannot be the same");

    setSearchParams({ type, origin: origin.value, destination: destination.value, date, passengers, tripType, returnDate });
    navigate("/results/transport");
  };

  const inputClass = `w-full bg-cream border border-teal-950/20 rounded-lg px-4 py-3 
    font-body text-sm text-navy-900 focus:outline-none focus:ring-2 focus:ring-teal-700/40 
    focus:border-teal-700 transition-all duration-200`;

  return (
    <div className={`bg-white rounded-2xl shadow-card-hover ${compact ? "p-4" : "p-6"}`}>
      {/* Transport Type Tabs */}
      <div className="flex gap-1 p-1 bg-cream rounded-xl mb-5 w-fit">
        {TRANSPORT_TABS.map(({ value, label, Icon }) => (
          <button
            key={value}
            onClick={() => setType(value)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-body text-sm font-600 
                        transition-all duration-200 
                        ${type === value
                          ? "bg-teal-950 text-white shadow-sm"
                          : "text-teal-950/60 hover:text-teal-950"}`}
          >
            <Icon size={14} />
            {label}
          </button>
        ))}
      </div>

      {/* Trip Type (for flights) */}
      {type === "flight" && (
        <div className="flex gap-4 mb-4">
          {["one-way", "return"].map((t) => (
            <label key={t} className="flex items-center gap-2 cursor-pointer">
              <input type="radio" name="tripType" value={t}
                checked={tripType === t}
                onChange={() => setTripType(t)}
                className="accent-teal-950"
              />
              <span className="font-body text-sm text-navy-900 capitalize">{t.replace("-", " ")}</span>
            </label>
          ))}
        </div>
      )}

      {/* Location + Date Row */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-3 mb-3">
        {/* Origin */}
        <div className="md:col-span-4 relative">
          <label className="block font-body text-xs font-700 text-teal-950/60 uppercase tracking-wider mb-1.5">
            <FaMapMarkerAlt className="inline mr-1" />From
          </label>
          <Select
            options={locationOptions}
            value={origin}
            onChange={setOrigin}
            placeholder="Select origin"
            styles={selectStyles}
            isSearchable
          />
        </div>

        {/* Swap Button */}
        <div className="md:col-span-1 flex items-end justify-center pb-1">
          <button
            onClick={swapLocations}
            className="w-10 h-10 rounded-full bg-cream hover:bg-gold-200 
                       border border-teal-950/15 flex items-center justify-center
                       text-teal-700 transition-all duration-200 hover:rotate-180"
          >
            <FaExchangeAlt size={14} />
          </button>
        </div>

        {/* Destination */}
        <div className="md:col-span-4">
          <label className="block font-body text-xs font-700 text-teal-950/60 uppercase tracking-wider mb-1.5">
            <FaMapMarkerAlt className="inline mr-1" />To
          </label>
          <Select
            options={locationOptions}
            value={destination}
            onChange={setDestination}
            placeholder="Select destination"
            styles={selectStyles}
            isSearchable
          />
        </div>

        {/* Date */}
        <div className="md:col-span-3">
          <label className="block font-body text-xs font-700 text-teal-950/60 uppercase tracking-wider mb-1.5">
            <FaCalendarAlt className="inline mr-1" />
            {tripType === "return" ? "Departure" : "Date"}
          </label>
          <DatePicker
            selected={date}
            onChange={setDate}
            minDate={new Date()}
            dateFormat="dd MMM yyyy"
            className={inputClass}
            placeholderText="Select date"
          />
        </div>
      </div>

      {/* Second row: Return date + Passengers + Search */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-end">
        {/* Return Date */}
        {type === "flight" && tripType === "return" && (
          <div className="md:col-span-4">
            <label className="block font-body text-xs font-700 text-teal-950/60 uppercase tracking-wider mb-1.5">
              <FaCalendarAlt className="inline mr-1" />Return Date
            </label>
            <DatePicker
              selected={returnDate}
              onChange={setReturnDate}
              minDate={date || new Date()}
              dateFormat="dd MMM yyyy"
              className={inputClass}
              placeholderText="Select return date"
            />
          </div>
        )}

        {/* Passengers */}
        <div className="md:col-span-3">
          <label className="block font-body text-xs font-700 text-teal-950/60 uppercase tracking-wider mb-1.5">
            <FaUsers className="inline mr-1" />Passengers
          </label>
          <div className="flex items-center gap-2 bg-cream border border-teal-950/20 rounded-lg px-4 py-2.5">
            <button
              onClick={() => setPassengers(Math.max(1, passengers - 1))}
              className="w-7 h-7 rounded-full bg-teal-950 text-white font-body text-lg 
                         flex items-center justify-center hover:bg-teal-800 transition-colors"
            >−</button>
            <span className="flex-1 text-center font-body text-sm font-700 text-navy-900">{passengers}</span>
            <button
              onClick={() => setPassengers(Math.min(9, passengers + 1))}
              className="w-7 h-7 rounded-full bg-teal-950 text-white font-body text-lg 
                         flex items-center justify-center hover:bg-teal-800 transition-colors"
            >+</button>
          </div>
        </div>

        {/* Search Button */}
        <div className={type === "flight" && tripType === "return" ? "md:col-span-5" : "md:col-span-6"}>
          <button
            onClick={handleSearch}
            className="w-full bg-gold-500 hover:bg-gold-400 text-navy-900 font-body font-800 
                       py-3 rounded-lg transition-all duration-200 shadow-gold 
                       active:scale-95 flex items-center justify-center gap-2 text-sm uppercase tracking-wide"
          >
            <FaSearch size={14} />
            Search {type === "bus" ? "Buses" : type === "train" ? "Trains" : "Flights"}
          </button>
        </div>
      </div>
    </div>
  );
}