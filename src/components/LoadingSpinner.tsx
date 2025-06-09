import React from 'react';

// You can replace this with your own logo or a relevant agri icon from a CDN or local asset
const AGRI_LOGO =
  "https://cdn-icons-png.flaticon.com/512/2909/2909769.png"; // Example: a plant icon

const LEAF_ICON =
  "https://cdn-icons-png.flaticon.com/512/616/616494.png";

const LoadingSpinner = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-900 via-slate-900 to-emerald-950">
      <div className="flex flex-col items-center space-y-10">
        {/* Creative Spinner */}
        <div className="relative flex items-center justify-center" style={{ width: 180, height: 180 }}>
          {/* Main spinner ring */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-40 h-40 border-[10px] border-emerald-900 border-t-green-500 border-b-emerald-400 border-r-green-700 border-l-green-800 rounded-full animate-spin-slow"></div>
          </div>
          {/* Leaf icon (right) */}
          {/* <img
            src={LEAF_ICON}
            alt="Leaf"
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 w-12 h-12 drop-shadow-lg animate-bounce"
            style={{ animationDuration: '2s' }}
          /> */}
          {/* Agri logo (center) */}
          <img
            src={AGRI_LOGO}
            alt="AgriTech Logo"
            className="w-28 h-28 rounded-full shadow-xl border-8 border-green-600 bg-white p-3 animate-pulse"
            style={{ zIndex: 2 }}
          />
        </div>
        {/* Animated dots */}
        <div className="flex items-center space-x-3">
          <div className="w-4 h-4 bg-green-600 rounded-full animate-bounce"></div>
          <div className="w-4 h-4 bg-emerald-500 rounded-full animate-bounce" style={{ animationDelay: '0.15s' }}></div>
          <div className="w-4 h-4 bg-green-800 rounded-full animate-bounce" style={{ animationDelay: '0.3s' }}></div>
        </div>
        {/* Loading text */}
        <p className="text-emerald-300 text-2xl font-bold flex items-center gap-3">
          <svg className="w-8 h-8 text-green-500 animate-spin" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
          </svg>
          Loading EcoClime...
        </p>
      </div>
      {/* Custom slow spin animation */}
      <style>
        {`
          .animate-spin-slow {
            animation: spin 2.5s linear infinite;
          }
        `}
      </style>
    </div>
  );
};

export default LoadingSpinner;
