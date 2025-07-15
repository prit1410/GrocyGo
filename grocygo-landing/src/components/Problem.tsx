import React from 'react';
import { Frown, AlertTriangle, RefreshCw, Clock, ShoppingBag, Zap, X } from 'lucide-react';

export const Problem = () => {
  const problems = [
    {
      icon: <Frown className="w-8 h-8" />,
      title: "FORGOTTEN INGREDIENTS",
      description: "Standing in the kitchen, recipe in hand, missing that one crucial ingredient.",
      severity: "high",
      errorCode: "ERR_404"
    },
    {
      icon: <AlertTriangle className="w-8 h-8" />,
      title: "FOOD WASTE CRISIS",
      description: "Discovering expired items hidden in the back of your fridge, again.",
      severity: "critical",
      errorCode: "ERR_500"
    },
    {
      icon: <RefreshCw className="w-8 h-8" />,
      title: "DUPLICATE PURCHASES",
      description: "Purchasing items you already have because you forgot what's at home.",
      severity: "medium",
      errorCode: "ERR_409"
    },
    {
      icon: <Clock className="w-8 h-8" />,
      title: "NO MEAL PLANNING",
      description: "Last-minute grocery runs and impulse purchases that blow your budget.",
      severity: "high",
      errorCode: "ERR_408"
    },
    {
      icon: <ShoppingBag className="w-8 h-8" />,
      title: "INVENTORY CHAOS",
      description: "No clear picture of what's in stock, what's running low, or what's expired.",
      severity: "critical",
      errorCode: "ERR_503"
    }
  ];

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'from-red-500 to-red-600';
      case 'high': return 'from-orange-500 to-orange-600';
      case 'medium': return 'from-yellow-500 to-yellow-600';
      default: return 'from-gray-500 to-gray-600';
    }
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
            <div className="w-2 h-2 bg-teal-400 rounded-full animate-pulse"></div>
            <span className="text-teal-300 font-bold text-sm tracking-wider uppercase">SYSTEM ANALYSIS</span>
          </div>
          
          <div className="space-y-6">
            <h2 className="text-6xl lg:text-8xl font-black text-white leading-none tracking-tight">
              CURRENT STATE:
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 via-teal-300 to-orange-400 animate-pulse">
                INEFFICIENT
              </span>
            </h2>
            
            <div className="space-y-4">
              <p className="text-2xl lg:text-3xl font-bold text-gray-300 leading-tight">
                System Errors Detected. Optimization Required.
              </p>
              
              <p className="text-lg text-gray-400 leading-relaxed max-w-3xl mx-auto font-light">
                Traditional grocery management creates friction, waste, and frustration. 
                The system is broken. Time for an upgrade.
              </p>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {problems.map((problem, index) => (
            <div
              key={index}
              className="group relative p-8 bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-2xl rounded-3xl border border-teal-500/30 shadow-2xl shadow-teal-500/20 hover:shadow-teal-500/40 transition-all duration-500 hover:scale-105 hover:-translate-y-2"
            >
              {/* Error Code Badge */}
              <div className="absolute top-4 right-4 px-2 py-1 bg-gradient-to-r from-red-600 to-red-700 text-white text-xs font-bold rounded-lg tracking-wider">
                {problem.errorCode}
              </div>

              {/* Holographic Effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-teal-500/10 via-transparent to-orange-500/10 rounded-3xl"></div>
              <div className="absolute inset-0 border border-teal-400/20 rounded-3xl animate-pulse"></div>
              
              <div className="relative z-10">
                <div className={`mb-6 p-4 bg-gradient-to-br ${getSeverityColor(problem.severity)} rounded-2xl w-fit text-white shadow-lg group-hover:scale-110 transition-transform duration-300 border border-white/20`}>
                  {problem.icon}
                </div>
                
                <h3 className="text-xl font-black text-white mb-4 tracking-tight">
                  {problem.title}
                </h3>
                
                <p className="text-gray-300 leading-relaxed font-light">
                  {problem.description}
                </p>

                {/* Tech Corners */}
                <div className="absolute top-2 left-2 w-6 h-6 border-l-2 border-t-2 border-teal-300/50 rounded-tl-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="absolute bottom-2 right-2 w-6 h-6 border-r-2 border-b-2 border-orange-300/50 rounded-br-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>

              {/* Scanning Line */}
              <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-teal-400 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 animate-pulse"></div>
            </div>
          ))}
        </div>

        {/* Error State Visualization */}
        <div className="mt-20 text-center">
          <div className="relative inline-block">
            <div className="w-96 h-80 bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-2xl rounded-3xl border border-teal-500/30 shadow-2xl shadow-teal-500/20 mx-auto relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-teal-500/10 to-orange-500/10 rounded-3xl"></div>
              
              {/* Glitch Lines */}
              <div className="absolute inset-0">
                <div className="absolute top-1/4 left-0 w-full h-0.5 bg-teal-400 animate-pulse"></div>
                <div className="absolute top-1/2 left-0 w-full h-0.5 bg-orange-400 animate-pulse delay-500"></div>
                <div className="absolute top-3/4 left-0 w-full h-0.5 bg-teal-400 animate-pulse delay-1000"></div>
              </div>
              
              <div className="relative z-10 flex items-center justify-center h-full">
                <div className="text-center">
                  <div className="text-4xl font-black text-teal-400 mb-2 tracking-wider">SYSTEM ERROR</div>
                  <div className="flex items-center justify-center gap-2 mb-4">
                    <X className="w-6 h-6 text-teal-400 animate-pulse" />
                    <div className="text-gray-300 text-sm font-light">Traditional methods failing...</div>
                  </div>
                  <div className="text-6xl animate-bounce">⚠️</div>
                </div>
              </div>
              
              {/* Tech Frame */}
              <div className="absolute top-4 left-4 w-8 h-8 border-l-2 border-t-2 border-teal-400 rounded-tl-lg animate-pulse"></div>
              <div className="absolute top-4 right-4 w-8 h-8 border-r-2 border-t-2 border-teal-400 rounded-tr-lg animate-pulse delay-500"></div>
              <div className="absolute bottom-4 left-4 w-8 h-8 border-l-2 border-b-2 border-orange-400 rounded-bl-lg animate-pulse delay-1000"></div>
              <div className="absolute bottom-4 right-4 w-8 h-8 border-r-2 border-b-2 border-orange-400 rounded-br-lg animate-pulse delay-1500"></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};