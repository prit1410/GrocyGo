
import React from "react";

export const TipsFrame = () => (
  <section className="py-12 px-6 flex justify-center items-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
    <div className="relative bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 border border-teal-500/20 shadow-xl rounded-3xl p-8 max-w-2xl w-full flex items-center">
      <img
        src="kitchen-frame.png"
        alt="Kitchen Frame"
        className="absolute left-0 top-1/2 -translate-y-1/2 w-32 h-32 object-contain -ml-36 drop-shadow-xl hidden md:block"
      />
      <div className="ml-0 md:ml-32">
        <div className="text-lg font-semibold text-white mb-2 drop-shadow-lg">Did you know?</div>
        <div className="text-gray-300 text-base italic">You can create a meal plan from leftover ingredients with one click!</div>
      </div>
    </div>
  </section>
);
