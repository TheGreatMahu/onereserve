import React, { createContext, useContext, useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";

import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import SearchPage from "./pages/SearchPage";
import TransportResultsPage from "./pages/TransportResultsPage";
import HotelListingPage from "./pages/HotelListingPage";
import BookingPage from "./pages/BookingPage";
import BookingConfirmationPage from "./pages/BookingConfirmationPage";
import DashboardPage from "./pages/DashboardPage";
import ProtectedRoute from "./components/ProtectedRoute";

// ─── Auth Context ─────────────────────────────────────────────────────────────
export const AuthContext = createContext(null);
export const useAuth = () => useContext(AuthContext);

function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem("or_user");
    const token = localStorage.getItem("or_token");
    if (stored && token) setUser(JSON.parse(stored));
    setLoading(false);
  }, []);

  const login = (userData, token) => {
    localStorage.setItem("or_user", JSON.stringify(userData));
    localStorage.setItem("or_token", token);
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem("or_user");
    localStorage.removeItem("or_token");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
}

// ─── Search Context ───────────────────────────────────────────────────────────
export const SearchContext = createContext(null);
export const useSearch = () => useContext(SearchContext);

function SearchProvider({ children }) {
  const [searchParams, setSearchParams] = useState({
    type: "bus",            // bus | train | flight
    origin: "",
    destination: "",
    date: new Date(),
    passengers: 1,
    returnDate: null,
    tripType: "one-way",
  });

  const [selectedTransport, setSelectedTransport] = useState(null);
  const [selectedHotel, setSelectedHotel] = useState(null);

  return (
    <SearchContext.Provider
      value={{
        searchParams,
        setSearchParams,
        selectedTransport,
        setSelectedTransport,
        selectedHotel,
        setSelectedHotel,
      }}
    >
      {children}
    </SearchContext.Provider>
  );
}

// ─── App ──────────────────────────────────────────────────────────────────────
export default function App() {
  return (
    <AuthProvider>
      <SearchProvider>
        <Router>
          <Toaster
            position="top-right"
            toastOptions={{
              style: {
                fontFamily: "'Nunito', sans-serif",
                borderRadius: "10px",
                background: "#0A1628",
                color: "#F5EFE6",
              },
              success: { iconTheme: { primary: "#C9963A", secondary: "#0A1628" } },
              error: { iconTheme: { primary: "#E07B54", secondary: "#0A1628" } },
            }}
          />
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />

            {/* Search & Booking Routes (available without login for browsing) */}
            <Route path="/search" element={<SearchPage />} />
            <Route path="/results/transport" element={<TransportResultsPage />} />
            <Route path="/results/hotels" element={<HotelListingPage />} />

            {/* Protected Routes */}
            <Route element={<ProtectedRoute />}>
              <Route path="/booking" element={<BookingPage />} />
              <Route path="/booking/confirmation" element={<BookingConfirmationPage />} />
              <Route path="/dashboard" element={<DashboardPage />} />
            </Route>

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Router>
      </SearchProvider>
    </AuthProvider>
  );
}