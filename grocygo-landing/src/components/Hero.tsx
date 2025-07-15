import React from 'react';
import {Smartphone, Play, Download, Zap } from 'lucide-react';

// Add TypeScript support for the custom element 'dotlottie-player'
declare global {
  namespace JSX {
    interface IntrinsicElements {
      'dotlottie-player': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & {
        src?: string;
        background?: string;
        speed?: string | number;
        loop?: boolean;
        autoplay?: boolean;
        style?: React.CSSProperties;
      };
    }
  }
}

export const Hero = () => {
  return (
    <section className="relative min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 overflow-hidden pt-4">
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

      <div className="relative z-10 container mx-auto px-6 py-6">
        <div className="grid grid-cols-1 md:grid-cols-2 items-center px-6 py-16 gap-12">
          <div className="space-y-6 order-2 md:order-1">
            <div className="inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-teal-500/20 to-orange-500/20 backdrop-blur-xl border border-teal-500/30 rounded-full">
              <div className="w-2 h-2 bg-teal-400 rounded-full animate-pulse"></div>
              <span className="text-teal-300 font-medium text-sm tracking-wide">NEXT-GEN GROCERY MANAGEMENT</span>
            </div>
            <h1 className="text-6xl lg:text-8xl font-black text-white leading-none tracking-tight">
              GROCERY<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 via-teal-300 to-orange-400 animate-pulse">REIMAGINED</span>
            </h1>
            <div className="space-y-4">
              <p className="text-2xl lg:text-3xl font-bold text-gray-300 leading-tight">Plan Smart. Shop Less. Eat Better.</p>
              <p className="text-lg text-gray-400 leading-relaxed max-w-lg font-light">Experience the future of intelligent grocery management with AI-powered planning, predictive analytics, and seamless automation.</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <button className="group relative px-8 py-4 bg-gradient-to-r from-teal-500 to-teal-600 text-white rounded-2xl font-bold text-lg shadow-2xl hover:shadow-teal-500/25 transition-all duration-300 hover:scale-105 overflow-hidden border border-teal-400/50">
                <div className="absolute inset-0 bg-gradient-to-r from-teal-400 to-teal-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="relative flex items-center gap-3">
                  <Play className="w-5 h-5" />
                  <span className="tracking-wide">LAUNCH DEMO</span>
                </div>
                <div className="absolute inset-0 border border-teal-300/50 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </button>
              <button className="group relative px-8 py-4 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-2xl font-bold text-lg shadow-2xl hover:shadow-orange-500/25 transition-all duration-300 hover:scale-105 overflow-hidden border border-orange-400/50">
                <div className="absolute inset-0 bg-gradient-to-r from-orange-400 to-orange-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="relative flex items-center gap-3">
                  <Download className="w-5 h-5" />
                  <span className="tracking-wide">GET APP</span>
                </div>
                <div className="absolute inset-0 border border-orange-300/50 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </button>
            </div>
            <div className="flex items-center gap-8 pt-8">
              <div className="text-center">
                <div className="text-2xl font-black text-teal-400">50K+</div>
                <div className="text-xs text-gray-500 uppercase tracking-wider">Users</div>
              </div>
              <div className="w-px h-8 bg-gray-700"></div>
              <div className="text-center">
                <div className="text-2xl font-black text-orange-400">99.5%</div>
                <div className="text-xs text-gray-500 uppercase tracking-wider">Accuracy</div>
              </div>
              <div className="w-px h-8 bg-gray-700"></div>
              <div className="text-center">
                <div className="text-2xl font-black text-teal-400">AI</div>
                <div className="text-xs text-gray-500 uppercase tracking-wider">Powered</div>
              </div>
            </div>
          </div>
          <div className="flex justify-center md:justify-end order-1 md:order-2">
            <div className="relative w-96 h-96 bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-2xl rounded-3xl border border-teal-500/30 shadow-2xl shadow-teal-500/20 animate-float flex items-center justify-center">
              <div className="absolute inset-0 bg-gradient-to-br from-teal-500/10 via-transparent to-orange-500/10 rounded-3xl"></div>
              <div className="absolute inset-0 border border-teal-400/20 rounded-3xl animate-pulse"></div>
              <img src="grocery-cart.png" alt="Grocery Cart" style={{ width: '320px', height: '320px' }} className="relative z-10" />
              {/* Corner Accents */}
              <div className="absolute top-4 left-4 w-8 h-8 border-l-2 border-t-2 border-teal-400 rounded-tl-lg"></div>
              <div className="absolute top-4 right-4 w-8 h-8 border-r-2 border-t-2 border-teal-400 rounded-tr-lg"></div>
              <div className="absolute bottom-4 left-4 w-8 h-8 border-l-2 border-b-2 border-orange-400 rounded-bl-lg"></div>
              <div className="absolute bottom-4 right-4 w-8 h-8 border-r-2 border-b-2 border-orange-400 rounded-br-lg"></div>
              {/* Floating Tech Elements */}
              <div className="absolute -top-6 -right-6 w-16 h-16 bg-gradient-to-br from-orange-400 to-orange-500 rounded-2xl flex items-center justify-center shadow-lg shadow-orange-500/30 animate-bounce border border-orange-300/50">
                <Smartphone className="w-8 h-8 text-white" />
              </div>
              <div className="absolute -bottom-4 -left-4 w-12 h-12 bg-gradient-to-br from-teal-400 to-teal-500 rounded-xl flex items-center justify-center shadow-lg shadow-teal-500/30 animate-pulse border border-teal-300/50">
                <Zap className="w-6 h-6 text-white" />
              </div>
              {/* Orbiting Data Points */}
              <div className="absolute inset-0 animate-spin-slow">
                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-4 h-4 bg-gradient-to-r from-teal-400 to-teal-500 rounded-full shadow-lg shadow-teal-500/50 border border-teal-300/50"></div>
                <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2 w-3 h-3 bg-gradient-to-r from-orange-400 to-orange-500 rounded-full shadow-lg shadow-orange-500/50 border border-orange-300/50"></div>
                <div className="absolute top-1/2 left-0 transform -translate-x-1/2 -translate-y-1/2 w-2 h-2 bg-gradient-to-r from-teal-300 to-orange-300 rounded-full shadow-lg"></div>
                <div className="absolute top-1/2 right-0 transform translate-x-1/2 -translate-y-1/2 w-3 h-3 bg-gradient-to-r from-orange-300 to-teal-300 rounded-full shadow-lg"></div>
              </div>
              {/* Scanning Lines */}
              <div className="absolute inset-0 overflow-hidden rounded-3xl">
                <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-teal-400 to-transparent animate-pulse"></div>
                <div className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-orange-400 to-transparent animate-pulse delay-1000"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
      </section>
  );
};