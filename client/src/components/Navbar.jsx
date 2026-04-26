import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { FaBars, FaTimes, FaUserCircle, FaSignOutAlt, FaTachometerAlt } from "react-icons/fa";
import { useAuth } from "../App";
import toast from "react-hot-toast";

export default function Navbar() {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const isLanding = location.pathname === "/";

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleLogout = () => {
    logout();
    toast.success("Logged out successfully");
    navigate("/");
    setProfileOpen(false);
  };

  const navBase = isLanding && !scrolled
    ? "bg-transparent"
    : "bg-navy-900 shadow-lg";

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${navBase}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 bg-gold-500 rounded-lg flex items-center justify-center shadow-gold">
              <span className="font-display font-700 text-navy-900 text-sm">OR</span>
            </div>
            <span className="font-display text-xl font-600 text-white tracking-wide">
              One<span className="text-gold-400">Reserve</span>
            </span>
          </Link>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center gap-6">
            <Link
              to="/search"
              className="font-body text-sm text-white/80 hover:text-gold-400 transition-colors duration-200"
            >
              Search Trips
            </Link>
            {isAuthenticated && (
              <Link
                to="/dashboard"
                className="font-body text-sm text-white/80 hover:text-gold-400 transition-colors duration-200"
              >
                My Bookings
              </Link>
            )}

            {/* Auth */}
            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setProfileOpen(!profileOpen)}
                  className="flex items-center gap-2 bg-white/10 hover:bg-white/20 
                             rounded-full px-3 py-1.5 transition-all duration-200"
                >
                  <FaUserCircle className="text-gold-400 text-lg" />
                  <span className="font-body text-sm text-white font-500">
                    {user?.name?.split(" ")[0]}
                  </span>
                </button>

                {profileOpen && (
                  <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-xl shadow-card-hover overflow-hidden">
                    <div className="px-4 py-3 border-b border-cream-dark">
                      <p className="font-body text-xs text-teal-950/60">Signed in as</p>
                      <p className="font-body text-sm font-600 text-teal-950 truncate">{user?.email}</p>
                    </div>
                    <Link
                      to="/dashboard"
                      onClick={() => setProfileOpen(false)}
                      className="flex items-center gap-2 px-4 py-3 font-body text-sm text-teal-950
                                 hover:bg-cream transition-colors duration-150"
                    >
                      <FaTachometerAlt className="text-teal-700" />
                      Dashboard
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2 px-4 py-3 font-body text-sm text-red-600
                                 hover:bg-red-50 transition-colors duration-150"
                    >
                      <FaSignOutAlt />
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link
                  to="/login"
                  className="font-body text-sm text-white/80 hover:text-gold-400 transition-colors duration-200"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="bg-gold-500 hover:bg-gold-400 text-navy-900 font-body text-sm 
                             font-700 px-4 py-2 rounded-lg transition-all duration-200 shadow-gold"
                >
                  Get Started
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <button
            className="md:hidden text-white p-2"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <FaTimes size={20} /> : <FaBars size={20} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <div className="md:hidden bg-navy-900 border-t border-white/10 py-4 space-y-1 animate-fade-in">
            <Link to="/search" onClick={() => setMenuOpen(false)}
              className="block px-4 py-3 font-body text-sm text-white/80 hover:text-gold-400 hover:bg-white/5 rounded-lg transition-colors">
              Search Trips
            </Link>
            {isAuthenticated ? (
              <>
                <Link to="/dashboard" onClick={() => setMenuOpen(false)}
                  className="block px-4 py-3 font-body text-sm text-white/80 hover:text-gold-400 hover:bg-white/5 rounded-lg transition-colors">
                  My Bookings
                </Link>
                <button onClick={handleLogout}
                  className="w-full text-left px-4 py-3 font-body text-sm text-red-400 hover:bg-white/5 rounded-lg transition-colors">
                  Sign Out
                </button>
              </>
            ) : (
              <>
                <Link to="/login" onClick={() => setMenuOpen(false)}
                  className="block px-4 py-3 font-body text-sm text-white/80 hover:text-gold-400 hover:bg-white/5 rounded-lg transition-colors">
                  Sign In
                </Link>
                <Link to="/register" onClick={() => setMenuOpen(false)}
                  className="block mx-4 my-2 text-center bg-gold-500 text-navy-900 font-body text-sm font-700 px-4 py-2.5 rounded-lg">
                  Get Started
                </Link>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}