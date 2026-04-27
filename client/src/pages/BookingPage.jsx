import React, { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { FaUser, FaEnvelope, FaPhone, FaCreditCard, FaLock, FaCheckCircle } from "react-icons/fa";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import SeatSelector from "../components/SeatSelector";
import { useSearch, useAuth } from "../App";
import { formatTime, formatDuration, formatBookingDate } from "../utils/formatDate";
import { formatPrice, calcTotal } from "../utils/formatPrice";
import bookingService from "../services/booking.service";
import toast from "react-hot-toast";

const STEPS = ["Trip Details", "Passenger Info", "Payment"];

const PAYMENT_METHODS = [
  { value: "bkash", label: "bKash", color: "#E2136E" },
  { value: "nagad", label: "Nagad", color: "#F37720" },
  { value: "rocket", label: "Rocket", color: "#8B44AE" },
  { value: "card", label: "Credit / Debit Card", color: "#1A1A2E" },
  { value: "bank", label: "Bank Transfer", color: "#0B3D40" },
];

export default function BookingPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const bookingType = searchParams.get("type") || "transport"; // transport | hotel
  const { selectedTransport, selectedHotel, searchParams: sp } = useSearch();
  const { user } = useAuth();

  const item = bookingType === "hotel" ? selectedHotel : selectedTransport;

  const [step, setStep] = useState(0);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [passengers, setPassengers] = useState(
    Array.from({ length: sp.passengers || 1 }, (_, i) => ({
      id: i,
      name: i === 0 ? (user?.name || "") : "",
      age: "",
      gender: "male",
      phone: i === 0 ? (user?.phone || "") : "",
      email: i === 0 ? (user?.email || "") : "",
      nid: "",
    }))
  );
  const [paymentMethod, setPaymentMethod] = useState("bkash");
  const [cardDetails, setCardDetails] = useState({ number: "", expiry: "", cvv: "", holder: "" });
  const [loading, setLoading] = useState(false);
  const [agreed, setAgreed] = useState(false);

  // If no item selected, redirect
  if (!item) {
    navigate(bookingType === "hotel" ? "/results/hotels" : "/results/transport");
    return null;
  }

  const { subtotal, tax, total } = calcTotal(
    bookingType === "hotel" ? item.pricePerNight : item.price,
    sp.passengers || 1,
    0.075
  );

  const updatePassenger = (idx, field, value) => {
    setPassengers((prev) =>
      prev.map((p, i) => (i === idx ? { ...p, [field]: value } : p))
    );
  };

  const validateStep = () => {
    if (step === 0 && bookingType === "transport" && selectedSeats.length < (sp.passengers || 1)) {
      toast.error(`Please select ${sp.passengers || 1} seat(s)`);
      return false;
    }
    if (step === 1) {
      for (const p of passengers) {
        if (!p.name.trim()) { toast.error("All passenger names are required"); return false; }
        if (!p.age || p.age < 1 || p.age > 120) { toast.error("Valid age is required for all passengers"); return false; }
      }
    }
    if (step === 2 && !agreed) { toast.error("Please agree to the terms"); return false; }
    return true;
  };

  const handleNext = () => {
    if (!validateStep()) return;
    if (step < STEPS.length - 1) setStep(step + 1);
  };

  const handleSubmit = async () => {
    if (!validateStep()) return;
    setLoading(true);
    try {
      const bookingData = bookingType === "hotel"
        ? {
            hotelId: item.id,
            checkIn: sp.date,
            checkOut: sp.returnDate || new Date(Date.now() + 86400000 * 2),
            guests: sp.passengers || 1,
            roomType: item.selectedRoom,
            paymentMethod,
            totalAmount: total,
          }
        : {
            scheduleId: item.id,
            seats: selectedSeats.map((s) => s.number),
            passengers,
            paymentMethod,
            totalAmount: total,
          };

      const result = bookingType === "hotel"
        ? await bookingService.createHotelBooking(bookingData)
        : await bookingService.createTransportBooking(bookingData);

      toast.success("Booking confirmed! 🎉");
      navigate("/booking/confirmation", { state: { booking: result, item, type: bookingType } });
    } catch (err) {
      toast.error(err.message || "Booking failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-cream flex flex-col">
      <Navbar />

      {/* ── Progress Header ────────────────────────────────────────────────── */}
      <div className="bg-navy-900 pt-20 pb-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="font-display text-2xl font-700 text-white mb-5">
            {bookingType === "hotel" ? "Hotel Booking" : `${item.type?.charAt(0).toUpperCase() + item.type?.slice(1)} Booking`}
          </h1>
          <div className="flex items-center gap-0">
            {STEPS.map((s, i) => (
              <React.Fragment key={s}>
                <div className="flex items-center gap-2">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center font-body text-sm font-700
                                   transition-all duration-300
                                   ${i < step ? "bg-gold-500 text-navy-900" : i === step ? "bg-white text-navy-900" : "bg-white/20 text-white/40"}`}>
                    {i < step ? <FaCheckCircle size={14} /> : i + 1}
                  </div>
                  <span className={`font-body text-sm font-600 transition-all duration-300
                                    ${i === step ? "text-white" : i < step ? "text-gold-400" : "text-white/40"}`}>
                    {s}
                  </span>
                </div>
                {i < STEPS.length - 1 && (
                  <div className={`flex-1 h-px mx-4 transition-all duration-500
                                   ${i < step ? "bg-gold-500" : "bg-white/20"}`} />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full flex-1">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* ── Main Content ────────────────────────────────────────────────── */}
          <div className="lg:col-span-2 space-y-6">

            {/* Step 0: Seat / Room Selection */}
            {step === 0 && (
              <div className="card p-6 animate-fade-in">
                {bookingType === "transport" ? (
                  <SeatSelector
                    seats={[]}
                    maxSelect={sp.passengers || 1}
                    onSelect={setSelectedSeats}
                    type={item.type}
                  />
                ) : (
                  <div>
                    <h2 className="font-display text-2xl font-700 text-teal-950 mb-5">Room Details</h2>
                    <div className="bg-cream rounded-xl p-4 border border-teal-950/10">
                      <h3 className="font-display text-xl font-600 text-teal-950">{item.name}</h3>
                      <p className="font-body text-sm text-teal-950/60 mt-1">{item.location}</p>
                      <div className="mt-3 flex flex-wrap gap-3">
                        <div className="bg-white rounded-lg px-3 py-2">
                          <p className="font-body text-xs text-teal-950/50">Check-in</p>
                          <p className="font-body text-sm font-700 text-navy-900">{formatBookingDate(sp.date)}</p>
                        </div>
                        <div className="bg-white rounded-lg px-3 py-2">
                          <p className="font-body text-xs text-teal-950/50">Check-out</p>
                          <p className="font-body text-sm font-700 text-navy-900">
                            {formatBookingDate(sp.returnDate || new Date(Date.now() + 86400000 * 2))}
                          </p>
                        </div>
                        <div className="bg-white rounded-lg px-3 py-2">
                          <p className="font-body text-xs text-teal-950/50">Guests</p>
                          <p className="font-body text-sm font-700 text-navy-900">{sp.passengers || 1}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Step 1: Passenger Details */}
            {step === 1 && (
              <div className="card p-6 animate-fade-in">
                <h2 className="font-display text-2xl font-700 text-teal-950 mb-5">
                  Passenger Information
                </h2>
                <div className="space-y-6">
                  {passengers.map((p, i) => (
                    <div key={i} className="border border-cream-dark rounded-xl p-5">
                      <div className="flex items-center gap-2 mb-4">
                        <div className="w-8 h-8 bg-teal-950 text-white rounded-full 
                                        flex items-center justify-center font-body text-sm font-700">
                          {i + 1}
                        </div>
                        <h3 className="font-display text-lg font-600 text-teal-950">
                          Passenger {i + 1} {i === 0 && "(Primary)"}
                        </h3>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block font-body text-xs font-700 text-teal-950/60 uppercase tracking-wider mb-1.5">
                            Full Name *
                          </label>
                          <div className="relative">
                            <FaUser className="absolute left-3 top-1/2 -translate-y-1/2 text-teal-700" size={13} />
                            <input type="text"
                              className="input-field pl-9 text-sm py-2.5"
                              placeholder="Full name"
                              value={p.name}
                              onChange={(e) => updatePassenger(i, "name", e.target.value)}
                            />
                          </div>
                        </div>
                        <div>
                          <label className="block font-body text-xs font-700 text-teal-950/60 uppercase tracking-wider mb-1.5">
                            Age *
                          </label>
                          <input type="number"
                            className="input-field text-sm py-2.5"
                            placeholder="Age"
                            min={1} max={120}
                            value={p.age}
                            onChange={(e) => updatePassenger(i, "age", e.target.value)}
                          />
                        </div>
                        <div>
                          <label className="block font-body text-xs font-700 text-teal-950/60 uppercase tracking-wider mb-1.5">
                            Gender *
                          </label>
                          <select
                            className="input-field text-sm py-2.5"
                            value={p.gender}
                            onChange={(e) => updatePassenger(i, "gender", e.target.value)}
                          >
                            <option value="male">Male</option>
                            <option value="female">Female</option>
                            <option value="other">Other</option>
                          </select>
                        </div>
                        <div>
                          <label className="block font-body text-xs font-700 text-teal-950/60 uppercase tracking-wider mb-1.5">
                            NID / Passport
                          </label>
                          <input type="text"
                            className="input-field text-sm py-2.5"
                            placeholder="ID number"
                            value={p.nid}
                            onChange={(e) => updatePassenger(i, "nid", e.target.value)}
                          />
                        </div>
                        {i === 0 && (
                          <>
                            <div>
                              <label className="block font-body text-xs font-700 text-teal-950/60 uppercase tracking-wider mb-1.5">
                                Email
                              </label>
                              <div className="relative">
                                <FaEnvelope className="absolute left-3 top-1/2 -translate-y-1/2 text-teal-700" size={13} />
                                <input type="email"
                                  className="input-field pl-9 text-sm py-2.5"
                                  placeholder="Email address"
                                  value={p.email}
                                  onChange={(e) => updatePassenger(i, "email", e.target.value)}
                                />
                              </div>
                            </div>
                            <div>
                              <label className="block font-body text-xs font-700 text-teal-950/60 uppercase tracking-wider mb-1.5">
                                Phone
                              </label>
                              <div className="relative">
                                <FaPhone className="absolute left-3 top-1/2 -translate-y-1/2 text-teal-700" size={13} />
                                <input type="tel"
                                  className="input-field pl-9 text-sm py-2.5"
                                  placeholder="01XXXXXXXXX"
                                  value={p.phone}
                                  onChange={(e) => updatePassenger(i, "phone", e.target.value)}
                                />
                              </div>
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Step 2: Payment */}
            {step === 2 && (
              <div className="card p-6 animate-fade-in">
                <h2 className="font-display text-2xl font-700 text-teal-950 mb-5">
                  Payment Method
                </h2>

                <div className="space-y-3 mb-6">
                  {PAYMENT_METHODS.map(({ value, label, color }) => (
                    <label
                      key={value}
                      className={`flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer 
                                  transition-all duration-150
                                  ${paymentMethod === value
                                    ? "border-teal-950 bg-teal-950/5"
                                    : "border-cream-dark bg-white hover:border-teal-950/30"}`}
                    >
                      <input
                        type="radio"
                        name="payment"
                        value={value}
                        checked={paymentMethod === value}
                        onChange={() => setPaymentMethod(value)}
                        className="accent-teal-950"
                      />
                      <div className="w-10 h-10 rounded-lg flex items-center justify-center"
                        style={{ backgroundColor: color + "15" }}>
                        <FaCreditCard style={{ color }} size={18} />
                      </div>
                      <span className="font-body text-sm font-700 text-navy-900">{label}</span>
                      {paymentMethod === value && (
                        <FaCheckCircle className="ml-auto text-teal-700" size={16} />
                      )}
                    </label>
                  ))}
                </div>

                {/* Card Details */}
                {paymentMethod === "card" && (
                  <div className="bg-cream rounded-xl p-5 space-y-4 border border-teal-950/10">
                    <h3 className="font-display text-lg font-600 text-teal-950">Card Details</h3>
                    <div>
                      <label className="block font-body text-xs font-700 text-teal-950/60 uppercase tracking-wider mb-1.5">Card Holder</label>
                      <input type="text" className="input-field text-sm py-2.5"
                        placeholder="Name on card"
                        value={cardDetails.holder}
                        onChange={(e) => setCardDetails({ ...cardDetails, holder: e.target.value })}
                      />
                    </div>
                    <div>
                      <label className="block font-body text-xs font-700 text-teal-950/60 uppercase tracking-wider mb-1.5">Card Number</label>
                      <div className="relative">
                        <FaCreditCard className="absolute left-3 top-1/2 -translate-y-1/2 text-teal-700" size={14} />
                        <input type="text" className="input-field pl-9 text-sm py-2.5"
                          placeholder="0000 0000 0000 0000"
                          maxLength={19}
                          value={cardDetails.number}
                          onChange={(e) => {
                            const v = e.target.value.replace(/\D/g, "").replace(/(.{4})/g, "$1 ").trim();
                            setCardDetails({ ...cardDetails, number: v });
                          }}
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block font-body text-xs font-700 text-teal-950/60 uppercase tracking-wider mb-1.5">Expiry</label>
                        <input type="text" className="input-field text-sm py-2.5"
                          placeholder="MM/YY"
                          maxLength={5}
                          value={cardDetails.expiry}
                          onChange={(e) => setCardDetails({ ...cardDetails, expiry: e.target.value })}
                        />
                      </div>
                      <div>
                        <label className="block font-body text-xs font-700 text-teal-950/60 uppercase tracking-wider mb-1.5">CVV</label>
                        <div className="relative">
                          <FaLock className="absolute left-3 top-1/2 -translate-y-1/2 text-teal-700" size={12} />
                          <input type="password" className="input-field pl-9 text-sm py-2.5"
                            placeholder="•••"
                            maxLength={4}
                            value={cardDetails.cvv}
                            onChange={(e) => setCardDetails({ ...cardDetails, cvv: e.target.value })}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Terms */}
                <div className="flex items-start gap-3 mt-5">
                  <input type="checkbox" id="agree"
                    checked={agreed} onChange={(e) => setAgreed(e.target.checked)}
                    className="mt-0.5 accent-teal-950 w-4 h-4" />
                  <label htmlFor="agree" className="font-body text-sm text-teal-950/70 leading-relaxed cursor-pointer">
                    I agree to the <a href="#" className="text-teal-700 hover:underline">Terms of Service</a> and <a href="#" className="text-teal-700 hover:underline">Cancellation Policy</a>.
                    I confirm all passenger information is accurate.
                  </label>
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex items-center justify-between">
              <button
                onClick={() => step > 0 ? setStep(step - 1) : navigate(-1)}
                className="btn-outline px-6 py-3 text-sm"
              >
                {step === 0 ? "← Back to Results" : "← Previous"}
              </button>
              {step < STEPS.length - 1 ? (
                <button onClick={handleNext} className="btn-primary px-8 py-3 text-sm">
                  Continue →
                </button>
              ) : (
                <button
                  onClick={handleSubmit}
                  disabled={loading || !agreed}
                  className="bg-gold-500 hover:bg-gold-400 disabled:bg-gold-500/50 text-navy-900 
                             font-body font-800 px-8 py-3 rounded-xl transition-all duration-200 
                             active:scale-95 shadow-gold flex items-center gap-2 text-sm"
                >
                  {loading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-navy-900/30 border-t-navy-900 rounded-full animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>Confirm & Pay {formatPrice(total)}</>
                  )}
                </button>
              )}
            </div>
          </div>

          {/* ── Order Summary Sidebar ────────────────────────────────────────── */}
          <div className="lg:col-span-1">
            <div className="card p-5 sticky top-20">
              <h3 className="font-display text-xl font-700 text-teal-950 mb-4">Order Summary</h3>

              {bookingType === "transport" ? (
                <div className="bg-cream rounded-xl p-4 mb-4">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="font-body text-xs text-teal-950/50 uppercase tracking-wider capitalize">{item.type}</span>
                  </div>
                  <p className="font-display text-lg font-600 text-teal-950">{item.operator}</p>
                  <p className="font-body text-sm text-navy-900 mt-1">
                    {item.from} → {item.to}
                  </p>
                  <p className="font-body text-xs text-teal-950/60 mt-1">
                    {formatBookingDate(sp.date)} · {formatTime(item.departureTime)} – {formatTime(item.arrivalTime)}
                  </p>
                  {selectedSeats.length > 0 && (
                    <p className="font-body text-xs text-teal-700 mt-2">
                      Seats: {selectedSeats.map((s) => s.number).join(", ")}
                    </p>
                  )}
                </div>
              ) : (
                <div className="bg-cream rounded-xl p-4 mb-4">
                  <p className="font-display text-lg font-600 text-teal-950">{item.name}</p>
                  <p className="font-body text-sm text-teal-950/60 mt-1">{item.location}</p>
                </div>
              )}

              {/* Price Breakdown */}
              <div className="space-y-3 mb-4">
                <div className="flex justify-between">
                  <span className="font-body text-sm text-teal-950/60">
                    {bookingType === "hotel"
                      ? `${formatPrice(item.pricePerNight)}/night`
                      : `${formatPrice(item.price)} × ${sp.passengers || 1}`}
                  </span>
                  <span className="font-body text-sm font-700 text-navy-900">
                    {formatPrice(subtotal)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="font-body text-sm text-teal-950/60">Taxes & Fees (7.5%)</span>
                  <span className="font-body text-sm font-700 text-navy-900">
                    {formatPrice(tax)}
                  </span>
                </div>
                <div className="border-t border-cream-dark pt-3 flex justify-between">
                  <span className="font-body text-base font-800 text-teal-950">Total</span>
                  <span className="font-display text-2xl font-700 text-teal-950">
                    {formatPrice(total)}
                  </span>
                </div>
              </div>

              {/* Security note */}
              <div className="flex items-center gap-2 bg-cream rounded-lg p-3">
                <FaLock size={12} className="text-teal-700 flex-shrink-0" />
                <p className="font-body text-xs text-teal-950/60">
                  Payments are encrypted and secure.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}