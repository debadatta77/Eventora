import React from "react";
import { Link } from "react-router-dom";
import { FaTimesCircle, FaArrowLeft } from "react-icons/fa";

const PaymentFailed = () => {
  return (
    <div className="min-h-[75vh] flex flex-col items-center justify-center p-4">
      <div className="bg-white p-10 rounded-3xl shadow-2xl shadow-rose-500/10 max-w-md w-full text-center border border-gray-100 relative overflow-hidden animate-slideIn">
        
        {/* Popping Times Circle container */}
        <div className="w-24 h-24 bg-rose-50 rounded-full flex items-center justify-center mx-auto mb-6 border border-rose-100">
          <FaTimesCircle className="text-rose-500 text-5xl drop-shadow-sm animate-pulse-slow" />
        </div>
        
        <h1 className="text-3xl font-black text-gray-900 mb-3 tracking-tight">
          Booking Failed
        </h1>
        <p className="text-gray-500 mb-8 text-sm leading-relaxed max-w-[320px] mx-auto font-medium">
          We couldn't process your payment. Please ensure your payment details are correct and try again.
        </p>

        <div className="space-y-3.5">
          <Link
            to="/"
            className="flex items-center justify-center gap-2 w-full bg-rose-500 hover:bg-rose-600 text-white font-bold py-4 px-6 rounded-xl transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5 duration-200 cursor-pointer text-sm"
          >
            <FaArrowLeft className="text-xs" />
            <span>Return to Events</span>
          </Link>
          <Link
            to="/dashboard"
            className="block w-full bg-gray-100 hover:bg-gray-250 text-gray-700 font-bold py-4 px-6 rounded-xl transition duration-200 text-sm cursor-pointer"
          >
            Go to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PaymentFailed;
