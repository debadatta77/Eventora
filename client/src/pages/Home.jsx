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
  <div className="bg-white rounded-xl overflow-hidden shadow-md border border-gray-100 flex flex-col animate-pulse">
    <div className="h-48 bg-gray-200" />
    <div className="p-6 flex-grow flex flex-col space-y-4">
      <div className="h-3 bg-gray-200 rounded w-1/4" />
      <div className="h-6 bg-gray-200 rounded w-3/4" />
      <div className="space-y-2">
        <div className="h-4 bg-gray-200 rounded w-1/2" />
        <div className="h-4 bg-gray-200 rounded w-2/3" />
      </div>
      <div className="mt-auto space-y-2 pt-4">
        <div className="h-2 bg-gray-200 rounded-full w-full" />
        <div className="h-4 bg-gray-200 rounded w-1/3" />
        <div className="h-10 bg-gray-200 rounded w-full" />
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
      <div className="relative bg-black text-white rounded-3xl overflow-hidden mb-12 shadow-2xl">
        <div className="absolute inset-0 opacity-40 bg-[url('https://images.unsplash.com/photo-1459749411175-04bf5292ceea?q=80&w=3000&auto=format&fit=crop')] bg-cover bg-center"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-transparent"></div>
        <div className="relative p-10 md:p-20 text-center flex flex-col items-center z-10">
          <span className="bg-white/20 text-white backdrop-blur-md px-4 py-1.5 rounded-full text-xs font-bold tracking-widest uppercase mb-6 border border-white/20">
            Welcome to Eventora
          </span>
          <h1 className="text-5xl md:text-7xl font-black mb-6 leading-tight tracking-tight drop-shadow-lg">
            Find Your Next <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-gray-200 to-gray-500">
              Unforgettable
            </span>{" "}
            Experience
          </h1>
          <p className="text-gray-300 text-lg md:text-xl mb-10 max-w-2xl mx-auto font-light leading-relaxed">
            Discover the best tech conferences, late-night music festivals, and
            hands-on workshops happening directly in your area. Secure your spot
            today.
          </p>

          <div className="w-full max-w-2xl mx-auto relative flex items-center shadow-2xl group">
            <FaSearch className="absolute left-6 text-gray-500 text-xl group-focus-within:text-black transition-colors" />
            <input
              type="text"
              placeholder="Search events by title..."
              className="w-full pl-16 pr-12 py-5 rounded-full text-lg text-black bg-white/95 backdrop-blur-sm border-2 border-transparent focus:border-gray-500 focus:outline-none transition-all placeholder-gray-400 font-medium"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            {search && (
              <button
                onClick={() => setSearch("")}
                className="absolute right-6 text-gray-400 hover:text-black transition-colors text-lg focus:outline-none font-bold"
              >
                ✕
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Why Choose Us / Features row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16 px-4">
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center text-center hover:-translate-y-1 transition duration-300">
          <div className="w-16 h-16 bg-gray-900 text-white rounded-2xl flex items-center justify-center text-2xl mb-6 shadow-md shadow-gray-200/50">
            <FaRegClock />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-3">Fast Booking</h3>
          <p className="text-gray-500 text-sm leading-relaxed">
            Secure your tickets instantly with our fast streamlined booking
            infrastructure built for speed.
          </p>
        </div>
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center text-center hover:-translate-y-1 transition duration-300">
          <div className="w-16 h-16 bg-gray-900 text-white rounded-2xl flex items-center justify-center text-2xl mb-6 shadow-md shadow-gray-200/50">
            <FaTicketAlt />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-3">
            Seamless Access
          </h3>
          <p className="text-gray-500 text-sm leading-relaxed">
            Download tickets instantly or manage them right from your personal
            dashboard with easily.
          </p>
        </div>
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center text-center hover:-translate-y-1 transition duration-300">
          <div className="w-16 h-16 bg-gray-900 text-white rounded-2xl flex items-center justify-center text-2xl mb-6 shadow-md shadow-gray-200/50">
            <FaShieldAlt />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-3">
            Secure Platform
          </h3>
          <p className="text-gray-500 text-sm leading-relaxed">
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
            className={`px-5 py-2.5 rounded-full text-sm font-semibold whitespace-nowrap transition-all duration-200 ${
              selectedCategory === cat
                ? "bg-gray-900 text-white shadow-md shadow-gray-900/10 scale-[1.02]"
                : "bg-white text-gray-600 hover:bg-gray-50 border border-gray-200"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="flex items-center justify-between mb-8 px-2 border-b border-gray-200 pb-4">
        <h2 className="text-3xl font-extrabold text-gray-900">
          Upcoming Events
        </h2>
        <div className="text-gray-500 font-medium">
          {events.length} results found
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[...Array(6)].map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      ) : events.length === 0 ? (
        <div className="text-center py-20 text-xl text-gray-500 bg-white rounded-2xl border border-gray-100 p-8 w-full">
          No events found matching your search.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {events.map((event) => (
            <div
              key={event._id}
              className="group bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 flex flex-col border border-gray-100/50"
            >
              <div className="h-48 bg-gray-200 overflow-hidden relative">
                {event.imageUrl || event.image ? (
                  <img
                    src={event.imageUrl || event.image}
                    alt={event.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gray-200 text-gray-600 font-bold text-2xl">
                    {event.category || "Event"}
                  </div>
                )}
                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-bold shadow-sm">
                  {event.ticketPrice === 0 ? (
                    <span className="text-green-600">FREE</span>
                  ) : (
                    <span className="text-gray-900">₹{event.ticketPrice}</span>
                  )}
                </div>
              </div>
              <div className="p-6 flex-grow flex flex-col">
                <div className="text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                  {event.category}
                </div>
                <h2 className="text-xl font-bold text-gray-800 mb-3 group-hover:text-black transition-colors">
                  {event.title}
                </h2>
                <div className="flex flex-col gap-2 mb-4 text-gray-600 text-sm">
                  <div className="flex items-center gap-2">
                    <FaCalendarAlt className="text-gray-400" />
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
                    <FaMapMarkerAlt className="text-gray-400" />
                    <span>{event.location}</span>
                  </div>
                </div>
                <div className="mt-auto">
                  <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                    <div
                      className="bg-gray-700 h-2 rounded-full"
                      style={{
                        width: `${(event.availableSeats / event.totalSeats) * 100}%`,
                      }}
                    ></div>
                  </div>
                  <p className="text-xs text-gray-500 mb-4">
                    {event.availableSeats} of {event.totalSeats} seats remaining
                  </p>
                  <Link
                    to={`/events/${event._id}`}
                    className="block w-full text-center bg-gray-100 hover:bg-gray-900 hover:text-white text-gray-900 font-semibold py-2.5 rounded-lg transition-colors duration-200"
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
      <footer className="mt-auto pt-16 pb-8 border-t border-gray-200 text-center">
        <div className="flex justify-center items-center gap-2 mb-4">
          <FaTicketAlt className="text-gray-800 text-2xl" />
          <span className="text-xl font-bold text-gray-900">Eventora</span>
        </div>
        <p className="text-gray-500 text-sm mb-6 max-w-md mx-auto">
          The simplest, most dynamic way to manage, discover, and host
          world-class events in your local city. Let's make memories together.
        </p>
        <div className="text-xs text-gray-400 font-medium uppercase tracking-wider">
          &copy; {new Date().getFullYear()} Eventora Platform. All rights
          reserved.
        </div>
      </footer>
    </div>
  );
};

export default Home;
