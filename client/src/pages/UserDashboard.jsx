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
      <div className="text-center py-20 text-xl font-semibold">
        Loading dashboard...
      </div>
    );

  return (
    <div className="max-w-6xl mx-auto">
      <div className="bg-white rounded-2xl shadow-sm p-6 sm:p-8 mb-8 border border-gray-100 flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left gap-4 sm:gap-6">
        <div className="w-20 h-20 bg-gray-200 text-gray-900 rounded-full flex items-center justify-center text-3xl font-bold uppercase tracking-widest shrink-0">
          {user?.name.charAt(0)}
        </div>
        <div className="flex flex-col items-center sm:items-start">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mb-2">
            Welcome, {user?.name}!
          </h1>
          <p className="text-gray-500 flex items-center justify-center sm:justify-start gap-2">
            <span className="w-2 h-2 rounded-full bg-green-500"></span> User
            Dashboard
          </p>
        </div>
      </div>

      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-800 flex items-center gap-2 sm:gap-3">
          <FaTicketAlt className="text-gray-700" /> My Bookings requests
        </h2>
      </div>

      {bookings.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm p-12 text-center border border-gray-100">
          <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <FaTicketAlt className="text-gray-300 text-3xl" />
          </div>
          <p className="text-xl text-gray-500 mb-6 mt-4 font-medium">
            You haven't booked any events yet.
          </p>
          <Link
            to="/"
            className="inline-block bg-gray-900 hover:bg-black text-white font-bold py-3 px-8 rounded-lg transition shadow-md"
          >
            Browse Events
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {bookings.map((booking) => (
            <div
              key={booking._id}
              className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition border border-gray-100 flex flex-col relative min-h-[300px]"
            >
              {booking.eventId && booking.status === "confirmed" ? (
                <div className="relative bg-gradient-to-br from-gray-900 to-black text-white p-6 flex flex-col justify-between flex-grow rounded-2xl overflow-hidden select-none border border-black/10">
                  {/* Left & Right ticket cutouts */}
                  <div className="absolute -left-2 top-1/2 -translate-y-1/2 w-4 h-8 bg-gray-50 rounded-r-full shadow-inner border-r border-gray-200"></div>
                  <div className="absolute -right-2 top-1/2 -translate-y-1/2 w-4 h-8 bg-gray-50 rounded-l-full shadow-inner border-l border-gray-200"></div>
                  
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="text-[9px] uppercase font-black tracking-widest text-emerald-400">EVENT PASS</span>
                      <h3 className="text-lg font-black leading-tight text-white mt-1 max-w-[185px] truncate">
                        {booking.eventId.title}
                      </h3>
                    </div>
                    <div className="bg-emerald-500 text-white text-[9px] font-black px-2 py-1 rounded tracking-wider shadow-sm uppercase">
                      CONFIRMED
                    </div>
                  </div>
                  
                  {/* Styled details grid */}
                  <div className="grid grid-cols-2 gap-y-4 gap-x-2 text-[11px] border-t border-b border-dashed border-white/20 py-4 my-4">
                    <div>
                      <p className="text-gray-400 font-bold uppercase tracking-wider">DATE</p>
                      <p className="font-extrabold text-white mt-0.5">
                        {new Date(booking.eventId.date).toLocaleDateString(undefined, {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-400 font-bold uppercase tracking-wider">VENUE</p>
                      <p className="font-extrabold text-white mt-0.5 truncate max-w-[110px]" title={booking.eventId.location}>
                        {booking.eventId.location}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-400 font-bold uppercase tracking-wider">PASS TYPE</p>
                      <p className="font-extrabold text-emerald-400 mt-0.5">
                        {(booking.amount ?? 0) === 0 ? "FREE ENTRY" : `₹${booking.amount}`}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-400 font-bold uppercase tracking-wider">TICKET ID</p>
                      <p className="font-mono text-gray-300 mt-0.5 uppercase">
                        #{booking._id.substring(booking._id.length - 8)}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between mt-auto">
                    <div className="flex flex-col">
                      <span className="text-[9px] text-gray-400 font-bold uppercase tracking-wider">HOLDER</span>
                      <span className="text-xs font-black text-white truncate max-w-[120px] mt-0.5">
                        {user?.name}
                      </span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          window.print();
                        }}
                        className="text-[9px] text-gray-400 hover:text-white underline font-bold mt-1 text-left cursor-pointer focus:outline-none"
                      >
                        Print Pass
                      </button>
                    </div>
                    {/* Mock QR Code block */}
                    <div className="bg-white p-1 rounded-lg shrink-0 shadow-sm hover:scale-105 transition-transform duration-200 cursor-pointer">
                      <svg width="40" height="40" viewBox="0 0 29 29">
                        <path fill="black" d="M0 0h9v9H0zm1 1v7h7V1zm10 0h2v2h-2zm4 0h1v1h-1zm1 0h3v3h-3zm3 0h1v1h-1zm-6 2h1v1h-1zm2 0h1v1h-1zm2 0h1v1h-1zm2 1h1v1h-1zm-4 1h1v2h-1zm3 0h1v1h-1zm-6 1h2v1h-2zm3 0h1v2h-1zm4 0h1v2h-1zm-9 1h1v1h-1zm8 0h1v1h-1zm-7 1h1v2h-1zm4 0h1v1h-1zm-3 1h2v1h-2zm4 0h1v1h-1zm-7 1h2v1h-2zm3 0h1v1h-1zm3 0h1v1h-1zM0 11h9v9H0zm1 1v7h7v-7zm10 0h2v2h-2zm4 0h1v1h-1zm1 0h3v1h-3zm3 0h1v1h-1zm-6 2h1v1h-1zm2 0h1v1h-1zm2 0h1v1h-1zm2 1h1v1h-1zm-4 1h1v2h-1zm3 0h1v1h-1zm-6 1h2v1h-2zm3 0h1v2h-1zm4 0h1v2h-1zm-9 1h1v1h-1zm8 0h1v1h-1zm-7 1h1v2h-1zm4 0h1v1h-1zm-3 1h2v1h-2zm4 0h1v1h-1zm-7 1h2v1h-2zm3 0h1v1h-1zm3 0h1v1h-1z"/>
                      </svg>
                    </div>
                  </div>
                </div>
              ) : (
                /* Regular Card Layout for pending / cancelled / invalid bookings */
                <>
                  <div className="p-6 border-b border-gray-50 flex-grow flex flex-col justify-between">
                    {booking.eventId ? (
                      <>
                        <div className="flex justify-between items-start mb-4 gap-2">
                          <h3 className="text-lg font-bold text-gray-900 leading-tight">
                            {booking.eventId.title}
                          </h3>
                          <div className="flex flex-col gap-1 items-end shrink-0">
                            <span
                              className={`px-2 py-0.5 text-[9px] font-black rounded uppercase tracking-wider ${
                                booking.status === "cancelled"
                                  ? "bg-red-100 text-red-700"
                                  : "bg-yellow-100 text-yellow-700"
                              }`}
                            >
                              {booking.status}
                            </span>
                            {booking.status !== "cancelled" && (
                              <span
                                className={`px-2 py-0.5 text-[9px] font-black rounded uppercase tracking-wider ${
                                  booking.paymentStatus === "paid"
                                    ? "bg-blue-100 text-blue-700"
                                    : "bg-gray-100 text-gray-700"
                                }`}
                              >
                                {booking.paymentStatus.replace("_", " ")}
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="text-sm text-gray-500 space-y-2 mt-auto">
                          <div className="flex items-center gap-2 text-xs">
                            <FaCalendarAlt className="text-gray-400" />
                            <span>{new Date(booking.eventId.date).toLocaleDateString()}</span>
                          </div>
                          <div className="flex items-center gap-2 text-xs">
                            <FaMapMarkerAlt className="text-gray-400" />
                            <span className="truncate max-w-[180px]">{booking.eventId.location}</span>
                          </div>
                          <div className="flex items-center gap-2 text-xs font-semibold text-gray-700">
                            <FaPassIcon className="text-gray-400" />
                            <span>{(booking.amount ?? 0) === 0 ? "Free" : `₹${booking.amount}`}</span>
                          </div>
                        </div>
                      </>
                    ) : (
                      <p className="text-red-500 italic">
                        Event details unavailable (might have been deleted)
                      </p>
                    )}
                  </div>
                  <div className="p-4 bg-gray-50 flex justify-between items-center shrink-0 border-t border-gray-100 w-full">
                    {booking.eventId && booking.status !== "cancelled" ? (
                      <>
                        <Link
                          to={`/events/${booking.eventId._id}`}
                          className="text-gray-900 font-semibold text-sm hover:underline"
                        >
                          View Event
                        </Link>
                        <button
                          onClick={() => cancelBooking(booking._id)}
                          className="text-red-500 font-semibold text-sm hover:text-red-700 transition flex items-center gap-1"
                        >
                          <FaTimesCircle /> Cancel
                        </button>
                      </>
                    ) : (
                      <div className="w-full text-center text-sm text-gray-500 italic font-semibold uppercase tracking-wider py-1.5">
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
