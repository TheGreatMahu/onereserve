import React, { useState, useEffect, useRef } from "react";
import { FaCouch, FaCog } from "react-icons/fa";

const SEAT_STATUS = {
  available: "available",
  booked: "booked",
  selected: "selected",
  locked: "locked", // temp lock by another user
  driver: "driver",
};

const STATUS_STYLES = {
  available: "bg-cream border-teal-950/30 text-teal-950 hover:bg-teal-700 hover:text-white hover:border-teal-700 cursor-pointer",
  booked: "bg-gray-200 border-gray-300 text-gray-400 cursor-not-allowed",
  selected: "bg-teal-950 border-teal-950 text-white shadow-card",
  locked: "bg-orange-100 border-orange-300 text-orange-500 cursor-not-allowed",
  driver: "bg-navy-900 border-navy-900 text-white cursor-not-allowed",
};

function SeatLegend() {
  const items = [
    { style: "bg-cream border-teal-950/30", label: "Available" },
    { style: "bg-teal-950", label: "Selected" },
    { style: "bg-gray-200 border-gray-300", label: "Booked" },
    { style: "bg-orange-100 border-orange-300", label: "Locked" },
    { style: "bg-navy-900", label: "Driver" },
  ];
  return (
    <div className="flex flex-wrap gap-3 mt-4">
      {items.map(({ style, label }) => (
        <div key={label} className="flex items-center gap-1.5">
          <div className={`w-4 h-4 rounded border ${style}`} />
          <span className="font-body text-xs text-teal-950/60">{label}</span>
        </div>
      ))}
    </div>
  );
}

export default function SeatSelector({ seats = [], maxSelect = 1, onSelect, type = "bus" }) {
  const [selectedSeats, setSelectedSeats] = useState([]);
  const lockTimers = useRef({});

  // Build grid from seats array
  const seatMap = {};
  seats.forEach((seat) => {
    seatMap[seat.number] = seat;
  });

  const toggleSeat = (seat) => {
    if (seat.status === SEAT_STATUS.booked ||
      seat.status === SEAT_STATUS.locked ||
      seat.status === SEAT_STATUS.driver) return;

    setSelectedSeats((prev) => {
      const isSelected = prev.find((s) => s.number === seat.number);
      if (isSelected) {
        const next = prev.filter((s) => s.number !== seat.number);
        onSelect && onSelect(next);
        return next;
      }
      if (prev.length >= maxSelect) {
        // Replace last selected
        const next = [...prev.slice(0, -1), seat];
        onSelect && onSelect(next);
        return next;
      }
      const next = [...prev, seat];
      onSelect && onSelect(next);
      return next;
    });
  };

  const getSeatStatus = (seat) => {
    if (selectedSeats.find((s) => s.number === seat.number)) return SEAT_STATUS.selected;
    return seat.status || SEAT_STATUS.available;
  };

  // Render based on transport type
  if (type === "bus") {
    // Bus: 2+2 layout, rows of 10
    const rows = [];
    for (let r = 1; r <= 10; r++) {
      rows.push([
        seatMap[`${r}A`] || { number: `${r}A`, status: SEAT_STATUS.available },
        seatMap[`${r}B`] || { number: `${r}B`, status: SEAT_STATUS.available },
        null, // aisle
        seatMap[`${r}C`] || { number: `${r}C`, status: SEAT_STATUS.available },
        seatMap[`${r}D`] || { number: `${r}D`, status: SEAT_STATUS.available },
      ]);
    }

    return (
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-display text-xl font-600 text-teal-950">Select Seat</h3>
          <span className="font-body text-sm text-teal-950/60">
            {selectedSeats.length}/{maxSelect} selected
          </span>
        </div>

        {/* Bus outline */}
        <div className="bg-cream rounded-2xl p-4 border border-teal-950/10">
          {/* Driver */}
          <div className="flex justify-end mb-4 pr-1">
            <div className="w-10 h-10 bg-navy-900 text-white rounded-full flex items-center justify-center">
              <FaCog size={14} />
            </div>
          </div>

          {/* Seat grid */}
          <div className="space-y-2">
            {rows.map((row, ri) => (
              <div key={ri} className="flex items-center gap-2">
                <span className="font-body text-xs text-teal-950/40 w-4 text-center">{ri + 1}</span>
                {row.map((seat, si) => {
                  if (seat === null) return <div key="aisle" className="w-4" />;
                  const status = getSeatStatus(seat);
                  return (
                    <button
                      key={seat.number}
                      onClick={() => toggleSeat(seat)}
                      className={`w-9 h-9 rounded-lg border-2 text-xs font-body font-700
                                  flex items-center justify-center transition-all duration-150 
                                  ${STATUS_STYLES[status]}`}
                      title={seat.number}
                    >
                      <FaCouch size={12} />
                    </button>
                  );
                })}
              </div>
            ))}
          </div>
        </div>

        <SeatLegend />

        {/* Selected summary */}
        {selectedSeats.length > 0 && (
          <div className="mt-4 bg-teal-950/5 rounded-xl p-3 flex items-center justify-between">
            <span className="font-body text-sm text-teal-950">
              Seat{selectedSeats.length > 1 ? "s" : ""}: {selectedSeats.map((s) => s.number).join(", ")}
            </span>
            <button
              onClick={() => { setSelectedSeats([]); onSelect && onSelect([]); }}
              className="font-body text-xs text-red-500 hover:underline"
            >
              Clear
            </button>
          </div>
        )}
      </div>
    );
  }

  // Flight: Generic cabin layout
  const cabinRows = [];
  for (let r = 1; r <= 30; r++) {
    cabinRows.push(["A", "B", "C", null, "D", "E", "F"].map((col) => {
      if (!col) return null;
      const num = `${r}${col}`;
      return seatMap[num] || { number: num, status: r <= 2 ? SEAT_STATUS.booked : SEAT_STATUS.available };
    }));
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-display text-xl font-600 text-teal-950">Select Seat</h3>
        <span className="font-body text-sm text-teal-950/60">
          {selectedSeats.length}/{maxSelect} selected
        </span>
      </div>

      <div className="bg-cream rounded-2xl p-4 border border-teal-950/10 max-h-80 overflow-y-auto">
        {/* Column labels */}
        <div className="flex gap-1.5 mb-2 pl-8">
          {["A", "B", "C", "", "D", "E", "F"].map((c, i) => (
            <div key={i} className={`w-8 text-center font-body text-xs font-700 text-teal-950/40 ${!c ? "w-4" : ""}`}>{c}</div>
          ))}
        </div>

        <div className="space-y-1.5">
          {cabinRows.map((row, ri) => (
            <div key={ri} className="flex items-center gap-1.5">
              <span className="font-body text-xs text-teal-950/40 w-6 text-right">{ri + 1}</span>
              {row.map((seat, si) => {
                if (!seat) return <div key="aisle" className="w-4" />;
                const status = getSeatStatus(seat);
                return (
                  <button
                    key={seat.number}
                    onClick={() => toggleSeat(seat)}
                    className={`w-8 h-7 rounded text-xs font-body font-700
                                transition-all duration-150 border
                                ${STATUS_STYLES[status]}`}
                  />
                );
              })}
            </div>
          ))}
        </div>
      </div>

      <SeatLegend />
    </div>
  );
}