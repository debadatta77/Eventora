import React, { useState, useContext } from "react";
import { createPortal } from "react-dom";
import { AuthContext } from "../context/AuthContext";
import { FaUser, FaEnvelope, FaShieldAlt, FaLock, FaTimes, FaEdit, FaSave } from "react-icons/fa";

const ProfileModal = ({ isOpen, onClose }) => {
  const { user, updateProfile } = useContext(AuthContext);
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(user?.name || "");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen || !user) return null;

  const handleSave = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      setError("Name cannot be empty");
      return;
    }
    setError("");
    setSuccess("");
    setIsSubmitting(true);

    try {
      await updateProfile(name);
      setSuccess("Profile updated successfully!");
      setIsEditing(false);
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setError(err.response?.data?.error || "Failed to update profile");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    setName(user.name);
    setIsEditing(false);
    setError("");
  };

  return createPortal(
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Dark Blur Overlay */}
      <div 
        className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm transition-opacity duration-300"
        onClick={onClose}
      />

      {/* Modal Container */}
      <div className="relative w-full max-w-md transform overflow-hidden rounded-2xl bg-slate-900/90 border border-slate-800/80 p-6 text-left align-middle shadow-2xl backdrop-blur-xl transition-all duration-300 scale-100 animate-in fade-in zoom-in-95">
        
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 text-slate-400 hover:text-white transition duration-200 cursor-pointer focus:outline-none"
        >
          <FaTimes className="text-lg" />
        </button>

        {/* Modal Header */}
        <div className="flex flex-col items-center mb-6">
          {/* Avatar Circle */}
          <div className="relative group mb-3">
            <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-emerald-400 to-teal-600 text-white flex items-center justify-center font-black text-3xl shadow-xl border-2 border-emerald-400/20 group-hover:scale-105 transition-transform duration-300 select-none">
              {user.name ? user.name.charAt(0).toUpperCase() : "U"}
            </div>
            {/* Glow */}
            <div className="absolute -inset-1 rounded-full bg-gradient-to-tr from-emerald-400 to-teal-600 opacity-25 blur-sm -z-10 group-hover:opacity-40 transition duration-300" />
          </div>
          
          <h3 className="text-xl font-black text-white bg-gradient-to-r from-emerald-400 to-teal-300 bg-clip-text text-transparent">
            My Account
          </h3>
          <span className="text-xs text-slate-400 mt-1">Manage your profile details</span>
        </div>

        {/* Error/Success Messages */}
        {error && (
          <div className="mb-4 p-3 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-semibold animate-shake">
            {error}
          </div>
        )}
        {success && (
          <div className="mb-4 p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold">
            {success}
          </div>
        )}

        {/* Profile Info Form */}
        <form onSubmit={handleSave} className="space-y-4">
          
          {/* Name Field (Editable) */}
          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">
              Full Name
            </label>
            <div className="relative flex items-center">
              <div className="absolute left-3 text-slate-400">
                <FaUser className="text-sm" />
              </div>
              {isEditing ? (
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2.5 pl-10 pr-4 text-sm text-white focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/20 transition-all duration-200"
                  placeholder="Enter name"
                  autoFocus
                />
              ) : (
                <div className="w-full bg-slate-955/40 border border-slate-900 rounded-xl py-2.5 pl-10 pr-12 text-sm text-white font-medium flex items-center justify-between">
                  <span className="truncate">{user.name}</span>
                  <button
                    type="button"
                    onClick={() => setIsEditing(true)}
                    className="absolute right-3 text-slate-400 hover:text-emerald-400 transition cursor-pointer focus:outline-none"
                    title="Edit Name"
                  >
                    <FaEdit className="text-sm" />
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Email Field (Disabled) */}
          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider">
                Email Address
              </label>
              <span className="text-[10px] text-slate-500 flex items-center gap-1">
                <FaLock className="text-[8px]" /> Cannot be changed
              </span>
            </div>
            <div className="relative flex items-center">
              <div className="absolute left-3 text-slate-500">
                <FaEnvelope className="text-sm" />
              </div>
              <input
                type="email"
                value={user.email}
                disabled
                className="w-full bg-slate-950/40 border border-slate-900/60 rounded-xl py-2.5 pl-10 pr-4 text-sm text-slate-500 cursor-not-allowed select-none"
              />
            </div>
          </div>

          {/* Role Field (Disabled) */}
          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">
              Account Role
            </label>
            <div className="relative flex items-center">
              <div className="absolute left-3 text-slate-500">
                <FaShieldAlt className="text-sm" />
              </div>
              <div className="w-full bg-slate-950/40 border border-slate-900/60 rounded-xl py-2.5 pl-10 pr-4 text-sm text-slate-500 select-none flex items-center justify-between">
                <span className="capitalize">{user.role}</span>
                <span className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full border ${
                  user.role === "admin" 
                    ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" 
                    : "bg-slate-800/40 text-slate-400 border-slate-800"
                }`}>
                  {user.role}
                </span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          {isEditing && (
            <div className="flex gap-3 pt-3">
              <button
                type="button"
                onClick={handleCancel}
                className="flex-1 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold py-2.5 rounded-xl text-xs transition duration-200 cursor-pointer text-center"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 bg-gradient-to-r from-emerald-500 to-teal-600 hover:opacity-90 disabled:opacity-50 text-white font-bold py-2.5 rounded-xl text-xs transition duration-200 cursor-pointer flex items-center justify-center gap-1.5"
              >
                {isSubmitting ? (
                  <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <FaSave />
                )}
                Save
              </button>
            </div>
          )}
        </form>
      </div>
    </div>,
    document.body
  );
};

export default ProfileModal;
