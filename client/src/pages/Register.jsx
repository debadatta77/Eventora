import React, { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import { useNavigate, Link } from "react-router-dom";
import { FaUser, FaEnvelope, FaLock, FaKey, FaArrowLeft } from "react-icons/fa";

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [showOTP, setShowOTP] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { register, verifyOtp } = useContext(AuthContext);
  const toast = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      if (!showOTP) {
        await register(name, email, password);
        setShowOTP(true);
        setError("");
        toast.success("Account created! Verification OTP sent.");
      } else {
        await verifyOtp(email, otp);
        toast.success("Verification successful! Welcome to Eventora.");
        navigate("/dashboard");
      }
    } catch (err) {
      const errMsg = err.response?.data?.error || err.message || err;
      setError(errMsg);
      toast.error(errMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto bg-white rounded-3xl shadow-xl overflow-hidden mt-8 grid grid-cols-1 md:grid-cols-12 min-h-[600px] border border-gray-100">
      
      {/* Visual Side Banner (hidden on mobile) */}
      <div className="hidden md:flex md:col-span-5 relative bg-black text-white p-12 flex-col justify-between overflow-hidden">
        <div className="absolute inset-0 opacity-55 bg-[url('https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=1200&auto=format&fit=crop')] bg-cover bg-center"></div>
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-900/90 to-transparent"></div>
        
        <div className="relative z-10">
          <Link to="/" className="flex items-center gap-2 text-xl font-black text-white mb-8">
            🎟️ Eventora
          </Link>
          <h2 className="text-3xl font-black leading-tight tracking-tight mb-4">
            Join the <br />
            Global <br />
            Community.
          </h2>
          <p className="text-gray-300 text-sm leading-relaxed max-w-[240px]">
            Create an account to browse local experiences, save your favorite events, and secure tickets with 2FA protection.
          </p>
        </div>

        <div className="relative z-10 text-xs text-gray-400 font-medium uppercase tracking-wider">
          &copy; {new Date().getFullYear()} Eventora Platform.
        </div>
      </div>

      {/* Main Authentication Form Column */}
      <div className="col-span-1 md:col-span-7 p-8 sm:p-12 md:p-16 flex flex-col justify-center bg-white relative">
        {/* Back Link */}
        <Link
          to="/"
          className="absolute top-8 left-8 sm:left-12 md:left-16 flex items-center gap-2 text-xs font-bold text-gray-500 hover:text-black transition"
        >
          <FaArrowLeft /> Back to home
        </Link>

        <div className="mb-8 mt-4">
          <h2 className="text-3xl font-black text-gray-900 mb-2">Create an Account</h2>
          <p className="text-gray-500 text-sm font-medium">
            {showOTP
              ? "Verify the 6-digit code sent to your inbox"
              : "Get started with your free Eventora account"}
          </p>
        </div>

        {error && (
          <div className="bg-red-50 text-red-700 p-3.5 rounded-xl mb-6 text-center text-xs font-semibold border border-red-100 animate-slideIn animate-pulse-slow">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {!showOTP ? (
            <>
              {/* Full Name */}
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                  Full Name
                </label>
                <div className="relative flex items-center">
                  <FaUser className="absolute left-4 text-gray-400 text-sm" />
                  <input
                    type="text"
                    required
                    placeholder="John Doe"
                    className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-gray-700 outline-none transition text-sm bg-gray-50/50 focus:bg-white"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
              </div>

              {/* Email Address */}
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                  Email Address
                </label>
                <div className="relative flex items-center">
                  <FaEnvelope className="absolute left-4 text-gray-400 text-sm" />
                  <input
                    type="email"
                    required
                    placeholder="name@example.com"
                    className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-gray-700 outline-none transition text-sm bg-gray-50/50 focus:bg-white"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                  Password
                </label>
                <div className="relative flex items-center">
                  <FaLock className="absolute left-4 text-gray-400 text-sm" />
                  <input
                    type="password"
                    required
                    placeholder="••••••••"
                    className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-gray-700 outline-none transition text-sm bg-gray-50/50 focus:bg-white"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
              </div>
            </>
          ) : (
            /* OTP Field */
            <div className="animate-slideIn">
              <p className="text-xs text-emerald-800 bg-emerald-50 p-3 mb-5 rounded-xl border border-emerald-100 font-semibold leading-relaxed">
                An OTP has been successfully dispatched to your email. Please enter it below to complete registration.
              </p>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                Verification Code (OTP)
              </label>
              <div className="relative flex items-center">
                <FaKey className="absolute left-4 text-gray-400 text-sm" />
                <input
                  type="text"
                  required
                  placeholder="6-digit code"
                  className="w-full pl-12 pr-4 py-3.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-gray-700 outline-none transition text-sm font-black tracking-widest text-center text-lg bg-gray-50/50 focus:bg-white"
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
            className="w-full bg-gray-900 hover:bg-black text-white font-bold py-4 rounded-xl transition shadow-md hover:shadow-lg hover:-translate-y-0.5 duration-200 cursor-pointer text-sm mt-6"
          >
            {loading
              ? "Processing..."
              : showOTP
                ? "Verify & Register"
                : "Sign Up"}
          </button>
        </form>

        {!showOTP && (
          <p className="text-center mt-6 text-gray-500 text-sm font-medium">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-gray-900 font-extrabold hover:underline"
            >
              Sign in
            </Link>
          </p>
        )}
      </div>

    </div>
  );
};

export default Register;
