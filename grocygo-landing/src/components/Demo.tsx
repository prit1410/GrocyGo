import React, { useState } from 'react';
import { Smartphone, ChevronLeft, ChevronRight, Play, Zap } from 'lucide-react';

export const Demo = () => {
  const [currentScreen, setCurrentScreen] = useState(0);
  
  const screens = [
    {
      title: "SMART DASHBOARD",
      description: "Overview of your inventory, upcoming meals, and shopping lists",
      bgColor: "from-teal-500 to-teal-600",
      tech: "REAL-TIME"
    },
    {
      title: "INVENTORY MANAGER",
      description: "Track what you have, quantities, and expiry dates",
      bgColor: "from-blue-500 to-blue-600",
      tech: "AI-POWERED"
    },
    {
      title: "AI RECIPE ENGINE",
      description: "Personalized meal ideas based on available ingredients",
      bgColor: "from-purple-500 to-purple-600",
      tech: "NEURAL NET"
    },
    {
      title: "QUANTUM SHOPPING",
      description: "Auto-generated lists based on your meal plans and inventory",
      bgColor: "from-orange-500 to-orange-600",
      tech: "PREDICTIVE"
    }
  ];

  const nextScreen = () => {
    setCurrentScreen((prev) => (prev + 1) % screens.length);
  };

  const prevScreen = () => {
    setCurrentScreen((prev) => (prev - 1 + screens.length) % screens.length);
  };

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
            <Play className="w-5 h-5 text-teal-400 animate-pulse" />
            <span className="text-teal-300 font-bold text-sm tracking-wider uppercase">LIVE DEMONSTRATION</span>
          </div>
          
          <div className="space-y-6">
            <h2 className="text-6xl lg:text-8xl font-black text-white leading-none tracking-tight">
              SEE GROCYGO IN
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 via-teal-300 to-orange-400 animate-pulse">
                ACTION
              </span>
            </h2>
            
            <div className="space-y-4">
              <p className="text-2xl lg:text-3xl font-bold text-gray-300 leading-tight">
                Experience The Future Interface
              </p>
              
              <p className="text-lg text-gray-400 leading-relaxed max-w-3xl mx-auto font-light">
                Experience the intuitive interface that makes grocery management effortless and enjoyable.
              </p>
            </div>
          </div>
        </div>

        <div className="flex justify-center items-center">
          <div className="relative">
            {/* Holographic Phone Frame */}
            <div className="relative w-80 h-[600px] bg-gradient-to-br from-slate-800/90 to-slate-900/90 backdrop-blur-2xl rounded-[3rem] p-4 shadow-2xl shadow-teal-500/20 border border-teal-500/30">
              {/* Holographic Effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-teal-500/10 to-orange-500/10 rounded-[3rem]"></div>
              <div className="absolute inset-0 border border-teal-400/20 rounded-[3rem] animate-pulse"></div>
              
              {/* Screen */}
              <div className="relative z-10 w-full h-full bg-gradient-to-br from-slate-900/95 to-slate-800/95 backdrop-blur-xl rounded-[2rem] overflow-hidden border border-teal-500/20">
                {/* Status Bar */}
                <div className="h-8 bg-gradient-to-r from-slate-800/80 to-slate-900/80 backdrop-blur-lg flex items-center justify-between px-6 text-xs font-bold text-teal-300 border-b border-teal-500/20">
                  <span>9:41</span>
                  <div className="flex items-center gap-1">
                    <div className="w-1 h-1 bg-teal-400 rounded-full animate-pulse"></div>
                    <span>100%</span>
                  </div>
                </div>
                
                {/* Screen Content */}
                <div className={`h-full bg-gradient-to-br ${screens[currentScreen].bgColor} relative overflow-hidden`}>
                  <div className="absolute inset-0 bg-black/20"></div>
                  
                  {/* Tech Badge */}
                  <div className="absolute top-4 right-4 px-2 py-1 bg-gradient-to-r from-gray-800 to-gray-900 text-white text-xs font-bold rounded-lg tracking-wider">
                    {screens[currentScreen].tech}
                  </div>
                  
                  <div className="relative z-10 p-6 text-white">
                    <h3 className="text-2xl font-black mb-2 tracking-wider">{screens[currentScreen].title}</h3>
                    <p className="text-white/80 text-sm leading-relaxed font-light">{screens[currentScreen].description}</p>
                    
                    {/* Mock UI Elements */}
                    <div className="mt-8 space-y-4">
                      <div className="bg-white/20 backdrop-blur-lg rounded-xl p-4 border border-white/10">
                        <div className="h-4 bg-white/30 rounded w-3/4 mb-2"></div>
                        <div className="h-3 bg-white/20 rounded w-1/2"></div>
                      </div>
                      <div className="bg-white/20 backdrop-blur-lg rounded-xl p-4 border border-white/10">
                        <div className="h-4 bg-white/30 rounded w-2/3 mb-2"></div>
                        <div className="h-3 bg-white/20 rounded w-3/4"></div>
                      </div>
                      <div className="bg-white/20 backdrop-blur-lg rounded-xl p-4 border border-white/10">
                        <div className="h-4 bg-white/30 rounded w-1/2 mb-2"></div>
                        <div className="h-3 bg-white/20 rounded w-2/3"></div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Floating Elements */}
                  <div className="absolute top-20 right-4 w-8 h-8 bg-white/30 rounded-full animate-float border border-white/20"></div>
                  <div className="absolute bottom-32 left-4 w-6 h-6 bg-white/20 rounded-full animate-float delay-1000 border border-white/10"></div>
                  
                  {/* Scanning Lines */}
                  <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-white/50 to-transparent animate-pulse"></div>
                </div>
              </div>
              
              {/* Home Indicator */}
              <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 w-32 h-1 bg-teal-400/50 rounded-full"></div>
              
              {/* Corner Tech Elements */}
              <div className="absolute top-2 left-2 w-6 h-6 border-l-2 border-t-2 border-teal-400 rounded-tl-lg animate-pulse"></div>
              <div className="absolute bottom-2 right-2 w-6 h-6 border-r-2 border-b-2 border-orange-400 rounded-br-lg animate-pulse delay-1000"></div>
            </div>

            {/* Navigation Arrows */}
            <button
              onClick={prevScreen}
              className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-xl rounded-full flex items-center justify-center shadow-lg shadow-teal-500/20 hover:shadow-teal-500/40 transition-all duration-300 hover:scale-110 border border-teal-500/30"
            >
              <ChevronLeft className="w-6 h-6 text-teal-300" />
            </button>
            
            <button
              onClick={nextScreen}
              className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-xl rounded-full flex items-center justify-center shadow-lg shadow-teal-500/20 hover:shadow-teal-500/40 transition-all duration-300 hover:scale-110 border border-teal-500/30"
            >
              <ChevronRight className="w-6 h-6 text-teal-300" />
            </button>
          </div>
        </div>

        {/* Screen Indicators */}
        <div className="flex justify-center mt-8 gap-3">
          {screens.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentScreen(index)}
              className={`w-3 h-3 rounded-full transition-all duration-300 border ${
                index === currentScreen
                  ? 'bg-teal-400 border-teal-300 scale-125 shadow-lg shadow-teal-400/50'
                  : 'bg-gray-600 border-gray-500 hover:bg-gray-500'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Bottom Gradient */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-slate-900 to-transparent"></div>
    </section>
  );
};