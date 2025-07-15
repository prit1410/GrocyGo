import React from 'react';
import { Star, Quote, TrendingUp, Shield, Zap } from 'lucide-react';

export const Testimonials = () => {
  const testimonials = [
    {
      name: "Sarah Chen",
      occupation: "Working Mom",
      avatar: "👩‍💼",
      rating: 5,
      text: "GrocyGo helped me reduce food waste by 60%! I finally have control over my grocery spending.",
      savings: "₹2,000/month",
      verified: true
    },
    {
      name: "Raj Patel",
      occupation: "Software Engineer",
      avatar: "👨‍💻",
      rating: 5,
      text: "The AI meal suggestions are incredible. It's like having a personal chef who knows exactly what's in my fridge.",
      savings: "₹1,500/month",
      verified: true
    },
    {
      name: "Priya Sharma",
      occupation: "Nutritionist",
      avatar: "👩‍⚕️",
      rating: 5,
      text: "As a nutritionist, I love how GrocyGo promotes healthy eating while reducing waste. It's a game-changer!",
      savings: "₹1,800/month",
      verified: true
    }
  ];

  return (
    <section className="relative min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 overflow-hidden py-24">
      {/* Futuristic Grid Background */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute inset-0" style={{
          backgroundImage: `
            linear-gradient(rgba(20, 184, 166, 0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(20, 184, 166, 0.1) 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px'
        }}></div>
      </div>

      {/* Animated Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-72 h-72 bg-teal-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-40 right-20 w-96 h-96 bg-orange-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute bottom-20 left-1/3 w-64 h-64 bg-teal-500/10 rounded-full blur-2xl animate-pulse delay-2000"></div>
        
        {/* Floating Particles */}
        <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-teal-400 rounded-full animate-ping"></div>
        <div className="absolute top-1/3 right-1/3 w-1 h-1 bg-orange-400 rounded-full animate-ping delay-1000"></div>
        <div className="absolute bottom-1/4 left-1/2 w-1.5 h-1.5 bg-teal-300 rounded-full animate-ping delay-2000"></div>
      </div>

      <div className="relative z-10 container mx-auto px-6">
        <div className="text-center mb-16">
          {/* Status Badge */}
          <div className="inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-teal-500/20 to-orange-500/20 backdrop-blur-xl border border-teal-500/30 rounded-full mb-6">
            <Shield className="w-5 h-5 text-teal-400 animate-pulse" />
            <span className="text-teal-300 font-bold text-sm tracking-wider uppercase">VERIFIED TESTIMONIALS</span>
          </div>
          
          <div className="space-y-6">
            <h2 className="text-6xl lg:text-8xl font-black text-white leading-none tracking-tight">
              LOVED BY
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 via-teal-300 to-orange-400 animate-pulse">
                THOUSANDS
              </span>
            </h2>
            
            <div className="space-y-4">
              <p className="text-2xl lg:text-3xl font-bold text-gray-300 leading-tight">
                Real Users. Real Results. Real Impact.
              </p>
              
              <p className="text-lg text-gray-400 leading-relaxed max-w-3xl mx-auto font-light">
                Join the community of smart shoppers who've transformed their grocery experience.
              </p>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="group relative p-8 bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-2xl rounded-3xl border border-teal-500/30 shadow-2xl shadow-teal-500/20 hover:shadow-teal-500/40 transition-all duration-500 hover:scale-105 hover:-translate-y-2"
            >
              {/* Verified Badge */}
              {testimonial.verified && (
                <div className="absolute top-4 right-4 px-2 py-1 bg-gradient-to-r from-green-600 to-green-700 text-white text-xs font-bold rounded-lg tracking-wider flex items-center gap-1">
                  <Shield className="w-3 h-3" />
                  VERIFIED
                </div>
              )}

              {/* Quote Icon */}
              <div className="absolute top-6 right-6 opacity-10 group-hover:opacity-20 transition-opacity duration-300">
                <Quote className="w-12 h-12 text-teal-400" />
              </div>

              {/* Holographic Effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-teal-500/10 via-transparent to-orange-500/10 rounded-3xl"></div>
              <div className="absolute inset-0 border border-teal-400/20 rounded-3xl animate-pulse"></div>

              <div className="relative z-10">
                {/* Avatar */}
                <div className="mb-6">
                  <div className="w-16 h-16 bg-gradient-to-br from-teal-400 to-orange-400 rounded-2xl flex items-center justify-center text-2xl shadow-lg shadow-teal-500/30 group-hover:scale-110 transition-transform duration-300 border border-teal-300/50">
                    {testimonial.avatar}
                  </div>
                </div>

                {/* Rating */}
                <div className="flex gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-current animate-pulse" style={{ animationDelay: `${i * 0.1}s` }} />
                  ))}
                </div>

                {/* Testimonial Text */}
                <p className="text-gray-300 leading-relaxed mb-6 text-lg font-light">
                  "{testimonial.text}"
                </p>

                {/* Savings Badge */}
                <div className="mb-4">
                  <span className="inline-flex items-center gap-2 px-3 py-1 bg-gradient-to-r from-green-500/20 to-green-600/20 text-green-300 rounded-full text-sm font-bold border border-green-500/30">
                    <TrendingUp className="w-4 h-4" />
                    Saves {testimonial.savings}
                  </span>
                </div>

                {/* Author Info */}
                <div className="border-t border-teal-500/20 pt-4">
                  <h4 className="font-black text-white tracking-wide">{testimonial.name}</h4>
                  <p className="text-gray-400 text-sm font-light">{testimonial.occupation}</p>
                </div>

                {/* Tech Corners */}
                <div className="absolute top-2 left-2 w-6 h-6 border-l-2 border-t-2 border-teal-300/50 rounded-tl-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="absolute bottom-2 right-2 w-6 h-6 border-r-2 border-b-2 border-orange-300/50 rounded-br-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>

              {/* Scanning Line */}
              <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-teal-400 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 animate-pulse"></div>
            </div>
          ))}
        </div>

        {/* Stats Section */}
        <div className="mt-20">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { number: "50K+", label: "Happy Users", icon: <Zap className="w-6 h-6" /> },
              { number: "₹2M+", label: "Total Savings", icon: <TrendingUp className="w-6 h-6" /> },
              { number: "80%", label: "Waste Reduction", icon: <Shield className="w-6 h-6" /> },
              { number: "4.9★", label: "App Rating", icon: <Star className="w-6 h-6" /> }
            ].map((stat, index) => (
              <div key={index} className="text-center p-6 bg-gradient-to-br from-slate-800/60 to-slate-900/60 backdrop-blur-xl rounded-2xl border border-teal-500/20 shadow-lg shadow-teal-500/10">
                <div className="flex justify-center mb-3 text-teal-400">
                  {stat.icon}
                </div>
                <div className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-orange-400 mb-2">
                  {stat.number}
                </div>
                <div className="text-gray-300 font-medium text-sm tracking-wide">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Gradient */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-slate-900 to-transparent"></div>
    </section>
  );
};