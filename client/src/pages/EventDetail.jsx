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
      <div className="text-center py-20 text-xl font-semibold">Loading...</div>
    );
  if (error && !event)
    return (
      <div className="text-center py-20 text-xl text-red-500">
        {error || "Event not found"}
      </div>
    );

  const isSoldOut = event.availableSeats <= 0;

  return (
    <div className="max-w-4xl mx-auto px-4 mt-6">
      {/* Back Button */}
      <button
        onClick={() => navigate("/")}
        className="flex items-center gap-2 text-gray-600 hover:text-black font-semibold mb-6 transition duration-200 group focus:outline-none cursor-pointer"
      >
        <span className="group-hover:-translate-x-1 transition-transform">&larr;</span> Back to Events
      </button>

      <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
        {event.imageUrl || event.image ? (
          <div className="h-96 relative overflow-hidden group">
            <img
              src={event.imageUrl || event.image}
              alt={event.title}
              className="w-full h-full object-cover group-hover:scale-[1.01] transition duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
          </div>
        ) : (
          <div className="w-full h-64 bg-gray-900 flex items-center justify-center text-white/50 text-6xl font-black uppercase tracking-widest">
            {event.category}
          </div>
        )}

        <div className="p-8 md:p-12">
          <div className="flex flex-col lg:flex-row justify-between items-start gap-12">
            
            {/* Left Column: Title & Description */}
            <div className="flex-grow max-w-xl">
              <div className="inline-block bg-gray-100 text-gray-800 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide mb-4 border border-gray-205">
                {event.category}
              </div>
              <h1 className="text-4xl md:text-5xl font-black text-gray-900 mb-6 leading-tight">
                {event.title}
              </h1>
              <div className="border-t border-gray-100 pt-6">
                <h3 className="text-lg font-bold text-gray-800 mb-3">About this Event</h3>
                <p className="text-gray-600 text-md leading-relaxed whitespace-pre-line">
                  {event.description}
                </p>
              </div>
            </div>

            {/* Right Column: Booking Details Card */}
            <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100 min-w-[320px] w-full lg:w-auto shrink-0 shadow-sm flex flex-col justify-between">
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-6 pb-3 border-b border-gray-200/60">
                  Booking Details
                </h3>

                <div className="space-y-5 mb-8">
                  {/* Ticket Price */}
                  <div className="flex items-center gap-4 text-gray-600">
                    <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-gray-900 shrink-0 border border-gray-100 shadow-sm animate-pulse-slow">
                      <FaMoneyBillWave className="text-gray-700" />
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                        Ticket Price
                      </p>
                      <p className="font-extrabold text-gray-950 text-lg mt-0.5">
                        {event.ticketPrice === 0 ? (
                          <span className="text-emerald-600 font-bold">FREE ENTRY</span>
                        ) : (
                          `₹${event.ticketPrice}`
                        )}
                      </p>
                    </div>
                  </div>

                  {/* Availability */}
                  <div className="flex items-center gap-4 text-gray-600">
                    <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-gray-900 shrink-0 border border-gray-100 shadow-sm">
                      <FaChair className="text-gray-700" />
                    </div>
                    <div className="flex-grow">
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                        Availability
                      </p>
                      <p className="font-extrabold text-gray-950 mt-0.5">
                        <span className={event.availableSeats < 10 ? "text-orange-600 animate-pulse" : "text-gray-800"}>
                          {event.availableSeats}
                        </span>{" "}
                        / <span className="text-gray-500 font-medium">{event.totalSeats} seats</span>
                      </p>
                    </div>
                  </div>

                  {/* Date */}
                  <div className="flex items-center gap-4 text-gray-600">
                    <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-gray-900 shrink-0 border border-gray-100 shadow-sm">
                      <FaCalendarAlt className="text-gray-700" />
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                        Date & Time
                      </p>
                      <p className="font-extrabold text-gray-850 mt-0.5">
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
                  <div className="flex items-center gap-4 text-gray-600">
                    <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-gray-900 shrink-0 border border-gray-100 shadow-sm">
                      <FaMapMarkerAlt className="text-gray-700" />
                    </div>
                    <div className="flex-grow min-w-0">
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                        Location
                      </p>
                      <a
                        href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(event.location)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-extrabold text-gray-800 hover:text-black hover:underline block mt-0.5 truncate max-w-[200px]"
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
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                    Enter OTP Sent to Email
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="6-digit code"
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-gray-700 outline-none transition shadow-sm font-black tracking-widest text-center text-lg bg-white"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    maxLength="6"
                  />
                </div>
              )}

              <button
                onClick={handleBooking}
                disabled={isSoldOut || bookingLoading || (showOTP && !otp)}
                className={`w-full py-4 px-6 rounded-xl font-bold text-md transition shadow-md duration-200 cursor-pointer ${
                  isSoldOut || (successMsg && !showOTP)
                    ? "bg-gray-250 text-gray-400 cursor-not-allowed shadow-none"
                    : "bg-gray-900 hover:bg-black text-white hover:shadow-lg hover:-translate-y-0.5"
                }`}
              >
                {bookingLoading
                  ? "Processing..."
                  : showOTP
                    ? "Verify OTP & Confirm"
                    : successMsg && !showOTP
                      ? "Request Sent"
                      : isSoldOut
                        ? "Sold Out"
                        : "Confirm Registration"}
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
                  className="w-full text-center mt-3 text-xs font-bold text-gray-500 hover:text-black hover:bg-gray-100 border border-gray-200/80 bg-white py-2.5 rounded-xl transition duration-200 focus:outline-none"
                >
                  📅 Add to Google Calendar
                </a>
              )}

              {error && (
                <p className="text-red-600 mt-4 text-center text-xs font-bold bg-red-50 p-2.5 rounded-lg border border-red-100">
                  {error}
                </p>
              )}
              {successMsg && (
                <p className="text-emerald-700 mt-4 text-center text-xs font-bold bg-emerald-50 p-2.5 rounded-lg border border-emerald-100">
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
