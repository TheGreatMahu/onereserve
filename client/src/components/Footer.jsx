import React from "react";
import { Link } from "react-router-dom";
import { FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn, FaPhone, FaEnvelope, FaMapMarkerAlt } from "react-icons/fa";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-navy-900 text-white/80 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-gold-500 rounded-lg flex items-center justify-center">
                <span className="font-display font-700 text-navy-900 text-sm">OR</span>
              </div>
              <span className="font-display text-xl font-600 text-white">
                One<span className="text-gold-400">Reserve</span>
              </span>
            </div>
            <p className="font-body text-sm leading-relaxed text-white/60 mb-5">
              Your all-in-one travel companion for booking buses, trains, flights, and hotels across Bangladesh and beyond.
            </p>
            <div className="flex gap-3">
              {[FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn].map((Icon, i) => (
                <a key={i} href="#"
                  className="w-8 h-8 bg-white/10 hover:bg-gold-500 rounded-full flex items-center justify-center 
                             transition-all duration-200 hover:text-navy-900">
                  <Icon size={14} />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-display text-lg font-600 text-white mb-4">Quick Links</h4>
            <ul className="space-y-2.5">
              {[
                { to: "/search", label: "Search Trips" },
                { to: "/search?type=bus", label: "Book Bus" },
                { to: "/search?type=train", label: "Book Train" },
                { to: "/search?type=flight", label: "Book Flight" },
                { to: "/results/hotels", label: "Book Hotels" },
              ].map(({ to, label }) => (
                <li key={to}>
                  <Link to={to}
                    className="font-body text-sm text-white/60 hover:text-gold-400 transition-colors duration-150">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="font-display text-lg font-600 text-white mb-4">Support</h4>
            <ul className="space-y-2.5">
              {[
                "Help Centre",
                "Cancellation Policy",
                "Refund Policy",
                "Terms of Service",
                "Privacy Policy",
              ].map((label) => (
                <li key={label}>
                  <a href="#"
                    className="font-body text-sm text-white/60 hover:text-gold-400 transition-colors duration-150">
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-display text-lg font-600 text-white mb-4">Contact</h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <FaMapMarkerAlt className="text-gold-400 mt-0.5 flex-shrink-0" />
                <span className="font-body text-sm text-white/60">
                  MIST, Mirpur Cantonment, Dhaka-1216, Bangladesh
                </span>
              </li>
              <li className="flex items-center gap-3">
                <FaPhone className="text-gold-400 flex-shrink-0" />
                <span className="font-body text-sm text-white/60">+880 1700-000000</span>
              </li>
              <li className="flex items-center gap-3">
                <FaEnvelope className="text-gold-400 flex-shrink-0" />
                <span className="font-body text-sm text-white/60">support@onereserve.com.bd</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-white/10 pt-8 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="font-body text-xs text-white/40">
            © {year} OneReserve. All rights reserved. Built with ❤️ for Bangladesh.
          </p>
          <p className="font-body text-xs text-white/40">
            CSE-3102 Database Management Systems Laboratory · Group 7
          </p>
        </div>
      </div>
    </footer>
  );
}