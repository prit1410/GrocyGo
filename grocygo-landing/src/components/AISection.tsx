import React from 'react';
import { Brain, Zap, Target, TrendingUp, Cpu, Network } from 'lucide-react';

export const AISection = () => {
  const aiFeatures = [
    {
      icon: <Brain className="w-8 h-8" />,
      title: "LEARNING YOUR HABITS",
      description: "AI analyzes your shopping patterns, consumption rates, and preferences to create personalized recommendations.",
      tech: "NEURAL NETWORK"
    },
    {
      icon: <Zap className="w-8 h-8" />,
      title: "PREDICTIVE SHOPPING",
      description: "Smart algorithms predict when you'll run out of items and automatically add them to your shopping list.",
      tech: "MACHINE LEARNING"
    },
    {
      icon: <Target className="w-8 h-8" />,
      title: "RECIPE OPTIMIZATION",
      description: "Get meal suggestions that maximize ingredient usage and minimize waste based on what you have.",
      tech: "OPTIMIZATION AI"
    },
    {
      icon: <TrendingUp className="w-8 h-8" />,
      title: "CONTINUOUS IMPROVEMENT",
      description: "The more you use GrocyGo, the smarter it gets at predicting your needs and preferences.",
      tech: "ADAPTIVE AI"
    }
  ];

  return (
    <section className="relative min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 overflow-hidden py-24">
      {/* Futuristic Grid Background */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute inset-0" style={{
          backgroundImage: `
            linear-gradient(rgba(147, 51, 234, 0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(147, 51, 234, 0.1) 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px'
        }}></div>
      </div>

      {/* Animated Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-72 h-72 bg-purple-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-40 right-20 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute bottom-20 left-1/3 w-64 h-64 bg-purple-500/10 rounded-full blur-2xl animate-pulse delay-2000"></div>
        
        {/* Floating AI Particles */}
        <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-purple-400 rounded-full animate-ping"></div>
        <div className="absolute top-1/3 right-1/3 w-1 h-1 bg-blue-400 rounded-full animate-ping delay-1000"></div>
        <div className="absolute bottom-1/4 left-1/2 w-1.5 h-1.5 bg-purple-300 rounded-full animate-ping delay-2000"></div>
      </div>

      <div className="relative z-10 container mx-auto px-6">
        <div className="text-center mb-16">
          {/* Status Badge */}
          <div className="inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-purple-500/20 to-blue-500/20 backdrop-blur-xl border border-purple-500/30 rounded-full mb-6">
            <Cpu className="w-5 h-5 text-purple-400 animate-pulse" />
            <span className="text-purple-300 font-bold text-sm tracking-wider uppercase">AI INTELLIGENCE CORE</span>
          </div>
          
          <div className="space-y-6">
            <h2 className="text-6xl lg:text-8xl font-black text-white leading-none tracking-tight">
              GROCYGO LEARNS
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-purple-300 to-blue-400 animate-pulse">
                YOUR HABITS
              </span>
            </h2>
            
            <div className="space-y-4">
              <p className="text-2xl lg:text-3xl font-bold text-gray-300 leading-tight">
                Advanced Neural Networks For Better Planning
              </p>
              
              <p className="text-lg text-gray-400 leading-relaxed max-w-3xl mx-auto font-light">
                Our AI engine continuously adapts to your lifestyle, creating a personalized 
                grocery management experience that gets smarter every day.
              </p>
            </div>
          </div>
        </div>

        {/* AI Brain Visualization */}
        <div className="flex justify-center mb-16">
          <div className="relative">
            <div className="w-80 h-80 bg-gradient-to-br from-slate-800/80 to-purple-900/80 backdrop-blur-2xl rounded-full flex items-center justify-center relative overflow-hidden border border-purple-500/30 shadow-2xl shadow-purple-500/20">
              {/* Holographic Effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/20 to-blue-500/20 rounded-full"></div>
              <div className="absolute inset-0 border border-purple-400/20 rounded-full animate-pulse"></div>
              
              {/* Pulsing Brain */}
              <div className="relative z-10">
                <Brain className="w-32 h-32 text-purple-400 animate-pulse" />
              </div>
              
              {/* Neural Network Lines */}
              <div className="absolute inset-0">
                {[...Array(8)].map((_, i) => (
                  <div
                    key={i}
                    className="absolute w-px bg-gradient-to-b from-purple-400 to-blue-400 animate-pulse"
                    style={{
                      height: '40%',
                      left: `${20 + i * 10}%`,
                      top: `${10 + (i % 3) * 20}%`,
                      animationDelay: `${i * 0.5}s`
                    }}
                  />
                ))}
              </div>
              
              {/* Orbiting Data Points */}
              <div className="absolute inset-0 animate-spin-slow">
                <div className="absolute top-8 left-1/2 transform -translate-x-1/2 w-4 h-4 bg-purple-400 rounded-full shadow-lg shadow-purple-400/50 border border-purple-300/50"></div>
                <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 w-3 h-3 bg-blue-400 rounded-full shadow-lg shadow-blue-400/50 border border-blue-300/50"></div>
                <div className="absolute top-1/2 left-8 transform -translate-y-1/2 w-5 h-5 bg-purple-500 rounded-full shadow-lg shadow-purple-500/50 border border-purple-300/50"></div>
                <div className="absolute top-1/2 right-8 transform -translate-y-1/2 w-4 h-4 bg-blue-500 rounded-full shadow-lg shadow-blue-500/50 border border-blue-300/50"></div>
              </div>
              
              {/* Tech Frame */}
              <div className="absolute top-4 left-4 w-8 h-8 border-l-2 border-t-2 border-purple-400 rounded-tl-lg animate-pulse"></div>
              <div className="absolute bottom-4 right-4 w-8 h-8 border-r-2 border-b-2 border-blue-400 rounded-br-lg animate-pulse delay-1000"></div>
            </div>
            
            {/* Lightning Bolts */}
            <div className="absolute top-4 right-4 animate-bounce">
              <Zap className="w-8 h-8 text-yellow-400" />
            </div>
            <div className="absolute bottom-4 left-4 animate-bounce delay-1000">
              <Zap className="w-6 h-6 text-yellow-300" />
            </div>
          </div>
        </div>

        {/* AI Features Grid */}
        <div className="grid md:grid-cols-2 gap-8">
          {aiFeatures.map((feature, index) => (
            <div
              key={index}
              className="group relative p-8 bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-2xl rounded-3xl border border-purple-500/30 shadow-2xl shadow-purple-500/20 hover:shadow-purple-500/40 transition-all duration-500 hover:scale-105"
            >
              {/* Tech Badge */}
              <div className="absolute top-4 right-4 px-2 py-1 bg-gradient-to-r from-purple-600 to-blue-600 text-white text-xs font-bold rounded-lg tracking-wider">
                {feature.tech}
              </div>

              {/* Holographic Background */}
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 via-transparent to-blue-500/10 rounded-3xl"></div>
              <div className="absolute inset-0 border border-purple-400/20 rounded-3xl animate-pulse"></div>
              
              <div className="relative z-10">
                <div className="mb-6 p-4 bg-gradient-to-br from-purple-500 to-blue-500 rounded-2xl w-fit text-white shadow-lg shadow-purple-500/30 group-hover:scale-110 transition-transform duration-300 border border-purple-300/50">
                  {feature.icon}
                </div>
                
                <h3 className="text-2xl font-black text-white mb-4 tracking-tight">
                  {feature.title}
                </h3>
                
                <p className="text-gray-300 leading-relaxed text-lg font-light">
                  {feature.description}
                </p>

                {/* Tech Corners */}
                <div className="absolute top-2 left-2 w-6 h-6 border-l-2 border-t-2 border-purple-300/50 rounded-tl-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="absolute bottom-2 right-2 w-6 h-6 border-r-2 border-b-2 border-blue-300/50 rounded-br-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>

              {/* Scanning Line */}
              <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-purple-400 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 animate-pulse"></div>
            </div>
          ))}
        </div>

        {/* Smart Stats */}
        <div className="mt-20 text-center">
          <div className="inline-flex items-center gap-8 bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-2xl rounded-3xl px-12 py-8 shadow-2xl shadow-purple-500/20 border border-purple-500/30">
            <div className="text-center">
              <div className="text-3xl font-black text-purple-400 mb-2">99.5%</div>
              <div className="text-gray-300 text-sm font-light">Prediction Accuracy</div>
            </div>
            <div className="w-px h-12 bg-purple-500/30"></div>
            <div className="text-center">
              <div className="text-3xl font-black text-blue-400 mb-2">2.5x</div>
              <div className="text-gray-300 text-sm font-light">Faster Planning</div>
            </div>
            <div className="w-px h-12 bg-purple-500/30"></div>
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 mb-2">
                <Network className="w-6 h-6 text-purple-400" />
                <div className="text-3xl font-black text-purple-400">AI</div>
              </div>
              <div className="text-gray-300 text-sm font-light">Powered</div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Gradient */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-slate-900 to-transparent"></div>
    </section>
  );
};