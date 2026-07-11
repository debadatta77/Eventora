import React, { useState, useEffect, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import api from "../utils/axios";
import { useNavigate } from "react-router-dom";
import { FaCalendarAlt, FaChair, FaDollarSign, FaUserCheck, FaHourglassHalf, FaTimesCircle, FaCheckCircle, FaTrashAlt } from "react-icons/fa";

const AdminDashboard = () => {
  const { user } = useContext(AuthContext);
  const toast = useToast();
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showEventForm, setShowEventForm] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    date: "",
    location: "",
    category: "",
    totalSeats: "",
    ticketPrice: "",
    imageUrl: "",
  });

  useEffect(() => {
    if (!user || user.role !== "admin") {
      navigate("/login");
      return;
    }
    fetchData();
  }, [user, navigate]);

  const fetchData = async () => {
    try {
      const [eventsRes, bookingsRes] = await Promise.all([
        api.get("/events"),
        api.get("/bookings"),
      ]);
      setEvents(eventsRes.data);
      setBookings(bookingsRes.data);
    } catch (error) {
      console.error("Error fetching admin data", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateEvent = async (e) => {
    e.preventDefault();
    try {
      await api.post("/events", formData);
      setShowEventForm(false);
      setFormData({
        title: "",
        description: "",
        date: "",
        location: "",
        category: "",
        totalSeats: "",
        ticketPrice: "",
        imageUrl: "",
      });
      toast.success("Event created successfully!");
      fetchData();
    } catch (error) {
      toast.error(error.response?.data?.message || "Error creating event");
    }
  };

  const handleDeleteEvent = async (id) => {
    if (window.confirm("Are you sure you want to delete this event?")) {
      try {
        await api.delete(`/events/${id}`);
        toast.success("Event deleted successfully!");
        fetchData();
      } catch (error) {
        toast.error("Error deleting event");
      }
    }
  };

  const handleConfirmBooking = async (id, paymentStatus) => {
    try {
      await api.put(`/bookings/${id}/confirm`, { paymentStatus });
      toast.success("Booking confirmed successfully!");
      fetchData();
    } catch (error) {
      toast.error(error.response?.data?.message || "Error confirming booking");
    }
  };

  const handleCancelBooking = async (id) => {
    if (window.confirm("Cancel this user's booking request?")) {
      try {
        await api.delete(`/bookings/${id}`);
        toast.success("Booking request cancelled.");
        fetchData();
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
          <span className="text-slate-500 dark:text-slate-400 text-sm font-semibold">Loading admin panel...</span>
        </div>
      </div>
    );

  return (
    <div className="max-w-7xl mx-auto px-4 mt-6 mb-16">
      
      {/* Header Panel */}
      <div className="bg-white/80 dark:bg-slate-900/60 backdrop-blur-xl border border-slate-200/80 dark:border-slate-800/80 rounded-3xl p-6 sm:p-8 mb-8 shadow-xl dark:shadow-2xl flex flex-col md:flex-row justify-between items-center gap-6 text-center md:text-left relative overflow-hidden transition-colors duration-300">
        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 rounded-full blur-3xl -z-10 animate-pulse duration-[8000ms]" />
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white mb-2 tracking-tight">
            Admin Dashboard
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">
            Manage events and confirm platform bookings.
          </p>
        </div>
        <button
          onClick={() => setShowEventForm(!showEventForm)}
          className="w-full md:w-auto bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white font-bold py-3 px-6 rounded-xl shadow-lg shadow-emerald-500/10 hover:shadow-emerald-500/20 transition-all cursor-pointer text-sm"
        >
          {showEventForm ? "Cancel Creation" : "+ Create New Event"}
        </button>
      </div>

      {/* Admin Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        
        {/* Total Revenue */}
        <div className="bg-white/80 dark:bg-slate-900/50 border border-slate-200/80 dark:border-slate-850 p-6 rounded-2xl flex items-center justify-between shadow-md dark:shadow-lg hover:border-emerald-500/20 transition duration-300">
          <div>
            <p className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-1">
              Total Revenue
            </p>
            <h3 className="text-3xl font-black text-emerald-600 dark:text-emerald-400 tracking-tight">
              ₹
              {bookings.reduce(
                (sum, b) =>
                  b.paymentStatus === "paid" && b.status === "confirmed"
                    ? sum + b.amount
                    : sum,
                0,
              )}
            </h3>
          </div>
          <div className="w-12 h-12 bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 dark:text-emerald-400 rounded-full flex items-center justify-center text-lg shadow-inner">
            <FaDollarSign />
          </div>
        </div>

        {/* Paid Clients */}
        <div className="bg-white/80 dark:bg-slate-900/50 border border-slate-200/80 dark:border-slate-850 p-6 rounded-2xl flex items-center justify-between shadow-md dark:shadow-lg hover:border-emerald-500/20 transition duration-300">
          <div>
            <p className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-1">
              Paid Clients
            </p>
            <h3 className="text-3xl font-black text-cyan-600 dark:text-cyan-400 tracking-tight">
              {
                new Set(
                  bookings
                    .filter(
                      (b) =>
                        b.paymentStatus === "paid" && b.status === "confirmed",
                    )
                    .map((b) => b.userId?._id),
                ).size
              }
            </h3>
          </div>
          <div className="w-12 h-12 bg-cyan-500/10 border border-cyan-500/20 text-cyan-500 dark:text-cyan-400 rounded-full flex items-center justify-center text-lg shadow-inner">
            <FaUserCheck />
          </div>
        </div>

        {/* Pending Requests */}
        <div className="bg-white/80 dark:bg-slate-900/50 border border-slate-200/80 dark:border-slate-850 p-6 rounded-2xl flex items-center justify-between shadow-md dark:shadow-lg hover:border-emerald-500/20 transition duration-300">
          <div>
            <p className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-1">
              Pending Requests
            </p>
            <h3 className="text-3xl font-black text-amber-600 dark:text-amber-400 tracking-tight">
              {bookings.filter((b) => b.status === "pending").length}
            </h3>
          </div>
          <div className="w-12 h-12 bg-amber-500/10 border border-amber-500/20 text-amber-500 dark:text-amber-400 rounded-full flex items-center justify-center text-lg shadow-inner animate-pulse">
            <FaHourglassHalf />
          </div>
        </div>

      </div>

      {showEventForm && (
        <div className="bg-white/90 dark:bg-slate-900/60 backdrop-blur-md p-8 rounded-3xl border border-slate-200/80 dark:border-slate-800/80 mb-8 shadow-2xl animate-in fade-in slide-in-from-top-4 duration-300">
          <h2 className="text-2xl font-black mb-6 text-slate-900 dark:text-white tracking-tight border-b border-slate-100 dark:border-slate-800 pb-3">
            Create New Event
          </h2>
          <form
            onSubmit={handleCreateEvent}
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
          >
            <input
              required
              type="text"
              placeholder="Event Title"
              className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/20 outline-none transition rounded-xl px-4 py-3.5 text-sm"
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
            />
            <input
              required
              type="text"
              placeholder="Category (e.g., Technology, Music)"
              className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/20 outline-none transition rounded-xl px-4 py-3.5 text-sm"
              value={formData.category}
              onChange={(e) =>
                setFormData({ ...formData, category: e.target.value })
              }
            />
            <input
              required
              type="date"
              className="bg-white dark:bg-slate-955 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/20 outline-none transition rounded-xl px-4 py-3.5 text-sm"
              value={formData.date}
              onChange={(e) =>
                setFormData({ ...formData, date: e.target.value })
              }
            />
            <input
              required
              type="text"
              placeholder="Location"
              className="bg-white dark:bg-slate-955 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/20 outline-none transition rounded-xl px-4 py-3.5 text-sm"
              value={formData.location}
              onChange={(e) =>
                setFormData({ ...formData, location: e.target.value })
              }
            />
            <input
              required
              type="number"
              placeholder="Total Seats"
              className="bg-white dark:bg-slate-955 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/20 outline-none transition rounded-xl px-4 py-3.5 text-sm"
              value={formData.totalSeats}
              onChange={(e) =>
                setFormData({ ...formData, totalSeats: e.target.value })
              }
            />
            <input
              required
              type="number"
              placeholder="Ticket Price (0 for free)"
              className="bg-white dark:bg-slate-955 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/20 outline-none transition rounded-xl px-4 py-3.5 text-sm"
              value={formData.ticketPrice}
              onChange={(e) =>
                setFormData({ ...formData, ticketPrice: e.target.value })
              }
            />

            <div className="md:col-span-2">
              <input
                type="text"
                placeholder="Image URL (Provide direct link to an image)"
                className="w-full bg-white dark:bg-slate-955 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/20 outline-none transition rounded-xl px-4 py-3.5 text-sm"
                value={formData.imageUrl}
                onChange={(e) =>
                  setFormData({ ...formData, imageUrl: e.target.value })
                }
              />
            </div>

            <textarea
              required
              placeholder="Event Description"
              className="bg-white dark:bg-slate-955 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/20 outline-none transition rounded-xl px-4 py-3.5 text-sm h-32 md:col-span-2"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
            />
            <button
              type="submit"
              className="md:col-span-2 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white font-bold py-3.5 mt-2 rounded-xl transition shadow-lg shadow-emerald-500/10 hover:shadow-emerald-500/20 cursor-pointer text-sm"
            >
              Publish Event
            </button>
          </form>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Events Section */}
        <div className="flex flex-col">
          <h2 className="text-xl font-black text-slate-900 dark:text-white mb-6 flex items-center gap-3">
            <span className="flex items-center justify-center w-8 h-8 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 dark:text-emerald-400 text-xs font-black">
              {events.length}
            </span>
            All Events
          </h2>
          <div className="bg-white/80 dark:bg-slate-900/50 border border-slate-200/80 dark:border-slate-850 rounded-2xl overflow-hidden shadow-md dark:shadow-lg transition-colors duration-300">
            <ul className="divide-y divide-slate-100 dark:divide-slate-850 max-h-[600px] overflow-y-auto">
              {events.length === 0 ? (
                <li className="p-6 text-slate-500 text-center text-sm font-semibold">
                  No events created yet.
                </li>
              ) : (
                events.map((event) => (
                  <li
                    key={event._id}
                    className="p-5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 hover:bg-slate-50/50 dark:hover:bg-slate-955/40 transition border-b border-slate-100 dark:border-slate-850 last:border-0"
                  >
                    <div>
                      <h4 className="font-bold text-slate-900 dark:text-white mb-1 leading-tight text-md">
                        {event.title}
                      </h4>
                      <div className="flex flex-wrap items-center gap-3.5 text-xs text-slate-500 dark:text-slate-400 font-medium">
                        <span className="flex items-center gap-1.5">
                          <FaCalendarAlt className="text-emerald-500 dark:text-emerald-400/80" />{" "}
                          {new Date(event.date).toLocaleDateString()}
                        </span>
                        <span className="flex items-center gap-1.5">
                          <FaChair className="text-emerald-500 dark:text-emerald-400/80" />{" "}
                          {event.availableSeats}/{event.totalSeats} seats
                        </span>
                      </div>
                    </div>
                    <button
                      onClick={() => handleDeleteEvent(event._id)}
                      className="w-full sm:w-auto text-rose-500 dark:text-rose-400 hover:text-white hover:bg-rose-600 border border-rose-200 dark:border-rose-500/10 px-4 py-2 rounded-xl text-xs font-bold transition shadow-sm shrink-0 flex items-center justify-center gap-1 cursor-pointer focus:outline-none"
                    >
                      <FaTrashAlt className="text-[10px]" /> Delete
                    </button>
                  </li>
                ))
              )}
            </ul>
          </div>
        </div>

        {/* Bookings Section */}
        <div className="flex flex-col">
          <h2 className="text-xl font-black text-slate-900 dark:text-white mb-6 flex items-center gap-3">
            <span className="flex items-center justify-center w-8 h-8 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-400 text-xs font-black">
              {bookings.length}
            </span>
            Booking Requests
          </h2>
          <div className="bg-white/80 dark:bg-slate-900/50 border border-slate-200/80 dark:border-slate-850 rounded-2xl overflow-hidden shadow-md dark:shadow-lg transition-colors duration-300">
            <ul className="divide-y divide-slate-100 dark:divide-slate-850 max-h-[600px] overflow-y-auto">
              {bookings.length === 0 ? (
                <li className="p-6 text-slate-500 text-center text-sm font-semibold">
                  No bookings yet.
                </li>
              ) : (
                bookings.map((booking) => (
                  <li
                    key={booking._id}
                    className={`p-6 hover:bg-slate-50/50 dark:hover:bg-slate-955/40 transition border-l-4 ${booking.status === "pending" ? "border-l-amber-500" : booking.status === "confirmed" ? "border-l-emerald-500" : "border-l-rose-500"}`}
                  >
                    <div className="flex justify-between items-start mb-3">
                      <h4 className="font-bold text-slate-900 dark:text-white text-md leading-tight max-w-[200px] sm:max-w-xs line-clamp-1">
                        {booking.eventId?.title || "Deleted Event"}
                      </h4>
                      <div className="flex flex-col gap-1 items-end shrink-0.5 ml-4">
                        <span
                          className={`px-2 py-0.5 text-[9px] font-black rounded uppercase tracking-wider border ${booking.status === "confirmed" ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-650 dark:text-emerald-400" : booking.status === "cancelled" ? "bg-rose-500/10 border-rose-500/20 text-rose-650 dark:text-rose-400" : "bg-amber-500/10 border-amber-500/20 text-amber-650 dark:text-amber-400"}`}
                        >
                          {booking.status}
                        </span>
                        {booking.status !== "cancelled" && (
                          <span
                            className={`px-2 py-0.5 text-[9px] font-black rounded uppercase tracking-wider border ${booking.paymentStatus === "paid" ? "bg-cyan-500/10 border-cyan-500/20 text-cyan-650 dark:text-cyan-400" : "bg-slate-100 dark:bg-slate-850 border-slate-200 dark:border-slate-800 text-slate-650 dark:text-slate-500"}`}
                          >
                            {booking.paymentStatus.replace("_", " ")}
                          </span>
                        )}
                      </div>
                    </div>
                    
                    <div className="bg-slate-50/60 dark:bg-slate-955/60 rounded-xl p-3.5 mb-3.5 border border-slate-100 dark:border-slate-850 text-xs text-slate-600 dark:text-slate-400">
                      <p className="flex items-center gap-2 mb-1.5">
                        <span className="font-bold w-16 text-slate-500 uppercase text-[10px]">
                          User:
                        </span>
                        <span className="font-semibold text-slate-850 dark:text-white">
                          {booking.userId?.name}
                        </span>
                        <span className="text-slate-400 text-[10px] truncate max-w-[120px]">
                          ({booking.userId?.email})
                        </span>
                      </p>
                      <p className="flex items-center gap-2 mb-1.5">
                        <span className="font-bold w-16 text-slate-500 uppercase text-[10px]">
                          Amount:
                        </span>
                        <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                          {(booking.amount ?? booking.ammount ?? 0) === 0 ? "Free" : `₹${booking.amount ?? booking.ammount}`}
                        </span>
                      </p>
                      <p className="flex items-center gap-2 mb-1.5">
                        <span className="font-bold w-16 text-slate-500 uppercase text-[10px]">
                          Date:
                        </span>
                        <span className="text-slate-700 dark:text-slate-300 font-medium">
                          {new Date(booking.bookedAt).toLocaleString()}
                        </span>
                      </p>
                      {booking.eventId && (
                        <p className="text-slate-450 flex items-center gap-2 mt-2 pt-2 border-t border-slate-100 dark:border-slate-855">
                          <span className="font-bold w-16 text-slate-500 uppercase text-[10px]">
                            Seats:
                          </span>
                          <span
                            className={`font-bold ${booking.eventId.availableSeats > 0 ? "text-emerald-600 dark:text-emerald-400" : "text-rose-500 dark:text-rose-455"}`}
                          >
                            {booking.eventId.availableSeats}
                          </span>{" "}
                          remaining of {booking.eventId.totalSeats}
                        </p>
                      )}
                    </div>

                    {/* Action buttons for admin */}
                    {booking.status === "pending" && (
                      <div className="flex flex-wrap gap-2 mt-2">
                        <button
                          onClick={() =>
                            handleConfirmBooking(booking._id, "paid")
                          }
                          className="flex-1 min-w-[120px] bg-emerald-500/10 hover:bg-emerald-600 border border-emerald-500/20 hover:border-transparent text-emerald-650 hover:text-white dark:text-emerald-400 text-xs font-bold py-2.5 px-3 rounded-xl shadow-sm transition cursor-pointer flex items-center justify-center gap-1 focus:outline-none"
                        >
                          <FaCheckCircle className="text-[10px]" /> Approve Paid
                        </button>
                        <button
                          onClick={() =>
                            handleConfirmBooking(booking._id, "nonpaid")
                          }
                          className="flex-1 min-w-[120px] bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-750 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white text-xs font-bold py-2.5 px-3 rounded-xl shadow-sm transition cursor-pointer focus:outline-none"
                        >
                          Approve Unpaid
                        </button>
                        <button
                          onClick={() => handleCancelBooking(booking._id)}
                          className="w-[80px] bg-rose-500/10 hover:bg-rose-600 border border-rose-500/20 hover:border-transparent text-rose-650 hover:text-white dark:text-rose-400 text-xs font-bold py-2.5 px-3 rounded-xl transition cursor-pointer flex items-center justify-center gap-1 focus:outline-none"
                        >
                          <FaTimesCircle className="text-[10px]" /> Reject
                        </button>
                      </div>
                    )}
                  </li>
                ))
              )}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
