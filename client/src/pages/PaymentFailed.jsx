import React from "react";
import { Link } from "react-router-dom";
import { FaTimesCircle, FaArrowLeft } from "react-icons/fa";

const PaymentFailed = () => {
  return (
    <div className="min-h-[75vh] flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Glow Blob */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-rose-500/5 rounded-full blur-3xl -z-10" />

      <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-800/80 p-10 rounded-3xl shadow-2xl max-w-md w-full text-center relative overflow-hidden animate-slideIn">
        
        {/* Popping Times Circle container */}
        <div className="w-24 h-24 bg-rose-500/10 rounded-full flex items-center justify-center mx-auto mb-6 border border-rose-500/20 animate-pulse">
          <FaTimesCircle className="text-rose-400 text-5xl drop-shadow-[0_0_8px_rgba(244,63,94,0.3)]" />
        </div>
        
        <h1 className="text-3xl font-black text-white mb-3 tracking-tight">
          Booking Failed
        </h1>
        <p className="text-slate-400 mb-8 text-sm leading-relaxed max-w-[320px] mx-auto font-medium">
          We couldn't process your payment. Please ensure your payment details are correct and try again.
        </p>

        <div className="space-y-3.5">
          <Link
            to="/"
            className="flex items-center justify-center gap-2 w-full bg-rose-600 hover:bg-rose-500 text-white font-bold py-4 px-6 rounded-xl transition-all shadow-lg shadow-rose-500/10 hover:-translate-y-0.5 duration-200 cursor-pointer text-sm"
          >
            <FaArrowLeft className="text-xs" />
            <span>Return to Events</span>
          </Link>
          <Link
            to="/dashboard"
            className="block w-full bg-slate-950 border border-slate-800 text-white hover:border-emerald-500/30 font-bold py-4 px-6 rounded-xl transition duration-200 text-sm cursor-pointer"
          >
            Go to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PaymentFailed;
