import React, { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../utils/axios";
import { AuthContext } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import {
  FaCalendarAlt,
  FaMapMarkerAlt,
  FaChair,
  FaMoneyBillWave,
  FaArrowLeft,
} from "react-icons/fa";

const EventDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const toast = useToast();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [otp, setOtp] = useState("");
  const [showOTP, setShowOTP] = useState(false);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const { data } = await api.get(`/events/${id}`);
        setEvent(data);
      } catch (err) {
        setError("Failed to load event details.");
      } finally {
        setLoading(false);
      }
    };
    fetchEvent();
  }, [id]);

  const handleBooking = async () => {
    if (!user) {
      navigate("/login");
      return;
    }
    setBookingLoading(true);
    setError("");
    setSuccessMsg("");

    try {
      if (!showOTP) {
        await api.post("/bookings/send-otp");
        setShowOTP(true);
        const msg = "OTP sent to your email. Please verify to confirm booking.";
        setSuccessMsg(msg);
        toast.success("OTP sent to your email!");
      } else {
        await api.post("/bookings", { eventId: event._id, otp });
        const msg = "Booking requested! Awaiting admin confirmation.";
        setSuccessMsg(msg);
        toast.success(msg);
        setShowOTP(false);
        // Update local seats count dynamically after booking
        setEvent({ ...event, availableSeats: event.availableSeats - 1 });
      }
    } catch (err) {
      const errMsg = err.response?.data?.message || "Booking failed";
      setError(errMsg);
      toast.error(errMsg);
    } finally {
      setBookingLoading(false);
    }
  };

  if (loading)
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-4 border-emerald-500/20 border-t-emerald-400 rounded-full animate-spin" />
          <span className="text-slate-400 text-sm font-semibold">Loading details...</span>
        </div>
      </div>
    );
  if (error && !event)
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
        <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-8 max-w-md text-center shadow-xl">
          <p className="text-rose-400 text-lg font-bold mb-4">{error || "Event not found"}</p>
          <button
            onClick={() => navigate("/")}
            className="bg-slate-950 border border-slate-800 hover:border-emerald-500/30 text-white font-bold py-2 px-6 rounded-xl text-xs transition duration-200 cursor-pointer"
          >
            Back to Events
          </button>
        </div>
      </div>
    );

  const isSoldOut = event.availableSeats <= 0;

  return (
    <div className="relative max-w-5xl mx-auto px-4 mt-6 mb-16 overflow-hidden">
      {/* Decorative Glow Blob */}
      <div className="absolute top-1/4 right-0 w-80 h-80 bg-emerald-500/5 rounded-full blur-3xl -z-10 animate-pulse duration-[7000ms]" />

      {/* Back Button */}
      <button
        onClick={() => navigate("/")}
        className="flex items-center gap-2 text-slate-400 hover:text-white font-semibold mb-6 transition duration-200 group focus:outline-none cursor-pointer text-sm"
      >
        <FaArrowLeft className="group-hover:-translate-x-1 transition-transform text-xs" /> Back to Events
      </button>

      <div className="bg-slate-900/60 backdrop-blur-xl rounded-3xl shadow-2xl overflow-hidden border border-slate-800/80">
        {event.imageUrl || event.image ? (
          <div className="h-96 relative overflow-hidden group border-b border-slate-800/85">
            <img
              src={event.imageUrl || event.image}
              alt={event.title}
              className="w-full h-full object-cover group-hover:scale-[1.01] transition duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent"></div>
          </div>
        ) : (
          <div className="w-full h-64 bg-slate-950 flex items-center justify-center text-slate-600 border-b border-slate-800/85 text-6xl font-black uppercase tracking-widest select-none">
            {event.category}
          </div>
        )}

        <div className="p-8 md:p-12">
          <div className="flex flex-col lg:flex-row justify-between items-start gap-12">
            
            {/* Left Column: Title & Description */}
            <div className="flex-grow max-w-xl">
              <div className="inline-block bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-bold px-3.5 py-1 rounded-full uppercase tracking-wide mb-4">
                {event.category}
              </div>
              <h1 className="text-4xl md:text-5xl font-black text-white mb-6 leading-tight">
                {event.title}
              </h1>
              <div className="border-t border-slate-800 pt-6">
                <h3 className="text-lg font-bold text-white mb-3">About this Event</h3>
                <p className="text-slate-300 text-md leading-relaxed whitespace-pre-line font-medium">
                  {event.description}
                </p>
              </div>
            </div>

            {/* Right Column: Booking Details Card */}
            <div className="bg-slate-950/70 p-6 rounded-2xl border border-slate-850 min-w-[320px] w-full lg:w-auto shrink-0 shadow-xl flex flex-col justify-between">
              <div>
                <h3 className="text-lg font-bold text-white mb-6 pb-3 border-b border-slate-800">
                  Booking Details
                </h3>

                <div className="space-y-5 mb-8">
                  {/* Ticket Price */}
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center text-emerald-400 shrink-0">
                      <FaMoneyBillWave className="text-sm" />
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                        Ticket Price
                      </p>
                      <p className="font-extrabold text-white text-lg mt-0.5">
                        {event.ticketPrice === 0 ? (
                          <span className="text-emerald-400 font-bold">FREE ENTRY</span>
                        ) : (
                          `₹${event.ticketPrice}`
                        )}
                      </p>
                    </div>
                  </div>

                  {/* Availability */}
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center text-emerald-400 shrink-0">
                      <FaChair className="text-sm" />
                    </div>
                    <div className="flex-grow">
                      <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                        Availability
                      </p>
                      <p className="font-extrabold text-white mt-0.5">
                        <span className={event.availableSeats < 10 ? "text-orange-400 animate-pulse" : "text-white"}>
                          {event.availableSeats}
                        </span>{" "}
                        / <span className="text-slate-400 font-medium">{event.totalSeats} seats</span>
                      </p>
                    </div>
                  </div>

                  {/* Date */}
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center text-emerald-400 shrink-0">
                      <FaCalendarAlt className="text-sm" />
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                        Date & Time
                      </p>
                      <p className="font-extrabold text-white mt-0.5">
                        {new Date(event.date).toLocaleDateString(undefined, {
                          weekday: "short",
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </p>
                    </div>
                  </div>

                  {/* Location */}
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center text-emerald-400 shrink-0">
                      <FaMapMarkerAlt className="text-sm" />
                    </div>
                    <div className="flex-grow min-w-0">
                      <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                        Location
                      </p>
                      <a
                        href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(event.location)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-extrabold text-emerald-400 hover:text-emerald-300 hover:underline block mt-0.5 truncate max-w-[200px]"
                        title="Click to view on Google Maps"
                      >
                        {event.location} &rarr;
                      </a>
                    </div>
                  </div>
                </div>
              </div>

              {showOTP && (
                <div className="mb-5 animate-slideIn">
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                    Enter OTP Sent to Email
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="6-digit code"
                    className="w-full px-4 py-3 rounded-xl border border-slate-800 bg-slate-950 text-white placeholder-slate-600 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/20 outline-none transition shadow-sm font-black tracking-widest text-center text-lg focus:bg-slate-950"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    maxLength="6"
                  />
                </div>
              )}

              <button
                onClick={handleBooking}
                disabled={isSoldOut || bookingLoading || (showOTP && !otp)}
                className={`w-full py-4 px-6 rounded-xl font-bold text-sm transition-all duration-300 cursor-pointer flex items-center justify-center gap-2 ${
                  isSoldOut || (successMsg && !showOTP)
                    ? "bg-slate-850 text-slate-500 cursor-not-allowed shadow-none border border-slate-800"
                    : "bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white shadow-lg shadow-emerald-500/10 hover:shadow-emerald-500/20 hover:-translate-y-0.5"
                }`}
              >
                {bookingLoading ? (
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : showOTP ? (
                  "Verify OTP & Confirm"
                ) : successMsg && !showOTP ? (
                  "Request Sent"
                ) : isSoldOut ? (
                  "Sold Out"
                ) : (
                  "Confirm Registration"
                )}
              </button>

              {/* Add to Google Calendar button (only if not sold out and not pending verification) */}
              {!isSoldOut && !showOTP && (
                <a
                  href={`https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(
                    event.title
                  )}&dates=${new Date(event.date).toISOString().replace(/-|:|\.\d\d\d/g, "")}/${new Date(
                    new Date(event.date).getTime() + 2 * 60 * 60 * 1000
                  )
                    .toISOString()
                    .replace(/-|:|\.\d\d\d/g, "")}&details=${encodeURIComponent(
                    event.description
                  )}&location=${encodeURIComponent(event.location)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full text-center mt-3 text-xs font-bold text-slate-400 hover:text-white hover:bg-slate-900 border border-slate-800 bg-slate-900/40 py-2.5 rounded-xl transition duration-200 focus:outline-none"
                >
                  📅 Add to Google Calendar
                </a>
              )}

              {error && (
                <p className="text-rose-400 mt-4 text-center text-xs font-bold bg-rose-500/10 p-2.5 rounded-lg border border-rose-500/20 animate-shake">
                  {error}
                </p>
              )}
              {successMsg && (
                <p className="text-emerald-400 mt-4 text-center text-xs font-bold bg-emerald-500/10 p-2.5 rounded-lg border border-emerald-500/20">
                  {successMsg}
                </p>
              )}
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default EventDetail;
