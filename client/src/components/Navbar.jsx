import React, { useContext, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { FaTicketAlt, FaSignOutAlt, FaTachometerAlt } from "react-icons/fa";
import ProfileModal from "./ProfileModal";

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="sticky top-0 z-50 bg-gray-950/95 backdrop-blur-md border-b border-gray-800 shadow-md">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="flex justify-between items-center py-4 gap-4">
          <Link
            to="/"
            className="text-white text-2xl font-black flex items-center gap-2.5 hover:scale-[1.02] active:scale-[0.98] transition-transform duration-200"
          >
            <FaTicketAlt className="text-emerald-400 rotate-[-10deg]" /> Eventora
          </Link>
          <div className="flex items-center gap-3 sm:gap-6">
            <Link
              to="/"
              className={`text-sm font-semibold transition cursor-pointer ${
                isActive("/")
                  ? "text-emerald-400 font-bold"
                  : "text-gray-300 hover:text-white"
              }`}
            >
              Events
            </Link>
            {user ? (
              <div className="flex items-center gap-3 sm:gap-5 border-l border-gray-800 pl-3 sm:pl-5">
                <Link
                  to={user.role === "admin" ? "/admin" : "/dashboard"}
                  className={`flex items-center gap-1.5 text-sm font-semibold transition ${
                    isActive("/dashboard") || isActive("/admin")
                      ? "text-emerald-400 font-bold"
                      : "text-gray-300 hover:text-white"
                  }`}
                  title="Dashboard"
                >
                  <FaTachometerAlt className="text-base sm:text-xs" />
                  <span className="hidden sm:inline">Dashboard</span>
                </Link>
                
                {/* User Avatar Circle (Clickable) */}
                <button
                  type="button"
                  onClick={() => setIsProfileModalOpen(true)}
                  className="flex items-center gap-1.5 sm:gap-2 hover:opacity-80 transition cursor-pointer focus:outline-none"
                  title="View Profile"
                >
                  <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-emerald-400 to-teal-600 text-white flex items-center justify-center font-black text-sm shadow-sm select-none border border-emerald-300/20">
                    {user.name ? user.name.charAt(0).toUpperCase() : "U"}
                  </div>
                  <span className="hidden lg:inline text-xs font-bold text-gray-300 max-w-[100px] truncate">
                    {user.name}
                  </span>
                </button>

                <button
                  onClick={handleLogout}
                  className="bg-gray-850 hover:bg-rose-600 hover:text-white text-gray-300 p-2 sm:px-3 sm:py-1.5 rounded-lg transition-all duration-200 text-xs font-bold flex items-center gap-1.5 focus:outline-none cursor-pointer"
                  title="Logout"
                >
                  <FaSignOutAlt className="text-sm sm:text-xs" />
                  <span className="hidden sm:inline">Logout</span>
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-3 sm:gap-5 border-l border-gray-800 pl-3 sm:pl-5">
                <Link
                  to="/login"
                  className={`text-sm font-semibold transition ${
                    isActive("/login")
                      ? "text-emerald-400 font-bold"
                      : "text-gray-300 hover:text-white"
                  }`}
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="bg-white text-gray-950 hover:bg-emerald-400 hover:text-white px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg font-bold text-xs transition duration-200 shadow-sm"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Profile Details Modal */}
      <ProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
      />
    </nav>
  );
};

export default Navbar;
