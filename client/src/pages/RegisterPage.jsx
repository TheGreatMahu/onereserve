import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaUser, FaEnvelope, FaLock, FaPhone, FaEye, FaEyeSlash, FaCheckCircle } from "react-icons/fa";
import { useAuth } from "../App";
import authService from "../services/auth.service";
import toast from "react-hot-toast";

export default function RegisterPage() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "", email: "", phone: "", password: "", confirmPassword: "",
  });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const set = (field) => (e) => setForm({ ...form, [field]: e.target.value });

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = "Full name is required";
    if (!form.email) e.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = "Invalid email";
    if (form.phone && !/^(\+880|0)1[3-9]\d{8}$/.test(form.phone.replace(/\s/g, "")))
      e.phone = "Enter a valid BD phone number";
    if (!form.password) e.password = "Password is required";
    else if (form.password.length < 8) e.password = "At least 8 characters";
    if (form.password !== form.confirmPassword) e.confirmPassword = "Passwords don't match";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const passwordStrength = () => {
    const p = form.password;
    if (!p) return 0;
    let score = 0;
    if (p.length >= 8) score++;
    if (/[A-Z]/.test(p)) score++;
    if (/[0-9]/.test(p)) score++;
    if (/[^A-Za-z0-9]/.test(p)) score++;
    return score;
  };

  const strengthInfo = [
    { label: "Weak", color: "bg-red-400" },
    { label: "Fair", color: "bg-orange-400" },
    { label: "Good", color: "bg-yellow-400" },
    { label: "Strong", color: "bg-green-400" },
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      const { user, token } = await authService.register({
        name: form.name,
        email: form.email,
        phone: form.phone,
        password: form.password,
      });
      login(user, token);
      toast.success("Account created successfully! Welcome to OneReserve.");
      navigate("/dashboard");
    } catch (err) {
      toast.error(err.message || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const field = (key, label, type, placeholder, Icon, extra = {}) => (
    <div>
      <label className="block font-body text-xs font-700 text-teal-950/60 uppercase tracking-wider mb-1.5">
        {label}
      </label>
      <div className="relative">
        <Icon className="absolute left-4 top-1/2 -translate-y-1/2 text-teal-700" size={14} />
        <input
          type={type}
          className={`w-full bg-cream border rounded-lg px-4 py-3 pl-11 font-body text-sm text-navy-900 
                      placeholder-navy-900/40 focus:outline-none focus:ring-2 transition-all duration-200
                      ${errors[key]
                        ? "border-red-400 focus:ring-red-400/30"
                        : "border-teal-950/20 focus:ring-teal-700/40 focus:border-teal-700"}`}
          placeholder={placeholder}
          value={form[key]}
          onChange={set(key)}
          {...extra}
        />
        {key === "password" && (
          <button type="button" onClick={() => setShowPass(!showPass)}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-teal-950/40 hover:text-teal-700">
            {showPass ? <FaEyeSlash size={14} /> : <FaEye size={14} />}
          </button>
        )}
      </div>
      {errors[key] && <p className="font-body text-xs text-red-500 mt-1">{errors[key]}</p>}
    </div>
  );

  const strength = passwordStrength();

  return (
    <div className="min-h-screen bg-cream flex">
      {/* Left Panel */}
      <div className="hidden lg:flex lg:w-5/12 bg-teal-950 relative overflow-hidden flex-col justify-between p-12">
        <div className="absolute inset-0">
          <div className="absolute top-20 right-0 w-64 h-64 bg-gold-500/10 rounded-full blur-3xl" />
          <div className="absolute bottom-20 left-0 w-80 h-80 bg-teal-500/15 rounded-full blur-3xl" />
        </div>

        <Link to="/" className="relative flex items-center gap-2">
          <div className="w-8 h-8 bg-gold-500 rounded-lg flex items-center justify-center">
            <span className="font-display font-700 text-navy-900 text-sm">OR</span>
          </div>
          <span className="font-display text-xl font-600 text-white">
            One<span className="text-gold-400">Reserve</span>
          </span>
        </Link>

        <div className="relative space-y-5">
          <h2 className="font-display text-4xl font-700 text-white leading-tight">
            Join the Smart<br />Traveler Community
          </h2>
          {[
            "Search and book in seconds",
            "Manage all trips in one dashboard",
            "Real-time seat availability",
            "Instant booking confirmation",
          ].map((item) => (
            <div key={item} className="flex items-center gap-3">
              <FaCheckCircle className="text-gold-400 flex-shrink-0" size={16} />
              <span className="font-body text-sm text-white/70">{item}</span>
            </div>
          ))}
        </div>

        <p className="relative font-body text-xs text-white/30">
          © {new Date().getFullYear()} OneReserve
        </p>
      </div>

      {/* Right Panel */}
      <div className="w-full lg:w-7/12 flex items-center justify-center px-4 py-10">
        <div className="w-full max-w-lg">
          <Link to="/" className="lg:hidden flex items-center gap-2 mb-6">
            <div className="w-8 h-8 bg-gold-500 rounded-lg flex items-center justify-center">
              <span className="font-display font-700 text-navy-900 text-sm">OR</span>
            </div>
            <span className="font-display text-xl font-600 text-teal-950">
              One<span className="text-gold-500">Reserve</span>
            </span>
          </Link>

          <div className="mb-7">
            <h1 className="font-display text-4xl font-700 text-teal-950 mb-2">Create Account</h1>
            <p className="font-body text-sm text-teal-950/60">
              Start your travel journey with OneReserve.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {field("name", "Full Name", "text", "Your full name", FaUser)}
              {field("phone", "Phone (Optional)", "tel", "01XXXXXXXXX", FaPhone)}
            </div>
            {field("email", "Email Address", "email", "your@email.com", FaEnvelope)}
            {field("password", "Password", showPass ? "text" : "password", "Min. 8 characters", FaLock)}

            {/* Password Strength */}
            {form.password && (
              <div>
                <div className="flex gap-1 mb-1">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i}
                      className={`h-1.5 flex-1 rounded-full transition-all duration-300
                                  ${i <= strength ? strengthInfo[strength - 1]?.color : "bg-cream-dark"}`}
                    />
                  ))}
                </div>
                <p className="font-body text-xs text-teal-950/50">
                  Strength: <span className="font-700">{strengthInfo[strength - 1]?.label || "Too weak"}</span>
                </p>
              </div>
            )}

            {field("confirmPassword", "Confirm Password", "password", "Repeat password", FaLock)}

            <div className="flex items-start gap-2 pt-1">
              <input type="checkbox" id="terms" required className="mt-0.5 accent-teal-950" />
              <label htmlFor="terms" className="font-body text-xs text-teal-950/60 leading-relaxed">
                I agree to the{" "}
                <a href="#" className="text-teal-700 hover:underline">Terms of Service</a>
                {" "}and{" "}
                <a href="#" className="text-teal-700 hover:underline">Privacy Policy</a>
              </label>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-teal-950 hover:bg-teal-800 disabled:bg-teal-950/50
                         text-white font-body font-700 py-3.5 rounded-xl 
                         transition-all duration-200 active:scale-[0.98]
                         flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Creating account...
                </>
              ) : "Create Free Account"}
            </button>
          </form>

          <p className="mt-5 text-center font-body text-sm text-teal-950/60">
            Already have an account?{" "}
            <Link to="/login" className="font-700 text-teal-700 hover:text-teal-950 transition-colors">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}