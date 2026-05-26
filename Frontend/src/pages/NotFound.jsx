// pages/NotFound.jsx

import React from "react";
import { Link } from "react-router-dom";
import { Home, ArrowLeft, Ghost } from "lucide-react";

function NotFound() {
  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-6 relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute w-[400px] h-[400px] bg-red-600/20 blur-3xl rounded-full top-[-100px] left-[-100px]" />
      <div className="absolute w-[300px] h-[300px] bg-zinc-700/20 blur-3xl rounded-full bottom-[-100px] right-[-100px]" />

      {/* Card */}
      <div className="relative z-10 w-full max-w-lg rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl p-10 shadow-2xl">
        {/* Icon */}
        <div className="flex justify-center mb-6">
          <div className="w-24 h-24 rounded-full bg-red-500/10 flex items-center justify-center border border-red-500/20">
            <Ghost className="text-red-500" size={45} />
          </div>
        </div>

        {/* 404 */}
        <h1 className="text-center text-7xl font-bold text-white tracking-tight">
          404
        </h1>

        <h2 className="mt-4 text-center text-2xl font-semibold text-zinc-200">
          Page Not Found
        </h2>

        <p className="mt-3 text-center text-zinc-400 leading-relaxed">
          The page you are looking for doesn&apos;t exist or may have been
          moved.
        </p>

        {/* Buttons */}
        <div className="mt-8 flex flex-col sm:flex-row gap-4">
          {/* Home */}
          <Link
            to="/"
            className="flex-1 flex items-center justify-center gap-2 h-12 rounded-2xl bg-red-600 hover:bg-red-700 text-white font-medium transition-all duration-300"
          >
            <Home size={18} />
            Go Home
          </Link>

          {/* Back */}
          <button
            onClick={() => window.history.back()}
            className="flex-1 flex items-center justify-center gap-2 h-12 rounded-2xl border border-white/10 bg-white/5 hover:bg-white/10 text-zinc-200 transition-all duration-300"
          >
            <ArrowLeft size={18} />
            Go Back
          </button>
        </div>
      </div>
    </div>
  );
}

export default NotFound;
