import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { FaEnvelope, FaLock, FaEye, FaEyeSlash } from "react-icons/fa";
import { useAuth } from "../App";
import authService from "../services/auth.service";
import toast from "react-hot-toast";

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/dashboard";

  const [form, setForm] = useState({ email: "", password: "" });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const validate = () => {
    const e = {};
    if (!form.email) e.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = "Invalid email address";
    if (!form.password) e.password = "Password is required";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      const { user, token } = await authService.login(form.email, form.password);
      login(user, token);
      toast.success(`Welcome back, ${user.name}!`);
      navigate(from, { replace: true });
    } catch (err) {
      toast.error(err.message || "Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  const inputClass = (field) =>
    `w-full bg-cream border rounded-lg px-4 py-3 pl-11 font-body text-sm text-navy-900 
     placeholder-navy-900/40 focus:outline-none focus:ring-2 transition-all duration-200
     ${errors[field]
       ? "border-red-400 focus:ring-red-400/30"
       : "border-teal-950/20 focus:ring-teal-700/40 focus:border-teal-700"}`;

  return (
    <div className="min-h-screen bg-cream flex">
      {/* Left Panel */}
      <div className="hidden lg:flex lg:w-1/2 bg-navy-900 relative overflow-hidden flex-col justify-between p-12">
        <div className="absolute inset-0">
          <div className="absolute top-10 left-10 w-72 h-72 bg-gold-500/10 rounded-full blur-3xl" />
          <div className="absolute bottom-10 right-10 w-80 h-80 bg-teal-500/10 rounded-full blur-3xl" />
        </div>
        <Link to="/" className="relative flex items-center gap-2">
          <div className="w-8 h-8 bg-gold-500 rounded-lg flex items-center justify-center">
            <span className="font-display font-700 text-navy-900 text-sm">OR</span>
          </div>
          <span className="font-display text-xl font-600 text-white">
            One<span className="text-gold-400">Reserve</span>
          </span>
        </Link>

        <div className="relative">
          <h2 className="font-display text-5xl font-700 text-white leading-tight mb-4">
            Your Journey<br />Starts Here
          </h2>
          <p className="font-body text-white/60 leading-relaxed">
            Book buses, trains, flights, and hotels across Bangladesh — all in one place.
          </p>
          <div className="mt-8 grid grid-cols-2 gap-4">
            {[
              { value: "50K+", label: "Travelers" },
              { value: "200+", label: "Routes" },
              { value: "500+", label: "Hotels" },
              { value: "98%", label: "Satisfied" },
            ].map(({ value, label }) => (
              <div key={label} className="bg-white/5 rounded-xl p-4">
                <p className="font-display text-2xl font-700 text-gold-400">{value}</p>
                <p className="font-body text-xs text-white/50">{label}</p>
              </div>
            ))}
          </div>
        </div>

        <p className="relative font-body text-xs text-white/30">
          © {new Date().getFullYear()} OneReserve · CSE-3102 Group 7
        </p>
      </div>

      {/* Right Panel - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          {/* Mobile Logo */}
          <Link to="/" className="lg:hidden flex items-center gap-2 mb-8">
            <div className="w-8 h-8 bg-gold-500 rounded-lg flex items-center justify-center">
              <span className="font-display font-700 text-navy-900 text-sm">OR</span>
            </div>
            <span className="font-display text-xl font-600 text-teal-950">
              One<span className="text-gold-500">Reserve</span>
            </span>
          </Link>

          <div className="mb-8">
            <h1 className="font-display text-4xl font-700 text-teal-950 mb-2">Welcome back</h1>
            <p className="font-body text-sm text-teal-950/60">
              Sign in to manage your bookings.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email */}
            <div>
              <label className="block font-body text-xs font-700 text-teal-950/60 uppercase tracking-wider mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <FaEnvelope className="absolute left-4 top-1/2 -translate-y-1/2 text-teal-700" size={14} />
                <input
                  type="email"
                  className={inputClass("email")}
                  placeholder="your@email.com"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                />
              </div>
              {errors.email && <p className="font-body text-xs text-red-500 mt-1">{errors.email}</p>}
            </div>

            {/* Password */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="font-body text-xs font-700 text-teal-950/60 uppercase tracking-wider">
                  Password
                </label>
                <a href="#" className="font-body text-xs text-teal-700 hover:text-teal-950 transition-colors">
                  Forgot password?
                </a>
              </div>
              <div className="relative">
                <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-teal-700" size={14} />
                <input
                  type={showPass ? "text" : "password"}
                  className={inputClass("password")}
                  placeholder="Enter your password"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-teal-950/40 hover:text-teal-700"
                >
                  {showPass ? <FaEyeSlash size={14} /> : <FaEye size={14} />}
                </button>
              </div>
              {errors.password && <p className="font-body text-xs text-red-500 mt-1">{errors.password}</p>}
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-teal-950 hover:bg-teal-800 disabled:bg-teal-950/50 
                         text-white font-body font-700 py-3.5 rounded-xl 
                         transition-all duration-200 active:scale-[0.98] mt-2
                         flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Signing in...
                </>
              ) : "Sign In"}
            </button>
          </form>

          <p className="mt-6 text-center font-body text-sm text-teal-950/60">
            Don't have an account?{" "}
            <Link to="/register" className="font-700 text-teal-700 hover:text-teal-950 transition-colors">
              Create one free
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}