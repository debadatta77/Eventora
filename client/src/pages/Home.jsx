import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../utils/axios";
import {
  FaCalendarAlt,
  FaMapMarkerAlt,
  FaSearch,
  FaRegClock,
  FaTicketAlt,
  FaShieldAlt,
} from "react-icons/fa";

const SkeletonCard = () => (
  <div className="bg-slate-900/50 border border-slate-850 rounded-2xl overflow-hidden flex flex-col animate-pulse">
    <div className="h-48 bg-slate-800/60" />
    <div className="p-6 flex-grow flex flex-col space-y-4">
      <div className="h-3 bg-slate-800/60 rounded w-1/4" />
      <div className="h-6 bg-slate-800/60 rounded w-3/4" />
      <div className="space-y-2">
        <div className="h-4 bg-slate-800/60 rounded w-1/2" />
        <div className="h-4 bg-slate-800/60 rounded w-2/3" />
      </div>
      <div className="mt-auto space-y-2 pt-4">
        <div className="h-2 bg-slate-800/60 rounded-full w-full" />
        <div className="h-4 bg-slate-800/60 rounded w-1/3" />
        <div className="h-10 bg-slate-800/60 rounded w-full" />
      </div>
    </div>
  </div>
);

const Home = () => {
  const [events, setEvents] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [loading, setLoading] = useState(true);

  const categories = [
    "All",
    "Technology",
    "Music",
    "Business",
    "Art",
    "Food",
    "Entertainment",
    "Sports",
    "Health",
  ];

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      fetchEvents();
    }, 400); // 400ms debounce
    return () => clearTimeout(timeoutId);
  }, [search, selectedCategory]);

  const fetchEvents = async () => {
    try {
      const categoryParam = selectedCategory === "All" ? "" : `&category=${selectedCategory}`;
      const { data } = await api.get(`/events?search=${search}${categoryParam}`);
      setEvents(data);
    } catch (error) {
      console.error("Error fetching events:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <div className="relative bg-slate-950 text-white rounded-3xl overflow-hidden mb-12 shadow-2xl border border-slate-900">
        <div className="absolute inset-0 opacity-20 bg-[url('https://images.unsplash.com/photo-1459749411175-04bf5292ceea?q=80&w=3000&auto=format&fit=crop')] bg-cover bg-center"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/80 to-transparent"></div>
        
        {/* Decorative Glow blob */}
        <div className="absolute top-10 right-10 w-72 h-72 bg-emerald-500/10 rounded-full blur-3xl -z-10 animate-pulse duration-[8000ms]" />

        <div className="relative p-10 md:p-20 text-center flex flex-col items-center z-10">
          <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 backdrop-blur-md px-4 py-1.5 rounded-full text-xs font-bold tracking-widest uppercase mb-6 select-none animate-pulse">
            Welcome to Eventora
          </span>
          <h1 className="text-5xl md:text-7xl font-black mb-6 leading-tight tracking-tight drop-shadow-lg text-white">
            Find Your Next <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-300">
              Unforgettable
            </span>{" "}
            Experience
          </h1>
          <p className="text-slate-400 text-lg md:text-xl mb-10 max-w-2xl mx-auto font-medium leading-relaxed">
            Discover the best tech conferences, late-night music festivals, and
            hands-on workshops happening directly in your area. Secure your spot
            today.
          </p>

          <div className="w-full max-w-2xl mx-auto relative flex items-center shadow-2xl group">
            <FaSearch className="absolute left-6 text-slate-500 text-xl group-focus-within:text-emerald-400 transition-colors" />
            <input
              type="text"
              placeholder="Search events by title..."
              className="w-full pl-16 pr-12 py-5 rounded-full text-lg text-white bg-slate-900/60 backdrop-blur-md border border-slate-800/80 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/20 focus:outline-none transition-all placeholder-slate-500 font-medium"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            {search && (
              <button
                onClick={() => setSearch("")}
                className="absolute right-6 text-slate-400 hover:text-white transition-colors text-lg focus:outline-none font-bold"
              >
                ✕
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Why Choose Us / Features row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16 px-4">
        
        <div className="bg-slate-900/40 backdrop-blur-md p-8 rounded-2xl shadow-sm border border-slate-850 flex flex-col items-center text-center hover:-translate-y-1 hover:border-emerald-500/20 transition-all duration-300 group">
          <div className="w-16 h-16 bg-gradient-to-tr from-emerald-500/10 to-teal-600/10 border border-emerald-500/20 text-emerald-400 rounded-2xl flex items-center justify-center text-2xl mb-6 group-hover:scale-105 transition-all">
            <FaRegClock />
          </div>
          <h3 className="text-xl font-bold text-white mb-3">Fast Booking</h3>
          <p className="text-slate-400 text-sm leading-relaxed">
            Secure your tickets instantly with our fast streamlined booking
            infrastructure built for speed.
          </p>
        </div>

        <div className="bg-slate-900/40 backdrop-blur-md p-8 rounded-2xl shadow-sm border border-slate-850 flex flex-col items-center text-center hover:-translate-y-1 hover:border-emerald-500/20 transition-all duration-300 group">
          <div className="w-16 h-16 bg-gradient-to-tr from-emerald-500/10 to-teal-600/10 border border-emerald-500/20 text-emerald-400 rounded-2xl flex items-center justify-center text-2xl mb-6 group-hover:scale-105 transition-all">
            <FaTicketAlt />
          </div>
          <h3 className="text-xl font-bold text-white mb-3">
            Seamless Access
          </h3>
          <p className="text-slate-400 text-sm leading-relaxed">
            Download tickets instantly or manage them right from your personal
            dashboard with easily.
          </p>
        </div>

        <div className="bg-slate-900/40 backdrop-blur-md p-8 rounded-2xl shadow-sm border border-slate-850 flex flex-col items-center text-center hover:-translate-y-1 hover:border-emerald-500/20 transition-all duration-300 group">
          <div className="w-16 h-16 bg-gradient-to-tr from-emerald-500/10 to-teal-600/10 border border-emerald-500/20 text-emerald-400 rounded-2xl flex items-center justify-center text-2xl mb-6 group-hover:scale-105 transition-all">
            <FaShieldAlt />
          </div>
          <h3 className="text-xl font-bold text-white mb-3">
            Secure Platform
          </h3>
          <p className="text-slate-400 text-sm leading-relaxed">
            All transactions and registrations are bounded by cutting-edge
            security and 2FA OTP tech.
          </p>
        </div>

      </div>

      {/* Category Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-8 -mx-4 px-4 scrollbar-hide">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => {
              setLoading(true);
              setSelectedCategory(cat);
            }}
            className={`px-5 py-2.5 rounded-full text-sm font-semibold whitespace-nowrap transition-all duration-200 cursor-pointer ${
              selectedCategory === cat
                ? "bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-lg shadow-emerald-500/10 scale-[1.02]"
                : "bg-slate-900/40 text-slate-400 hover:text-white border border-slate-800/80"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Results Header */}
      <div className="flex items-center justify-between mb-8 px-2 border-b border-slate-800 pb-4">
        <h2 className="text-3xl font-extrabold text-white flex items-center gap-2">
          Upcoming <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-300">Events</span>
        </h2>
        <div className="text-slate-400 font-bold text-sm bg-slate-900/40 border border-slate-850 px-3.5 py-1.5 rounded-full">
          {events.length} results
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[...Array(6)].map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      ) : events.length === 0 ? (
        <div className="text-center py-20 text-lg text-slate-400 bg-slate-900/20 rounded-2xl border border-slate-850 p-8 w-full">
          No events found matching your search.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {events.map((event) => (
            <div
              key={event._id}
              className="group bg-slate-900/50 backdrop-blur-sm rounded-2xl overflow-hidden border border-slate-850 hover:border-emerald-500/20 shadow-md hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 flex flex-col"
            >
              <div className="h-48 bg-slate-800/30 overflow-hidden relative">
                {event.imageUrl || event.image ? (
                  <img
                    src={event.imageUrl || event.image}
                    alt={event.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-slate-950 text-slate-500 font-bold text-2xl">
                    {event.category || "Event"}
                  </div>
                )}
                {/* Floating Glass Price Badge */}
                <div className="absolute top-4 right-4 bg-slate-950/70 border border-slate-800/80 backdrop-blur-md px-3 py-1 rounded-full text-sm font-bold shadow-sm">
                  {event.ticketPrice === 0 ? (
                    <span className="text-emerald-400">FREE</span>
                  ) : (
                    <span className="text-white">₹{event.ticketPrice}</span>
                  )}
                </div>
              </div>
              <div className="p-6 flex-grow flex flex-col">
                <div className="text-xs font-bold text-emerald-400 uppercase tracking-wider mb-2">
                  {event.category}
                </div>
                <h2 className="text-xl font-bold text-white mb-3 group-hover:text-emerald-300 transition-colors line-clamp-1">
                  {event.title}
                </h2>
                <div className="flex flex-col gap-2 mb-4 text-slate-400 text-sm">
                  <div className="flex items-center gap-2">
                    <FaCalendarAlt className="text-emerald-400/80" />
                    <span>
                      {new Date(event.date).toLocaleDateString(undefined, {
                        weekday: "long",
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <FaMapMarkerAlt className="text-emerald-400/80" />
                    <span className="truncate">{event.location}</span>
                  </div>
                </div>
                <div className="mt-auto">
                  <div className="w-full bg-slate-950 rounded-full h-2 mb-2">
                    <div
                      className="bg-gradient-to-r from-emerald-500 to-teal-600 h-2 rounded-full shadow-[0_0_8px_rgba(16,185,129,0.3)]"
                      style={{
                        width: `${(event.availableSeats / event.totalSeats) * 100}%`,
                      }}
                    ></div>
                  </div>
                  <p className="text-xs text-slate-500 mb-4 font-bold">
                    {event.availableSeats} of {event.totalSeats} seats remaining
                  </p>
                  <Link
                    to={`/events/${event._id}`}
                    className="block w-full text-center bg-slate-950 border border-slate-800 hover:bg-gradient-to-r hover:from-emerald-500 hover:to-teal-600 hover:border-transparent text-white font-bold py-2.5 rounded-xl transition-all duration-300 text-xs"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Footer Section */}
      <footer className="mt-auto pt-16 pb-8 border-t border-slate-900 text-center">
        <div className="flex justify-center items-center gap-2 mb-4">
          <FaTicketAlt className="text-emerald-400 text-2xl rotate-[-10deg]" />
          <span className="text-xl font-bold text-white">Eventora</span>
        </div>
        <p className="text-slate-400 text-sm mb-6 max-w-md mx-auto leading-relaxed">
          The simplest, most dynamic way to manage, discover, and host
          world-class events in your local city. Let's make memories together.
        </p>
        <div className="text-xs text-slate-500 font-bold uppercase tracking-wider">
          &copy; {new Date().getFullYear()} Eventora Platform. All rights reserved.
        </div>
      </footer>
    </div>
  );
};

export default Home;
