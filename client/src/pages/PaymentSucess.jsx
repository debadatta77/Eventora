import React from "react";
import { Link } from "react-router-dom";
import { FaCheckCircle, FaArrowRight } from "react-icons/fa";

const PaymentSuccess = () => {
  return (
    <div className="min-h-[75vh] flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Glow Blob */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl -z-10" />

      <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-800/80 p-10 rounded-3xl shadow-2xl max-w-md w-full text-center relative overflow-hidden animate-slideIn">
        
        {/* Popping Check Circle container */}
        <div className="w-24 h-24 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto mb-6 border border-emerald-500/20 animate-pulse">
          <FaCheckCircle className="text-emerald-400 text-5xl drop-shadow-[0_0_8px_rgba(52,211,153,0.3)]" />
        </div>
        
        <h1 className="text-3xl font-black text-white mb-3 tracking-tight">
          Booking Confirmed!
        </h1>
        <p className="text-slate-400 mb-8 text-sm leading-relaxed max-w-[320px] mx-auto font-medium">
          Your ticket has been booked successfully. A confirmation pass and email has been dispatched to your registered email address.
        </p>

        <div className="space-y-3.5">
          <Link
            to="/dashboard"
            className="flex items-center justify-center gap-2 w-full bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white font-bold py-4 px-6 rounded-xl transition-all shadow-lg shadow-emerald-500/10 hover:shadow-emerald-500/20 hover:-translate-y-0.5 duration-200 cursor-pointer text-sm"
          >
            <span>View My Tickets</span>
            <FaArrowRight className="text-xs" />
          </Link>
          <Link
            to="/"
            className="block w-full bg-slate-950 border border-slate-800 text-white hover:border-emerald-500/30 font-bold py-4 px-6 rounded-xl transition duration-200 text-sm cursor-pointer"
          >
            Discover More Events
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccess;
