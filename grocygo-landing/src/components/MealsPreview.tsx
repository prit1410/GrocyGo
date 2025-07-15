
import React from "react";

export const MealsPreview = () => (
  <section className="py-16 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
    <div className="container mx-auto grid md:grid-cols-2 gap-12 items-center px-6">
      <div className="rounded-3xl shadow-xl border border-teal-500/20 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-8 flex flex-col items-center">
        <img
          src="meals-preview.png"
          alt="Meals Preview"
          className="w-full max-w-md mx-auto rounded-xl shadow-xl hover:scale-105 transition-transform duration-300"
        />
      </div>
      <div className="rounded-3xl shadow-xl border border-teal-500/20 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-8">
        <h2 className="text-4xl font-bold mb-4 text-white drop-shadow-lg">Meal Planning Made Easy</h2>
        <p className="text-lg text-gray-300 mb-6">Preview your week, get AI-powered suggestions, and plan meals with a single click. Save time, reduce waste, and eat better!</p>
        <button className="px-6 py-3 bg-teal-600 text-white rounded-xl shadow-xl hover:scale-105 transition-transform duration-300">Plan Meals Now</button>
      </div>
    </div>
  </section>
);
