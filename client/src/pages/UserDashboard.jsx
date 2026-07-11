import React, { useState, useEffect, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import api from "../utils/axios";
import { Link, useNavigate } from "react-router-dom";
import { FaTicketAlt, FaTimesCircle, FaCalendarAlt, FaMapMarkerAlt, FaTicketAlt as FaPassIcon } from "react-icons/fa";

const UserDashboard = () => {
  const { user } = useContext(AuthContext);
  const toast = useToast();
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }
    fetchBookings();
  }, [user, navigate]);

  const fetchBookings = async () => {
    try {
      const { data } = await api.get("/bookings");
      setBookings(data);
    } catch (error) {
      console.error("Error fetching bookings", error);
    } finally {
      setLoading(false);
    }
  };

  const cancelBooking = async (id) => {
    if (
      window.confirm("Are you sure you want to cancel this booking request?")
    ) {
      try {
        await api.delete(`/bookings/${id}`);
        toast.success("Booking request cancelled successfully.");
        fetchBookings();
      } catch (error) {
        toast.error(error.response?.data?.message || "Error cancelling booking");
      }
    }
  };

  if (loading)
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center transition-colors duration-300">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-4 border-emerald-500/20 border-t-emerald-500 dark:border-t-emerald-400 rounded-full animate-spin" />
          <span className="text-slate-500 dark:text-slate-400 text-sm font-semibold">Loading dashboard...</span>
        </div>
      </div>
    );

  return (
    <div className="max-w-6xl mx-auto px-4 mt-6">
      
      {/* Welcome Hero Card */}
      <div className="bg-white/80 dark:bg-slate-900/60 backdrop-blur-xl rounded-3xl p-6 sm:p-8 mb-8 border border-slate-200/80 dark:border-slate-800/80 flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left gap-4 sm:gap-6 relative overflow-hidden shadow-xl dark:shadow-2xl transition-colors duration-300">
        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 rounded-full blur-3xl -z-10 animate-pulse duration-[8000ms]" />
        
        {/* Glowing Profile Avatar Circle */}
        <div className="relative group">
          <div className="w-20 h-20 bg-gradient-to-tr from-emerald-400 to-teal-600 text-white rounded-full flex items-center justify-center text-3xl font-black shadow-xl border-2 border-emerald-450/20 group-hover:scale-102 transition duration-300 select-none uppercase">
            {user?.name ? user.name.charAt(0) : "U"}
          </div>
          <div className="absolute -inset-1 rounded-full bg-gradient-to-tr from-emerald-400 to-teal-600 opacity-20 blur-sm -z-10" />
        </div>

        <div className="flex flex-col items-center sm:items-start justify-center">
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white mb-2 tracking-tight">
            Welcome, <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 to-teal-600 dark:from-emerald-400 dark:to-teal-300">{user?.name}</span>!
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm font-bold flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 dark:bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.5)]"></span> User Account Dashboard
          </p>
        </div>
      </div>

      <div className="flex items-center justify-between mb-8 px-1">
        <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2 sm:gap-3">
          <FaTicketAlt className="text-emerald-500 dark:text-emerald-400 rotate-[-10deg]" /> My Booking Requests
        </h2>
      </div>

      {bookings.length === 0 ? (
        <div className="bg-white/80 dark:bg-slate-900/40 backdrop-blur-md rounded-2xl p-12 text-center border border-slate-200/80 dark:border-slate-850 shadow-xl transition-colors duration-300">
          <div className="w-20 h-20 bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800/80 rounded-full flex items-center justify-center mx-auto mb-4 text-emerald-500 dark:text-emerald-400 text-3xl">
            <FaTicketAlt />
          </div>
          <p className="text-xl text-slate-600 dark:text-slate-400 mb-6 mt-4 font-semibold">
            You haven't booked any events yet.
          </p>
          <Link
            to="/"
            className="inline-block bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white font-bold py-3 px-8 rounded-xl transition shadow-lg shadow-emerald-500/10 hover:shadow-emerald-500/20"
          >
            Browse Events
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {bookings.map((booking) => (
            <div
              key={booking._id}
              className="bg-white/85 dark:bg-slate-900/50 backdrop-blur-sm rounded-2xl overflow-hidden border border-slate-200/80 dark:border-slate-850 hover:border-slate-300 dark:hover:border-slate-800 shadow-md hover:shadow-lg transition-all duration-300 flex flex-col relative min-h-[300px]"
            >
              {booking.eventId && booking.status === "confirmed" ? (
                /* Confirmed Event Pass ticket */
                <div className="relative bg-gradient-to-br from-slate-950 via-slate-950 to-slate-900 text-white p-6 flex flex-col justify-between flex-grow rounded-2xl overflow-hidden select-none border border-slate-800/80 shadow-2xl">
                  {/* Left & Right ticket cutouts - matches parent background (bg-slate-50 in light, bg-slate-950 in dark) */}
                  <div className="absolute -left-2 top-1/2 -translate-y-1/2 w-4 h-8 bg-slate-50 dark:bg-slate-950 rounded-r-full shadow-inner border-r border-slate-800 transition-colors duration-300"></div>
                  <div className="absolute -right-2 top-1/2 -translate-y-1/2 w-4 h-8 bg-slate-50 dark:bg-slate-950 rounded-l-full shadow-inner border-l border-slate-800 transition-colors duration-300"></div>
                  
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="text-[9px] uppercase font-black tracking-widest text-emerald-400">EVENT PASS</span>
                      <h3 className="text-lg font-black leading-tight text-white mt-1 max-w-[185px] truncate">
                        {booking.eventId.title}
                      </h3>
                    </div>
                    <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[9px] font-black px-2 py-1 rounded tracking-wider shadow-sm uppercase">
                      CONFIRMED
                    </div>
                  </div>
                  
                  {/* Styled details grid */}
                  <div className="grid grid-cols-2 gap-y-4 gap-x-2 text-[11px] border-t border-b border-dashed border-slate-800/80 py-4 my-4">
                    <div>
                      <p className="text-slate-500 font-bold uppercase tracking-wider">DATE</p>
                      <p className="font-extrabold text-white mt-0.5">
                        {new Date(booking.eventId.date).toLocaleDateString(undefined, {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </p>
                    </div>
                    <div>
                      <p className="text-slate-500 font-bold uppercase tracking-wider">VENUE</p>
                      <p className="font-extrabold text-white mt-0.5 truncate max-w-[110px]" title={booking.eventId.location}>
                        {booking.eventId.location}
                      </p>
                    </div>
                    <div>
                      <p className="text-slate-500 font-bold uppercase tracking-wider">PASS TYPE</p>
                      <p className="font-extrabold text-emerald-400 mt-0.5">
                        {(booking.amount ?? 0) === 0 ? "FREE ENTRY" : `₹${booking.amount}`}
                      </p>
                    </div>
                    <div>
                      <p className="text-slate-500 font-bold uppercase tracking-wider">TICKET ID</p>
                      <p className="font-mono text-slate-300 mt-0.5 uppercase">
                        #{booking._id.substring(booking._id.length - 8)}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between mt-auto">
                    <div className="flex flex-col">
                      <span className="text-[9px] text-slate-500 font-bold uppercase tracking-wider">HOLDER</span>
                      <span className="text-xs font-black text-white truncate max-w-[120px] mt-0.5">
                        {user?.name}
                      </span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          window.print();
                        }}
                        className="text-[9px] text-slate-400 hover:text-white underline font-bold mt-1 text-left cursor-pointer focus:outline-none"
                      >
                        Print Pass
                      </button>
                    </div>
                    {/* Mock QR Code block */}
                    <div className="bg-white p-1.5 rounded-lg shrink-0 shadow-sm hover:scale-102 transition-all duration-200 cursor-pointer">
                      <svg width="36" height="36" viewBox="0 0 29 29">
                        <path fill="black" d="M0 0h9v9H0zm1 1v7h7V1zm10 0h2v2h-2zm4 0h1v1h-1zm1 0h3v3h-3zm3 0h1v1h-1zm-6 2h1v1h-1zm2 0h1v1h-1zm2 0h1v1h-1zm2 1h1v1h-1zm-4 1h1v2h-1zm3 0h1v1h-1zm-6 1h2v1h-2zm3 0h1v2h-1zm4 0h1v2h-1zm-9 1h1v1h-1zm8 0h1v1h-1zm-7 1h1v2h-1zm4 0h1v1h-1zm-3 1h2v1h-2zm4 0h1v1h-1zm-7 1h2v1h-2zm3 0h1v1h-1zm3 0h1v1h-1zM0 11h9v9H0zm1 1v7h7v-7zm10 0h2v2h-2zm4 0h1v1h-1zm1 0h3v1h-3zm3 0h1v1h-1zm-6 2h1v1h-1zm2 0h1v1h-1zm2 0h1v1h-1zm2 1h1v1h-1zm-4 1h1v2h-1zm3 0h1v1h-1zm-6 1h2v1h-2zm3 0h1v2h-1zm4 0h1v2h-1zm-9 1h1v1h-1zm8 0h1v1h-1zm-7 1h1v2h-1zm4 0h1v1h-1zm-3 1h2v1h-2zm4 0h1v1h-1zm-7 1h2v1h-2zm3 0h1v1h-1zm3 0h1v1h-1z"/>
                      </svg>
                    </div>
                  </div>
                </div>
              ) : (
                /* Regular Card Layout for pending / cancelled / invalid bookings */
                <>
                  <div className="p-6 flex-grow flex flex-col justify-between">
                    {booking.eventId ? (
                      <>
                        <div className="flex justify-between items-start mb-4 gap-2">
                          <h3 className="text-lg font-bold text-slate-800 dark:text-white leading-tight line-clamp-2">
                            {booking.eventId.title}
                          </h3>
                          <div className="flex flex-col gap-1 items-end shrink-0.5 ml-3">
                            <span
                              className={`px-2 py-0.5 text-[9px] font-black rounded uppercase tracking-wider border ${
                                booking.status === "cancelled"
                                  ? "bg-rose-500/10 border-rose-500/20 text-rose-655 dark:text-rose-400"
                                  : "bg-amber-500/10 border-amber-500/20 text-amber-650 dark:text-amber-400"
                              }`}
                            >
                              {booking.status}
                            </span>
                            {booking.status !== "cancelled" && (
                              <span
                                className={`px-2 py-0.5 text-[9px] font-black rounded uppercase tracking-wider border ${
                                  booking.paymentStatus === "paid"
                                    ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-650 dark:text-emerald-400"
                                    : "bg-slate-100 dark:bg-slate-850 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-500"
                                }`}
                              >
                                {booking.paymentStatus.replace("_", " ")}
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="text-slate-600 dark:text-slate-400 space-y-2 mt-auto">
                          <div className="flex items-center gap-2 text-xs">
                            <FaCalendarAlt className="text-emerald-500 dark:text-emerald-400" />
                            <span>{new Date(booking.eventId.date).toLocaleDateString()}</span>
                          </div>
                          <div className="flex items-center gap-2 text-xs">
                            <FaMapMarkerAlt className="text-emerald-500 dark:text-emerald-400" />
                            <span className="truncate max-w-[180px]" title={booking.eventId.location}>
                              {booking.eventId.location}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 text-xs font-bold text-slate-800 dark:text-white">
                            <FaPassIcon className="text-emerald-500 dark:text-emerald-400" />
                            <span>{(booking.amount ?? 0) === 0 ? "Free Entry" : `₹${booking.amount}`}</span>
                          </div>
                        </div>
                      </>
                    ) : (
                      <p className="text-rose-500 dark:text-rose-400 italic text-sm">
                        Event details unavailable (might have been deleted)
                      </p>
                    )}
                  </div>
                  
                  <div className="p-4 bg-slate-50/70 dark:bg-slate-955/70 flex justify-between items-center shrink-0 border-t border-slate-100 dark:border-slate-850 w-full rounded-b-2xl">
                    {booking.eventId && booking.status !== "cancelled" ? (
                      <>
                        <Link
                          to={`/events/${booking.eventId._id}`}
                          className="text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 font-bold text-xs"
                        >
                          View Event
                        </Link>
                        <button
                          onClick={() => cancelBooking(booking._id)}
                          className="text-rose-550 dark:text-rose-400 hover:text-rose-700 dark:hover:text-rose-300 font-bold text-xs transition flex items-center gap-1 cursor-pointer focus:outline-none"
                        >
                          <FaTimesCircle /> Cancel
                        </button>
                      </>
                    ) : (
                      <div className="w-full text-center text-xs text-slate-400 dark:text-slate-500 italic font-bold uppercase tracking-wider py-1">
                        Cancelled
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default UserDashboard;
