import React from 'react';
import { Brain, ShoppingCart, BarChart3, Bell, Heart, Sparkles, Zap, Shield, CheckCircle } from 'lucide-react';

export const Solution = () => {
  const features = [
    {
      icon: <BarChart3 className="w-8 h-8" />,
      title: "SMART INVENTORY",
      description: "Real-time tracking with predictive analytics and automated alerts.",
      color: "from-teal-500 to-teal-600",
      tech: "AI-POWERED",
      statusCode: "200 OK"
    },
    {
      icon: <Brain className="w-8 h-8" />,
      title: "NEURAL MEAL PLANNER",
      description: "Advanced AI that learns your preferences and optimizes nutrition.",
      color: "from-purple-500 to-purple-600",
      tech: "MACHINE LEARNING",
      statusCode: "200 OK"
    },
    {
      icon: <ShoppingCart className="w-8 h-8" />,
      title: "QUANTUM SHOPPING LISTS",
      description: "Self-updating lists that predict needs before you realize them.",
      color: "from-blue-500 to-blue-600",
      tech: "PREDICTIVE",
      statusCode: "200 OK"
    },
    {
      icon: <BarChart3 className="w-8 h-8" />,
      title: "FINANCIAL ANALYTICS",
      description: "Deep insights into spending patterns with optimization suggestions.",
      color: "from-green-500 to-green-600",
      tech: "ANALYTICS",
      statusCode: "200 OK"
    },
    {
      icon: <Bell className="w-8 h-8" />,
      title: "INTELLIGENT ALERTS",
      description: "Context-aware notifications that adapt to your lifestyle.",
      color: "from-orange-500 to-orange-600",
      tech: "ADAPTIVE",
      statusCode: "200 OK"
    },
    {
      icon: <Heart className="w-8 h-8" />,
      title: "WELLNESS ENGINE",
      description: "Personalized health optimization through smart nutrition tracking.",
      color: "from-pink-500 to-pink-600",
      tech: "HEALTH-FOCUSED",
      statusCode: "200 OK"
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
        
        {/* Floating Success Particles */}
        <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-teal-400 rounded-full animate-ping"></div>
        <div className="absolute top-1/3 right-1/3 w-1 h-1 bg-orange-400 rounded-full animate-ping delay-1000"></div>
        <div className="absolute bottom-1/4 left-1/2 w-1.5 h-1.5 bg-teal-300 rounded-full animate-ping delay-2000"></div>
      </div>

      <div className="relative z-10 container mx-auto px-6">
        <div className="text-center mb-16">
          {/* Status Badge */}
          <div className="inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-teal-500/20 to-orange-500/20 backdrop-blur-xl border border-teal-500/30 rounded-full mb-6">
            <div className="w-2 h-2 bg-teal-400 rounded-full animate-pulse"></div>
            <span className="text-teal-300 font-bold text-sm tracking-wider uppercase">NEXT-GEN SOLUTION</span>
          </div>
          
          <div className="space-y-6">
            <h2 className="text-6xl lg:text-8xl font-black text-white leading-none tracking-tight">
              INTRODUCING:
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 via-teal-300 to-orange-400 animate-pulse">
                GROCYGO 3.0
              </span>
            </h2>
            
            <div className="space-y-4">
              <p className="text-2xl lg:text-3xl font-bold text-gray-300 leading-tight">
                Revolutionary AI-Powered Automation
              </p>
              
              <p className="text-lg text-gray-400 leading-relaxed max-w-3xl mx-auto font-light">
                Revolutionary AI-powered grocery management that transforms chaos into intelligent automation. 
                Welcome to the future of food planning.
              </p>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <div
              key={index}
              className="group relative p-8 bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-2xl rounded-3xl border border-teal-500/30 shadow-2xl shadow-teal-500/20 hover:shadow-teal-500/40 transition-all duration-500 hover:scale-105 hover:-translate-y-2"
            >
              {/* Status Code Badge */}
              <div className="absolute top-4 right-4 px-2 py-1 bg-gradient-to-r from-green-600 to-green-700 text-white text-xs font-bold rounded-lg tracking-wider">
                {feature.statusCode}
              </div>

              {/* Holographic Background */}
              <div className="absolute inset-0 bg-gradient-to-br from-teal-500/10 via-transparent to-orange-500/10 rounded-3xl"></div>
              <div className="absolute inset-0 border border-teal-400/20 rounded-3xl animate-pulse"></div>
              
              <div className="relative z-10">
                <div className={`mb-6 p-4 bg-gradient-to-br ${feature.color} rounded-2xl w-fit text-white shadow-lg group-hover:scale-110 transition-transform duration-300 border border-white/20`}>
                  {feature.icon}
                </div>
                
                <h3 className="text-xl font-black text-white mb-4 tracking-tight">
                  {feature.title}
                </h3>
                
                <p className="text-gray-300 leading-relaxed font-light">
                  {feature.description}
                </p>

                {/* Tech Badge */}
                <div className="mt-4 px-3 py-1 bg-gradient-to-r from-gray-700 to-gray-800 text-teal-300 text-xs font-bold rounded-lg tracking-wider inline-block">
                  {feature.tech}
                </div>

                {/* Tech Corners */}
                <div className="absolute top-2 left-2 w-6 h-6 border-l-2 border-t-2 border-teal-300/50 rounded-tl-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="absolute bottom-2 right-2 w-6 h-6 border-r-2 border-b-2 border-orange-300/50 rounded-br-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>

              {/* Scanning Line */}
              <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-teal-400 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 animate-pulse"></div>
              
              {/* Floating Sparkles */}
              <div className="absolute top-4 right-12 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <Sparkles className="w-4 h-4 text-teal-400 animate-pulse" />
              </div>
            </div>
          ))}
        </div>

        {/* Futuristic Showcase */}
        <div className="mt-20 text-center">
          <div className="relative inline-block">
            <div className="w-96 h-80 bg-gradient-to-br from-slate-800/80 to-teal-900/80 backdrop-blur-2xl rounded-3xl border border-teal-500/30 shadow-2xl shadow-teal-500/20 mx-auto relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-teal-500/10 to-orange-500/10 rounded-3xl"></div>
              
              {/* Holographic Interface */}
              <div className="absolute inset-0">
                <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-teal-400 rounded-full animate-ping"></div>
                <div className="absolute top-1/3 right-1/3 w-1 h-1 bg-orange-400 rounded-full animate-ping delay-1000"></div>
                <div className="absolute bottom-1/3 left-1/3 w-1.5 h-1.5 bg-teal-300 rounded-full animate-ping delay-2000"></div>
              </div>
              
              {/* Central Display */}
              <div className="relative z-10 flex items-center justify-center h-full">
                <div className="text-center">
                  <div className="text-4xl font-black text-teal-400 mb-2 tracking-wider">AI ACTIVE</div>
                  <div className="flex items-center justify-center gap-2 mb-4">
                    <CheckCircle className="w-6 h-6 text-teal-400 animate-pulse" />
                    <div className="text-gray-300 text-sm font-light">System Optimized</div>
                  </div>
                  <div className="text-6xl animate-bounce">🚀</div>
                </div>
              </div>
              
              {/* Tech Frame */}
              <div className="absolute top-4 left-4 w-8 h-8 border-l-2 border-t-2 border-teal-400 rounded-tl-lg animate-pulse"></div>
              <div className="absolute top-4 right-4 w-8 h-8 border-r-2 border-t-2 border-teal-400 rounded-tr-lg animate-pulse delay-500"></div>
              <div className="absolute bottom-4 left-4 w-8 h-8 border-l-2 border-b-2 border-orange-400 rounded-bl-lg animate-pulse delay-1000"></div>
              <div className="absolute bottom-4 right-4 w-8 h-8 border-r-2 border-b-2 border-orange-400 rounded-br-lg animate-pulse delay-1500"></div>
              
              {/* Scanning Lines */}
              <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-teal-400 to-transparent animate-pulse"></div>
              <div className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-orange-400 to-transparent animate-pulse delay-1000"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Gradient */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-slate-900 to-transparent"></div>
    </section>
  );
};