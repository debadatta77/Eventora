import React, { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import { useNavigate, Link } from "react-router-dom";
import { FaEnvelope, FaLock, FaKey, FaArrowLeft, FaTicketAlt } from "react-icons/fa";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [showOTP, setShowOTP] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { login, verifyOtp } = useContext(AuthContext);
  const toast = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      if (!showOTP) {
        const data = await login(email, password);
        toast.success("Welcome back!");
        if (data.role === "admin") navigate("/admin");
        else navigate("/dashboard");
      } else {
        const data = await verifyOtp(email, otp);
        toast.success("Verification successful! Logging in...");
        if (data.role === "admin") navigate("/admin");
        else navigate("/dashboard");
      }
    } catch (err) {
      if (err.needsVerification) {
        setShowOTP(true);
        toast.info("Account needs verification. OTP sent!");
        setError("Account not verified. A new OTP has been sent to your email.");
      } else {
        const errMsg = err.response?.data?.error || err.message || err;
        setError(errMsg);
        toast.error(errMsg);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-[calc(100vh-100px)] flex items-center justify-center p-4 overflow-hidden">
      {/* Decorative Glow Blobs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl -z-10 animate-pulse duration-[6000ms]" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl -z-10 animate-pulse duration-[8000ms]" />

      <div className="w-full max-w-5xl bg-slate-900/60 backdrop-blur-xl border border-slate-800/80 rounded-3xl shadow-2xl overflow-hidden grid grid-cols-1 md:grid-cols-12 min-h-[600px] transform transition duration-300">
        
        {/* Visual Side Banner (hidden on mobile) */}
        <div className="hidden md:flex md:col-span-5 relative bg-slate-950 p-12 flex-col justify-between overflow-hidden border-r border-slate-850">
          <div className="absolute inset-0 opacity-40 bg-[url('https://images.unsplash.com/photo-1501386761578-eac5c94b800a?q=80&w=1200&auto=format&fit=crop')] bg-cover bg-center"></div>
          <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-slate-950/90 to-transparent"></div>
          
          <div className="relative z-10">
            <Link to="/" className="flex items-center gap-2.5 text-2xl font-black text-white mb-8 hover:scale-[1.02] active:scale-[0.98] transition-all">
              <FaTicketAlt className="text-emerald-400 rotate-[-10deg]" /> Eventora
            </Link>
            <h2 className="text-4xl font-black leading-tight tracking-tight mb-4 text-white">
              Discover <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-300">
                Unforgettable
              </span> <br />
              Experiences.
            </h2>
            <p className="text-slate-400 text-sm leading-relaxed max-w-[260px] font-medium">
              Log in to manage your tickets, coordinate with hosts, and secure seats at local conferences, concerts, and workshops.
            </p>
          </div>

          <div className="relative z-10 text-xs text-slate-500 font-bold uppercase tracking-wider">
            &copy; {new Date().getFullYear()} Eventora Platform.
          </div>
        </div>

        {/* Main Authentication Form Column */}
        <div className="col-span-1 md:col-span-7 p-8 sm:p-12 md:p-16 flex flex-col justify-center bg-transparent relative">
          {/* Back Link */}
          <Link
            to="/"
            className="absolute top-8 left-8 sm:left-12 md:left-16 flex items-center gap-2 text-xs font-bold text-slate-400 hover:text-white transition"
          >
            <FaArrowLeft /> Back to home
          </Link>

          <div className="mb-8 mt-4">
            <h2 className="text-3xl font-black text-white mb-2">Welcome Back</h2>
            <p className="text-slate-400 text-sm font-medium">
              {showOTP
                ? "Verify the 6-digit code sent to your inbox"
                : "Sign in to access your Eventora account"}
            </p>
          </div>

          {error && (
            <div className="bg-rose-500/10 text-rose-400 p-3.5 rounded-xl mb-6 text-center text-xs font-semibold border border-rose-500/20 animate-shake">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {!showOTP ? (
              <>
                {/* Email Address */}
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                    Email Address
                  </label>
                  <div className="relative flex items-center">
                    <FaEnvelope className="absolute left-4 text-slate-500 text-sm" />
                    <input
                      type="email"
                      required
                      placeholder="name@example.com"
                      className="w-full pl-12 pr-4 py-3.5 rounded-xl border border-slate-800 bg-slate-950/50 text-white placeholder-slate-500 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/20 outline-none transition text-sm focus:bg-slate-950"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                </div>

                {/* Password */}
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider">
                      Password
                    </label>
                  </div>
                  <div className="relative flex items-center">
                    <FaLock className="absolute left-4 text-slate-500 text-sm" />
                    <input
                      type="password"
                      required
                      placeholder="••••••••"
                      className="w-full pl-12 pr-4 py-3.5 rounded-xl border border-slate-800 bg-slate-950/50 text-white placeholder-slate-500 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/20 outline-none transition text-sm focus:bg-slate-950"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </div>
                </div>
              </>
            ) : (
              /* OTP Field */
              <div className="animate-slideIn">
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                  Verification Code (OTP)
                </label>
                <div className="relative flex items-center">
                  <FaKey className="absolute left-4 text-slate-500 text-sm" />
                  <input
                    type="text"
                    required
                    placeholder="6-digit code"
                    className="w-full pl-12 pr-4 py-3.5 rounded-xl border border-slate-800 bg-slate-950/50 text-white placeholder-slate-500 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/20 outline-none transition text-sm font-black tracking-widest text-center text-lg focus:bg-slate-950"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    maxLength="6"
                  />
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white font-bold py-4 rounded-xl transition shadow-lg shadow-emerald-500/10 hover:shadow-emerald-500/20 hover:-translate-y-0.5 duration-200 cursor-pointer text-sm mt-6 flex items-center justify-center gap-2"
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : showOTP ? (
                "Verify OTP & Log In"
              ) : (
                "Sign In"
              )}
            </button>
          </form>

          <p className="text-center mt-8 text-slate-400 text-sm font-medium">
            Don't have an account?{" "}
            <Link
              to="/register"
              className="text-emerald-400 font-extrabold hover:underline"
            >
              Sign up
            </Link>
          </p>
        </div>

      </div>
    </div>
  );
};

export default Login;
