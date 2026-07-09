import React from "react";
import { Link } from "react-router-dom";
import { FaCheckCircle, FaArrowRight } from "react-icons/fa";

const PaymentSuccess = () => {
  return (
    <div className="min-h-[75vh] flex flex-col items-center justify-center p-4">
      <div className="bg-white p-10 rounded-3xl shadow-2xl shadow-emerald-500/10 max-w-md w-full text-center border border-gray-100 relative overflow-hidden animate-slideIn">
        
        {/* Popping Check Circle container */}
        <div className="w-24 h-24 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-6 border border-emerald-100 animate-pulse-slow">
          <FaCheckCircle className="text-emerald-500 text-5xl drop-shadow-sm" />
        </div>
        
        <h1 className="text-3xl font-black text-gray-900 mb-3 tracking-tight">
          Booking Confirmed!
        </h1>
        <p className="text-gray-500 mb-8 text-sm leading-relaxed max-w-[320px] mx-auto font-medium">
          Your ticket has been booked successfully. A confirmation pass and email has been dispatched to your registered email address.
        </p>

        <div className="space-y-3.5">
          <Link
            to="/dashboard"
            className="flex items-center justify-center gap-2 w-full bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-4 px-6 rounded-xl transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5 duration-200 cursor-pointer text-sm"
          >
            <span>View My Tickets</span>
            <FaArrowRight className="text-xs" />
          </Link>
          <Link
            to="/"
            className="block w-full bg-gray-100 hover:bg-gray-250 text-gray-700 font-bold py-4 px-6 rounded-xl transition duration-200 text-sm cursor-pointer"
          >
            Discover More Events
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccess;
