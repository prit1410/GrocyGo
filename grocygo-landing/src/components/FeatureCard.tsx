import React from "react";

interface FeatureCardProps {
  image: string;
  title: string;
  desc: string;
}

export const FeatureCard: React.FC<FeatureCardProps> = ({ image, title, desc }) => (
  <div className="rounded-3xl shadow-xl hover:scale-105 transition-transform duration-300 p-8 flex flex-col items-center text-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 border border-teal-500/20">
    <div className="bg-gradient-to-br from-teal-500/10 to-orange-500/10 rounded-2xl p-3 mb-4 flex items-center justify-center">
      <img src={image} alt={title} className="w-20 h-20 object-contain" />
    </div>
    <h3 className="text-xl font-bold mb-2 text-white drop-shadow-lg">{title}</h3>
    <p className="text-gray-300 text-base font-light">{desc}</p>
  </div>
);
