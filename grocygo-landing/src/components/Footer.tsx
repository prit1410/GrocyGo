import React from 'react';
import { Shield, Cloud, CreditCard, Bot, Github, Twitter, Mail, Zap, Network } from 'lucide-react';

export const Footer = () => {
  const integrations = [
    { icon: <Cloud className="w-8 h-8" />, name: "AWS Cloud", color: "from-orange-500 to-orange-600" },
    { icon: <Shield className="w-8 h-8" />, name: "Firebase", color: "from-yellow-500 to-yellow-600" },
    { icon: <CreditCard className="w-8 h-8" />, name: "Razorpay", color: "from-blue-500 to-blue-600" },
    { icon: <Bot className="w-8 h-8" />, name: "OpenAI", color: "from-green-500 to-green-600" }
  ];

  return (
    <footer className="relative bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white overflow-hidden">
      {/* Futuristic Grid Background */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `
            linear-gradient(rgba(20, 184, 166, 0.3) 1px, transparent 1px),
            linear-gradient(90deg, rgba(20, 184, 166, 0.3) 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px'
        }}></div>
      </div>

      {/* Animated Background */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-20 w-72 h-72 bg-teal-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        
        {/* Floating Particles */}
        <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-teal-400 rounded-full animate-ping"></div>
        <div className="absolute top-1/3 right-1/3 w-1 h-1 bg-orange-400 rounded-full animate-ping delay-1000"></div>
        <div className="absolute bottom-1/4 left-1/2 w-1.5 h-1.5 bg-teal-300 rounded-full animate-ping delay-2000"></div>
      </div>

      <div className="relative z-10">
        {/* Trust Building Section */}
        <div className="border-b border-teal-500/20">
          <div className="container mx-auto px-6 py-16">
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-teal-500/20 to-orange-500/20 backdrop-blur-xl border border-teal-500/30 rounded-full mb-6">
                <Shield className="w-5 h-5 text-teal-400 animate-pulse" />
                <span className="text-teal-300 font-bold text-sm tracking-wider uppercase">ENTERPRISE GRADE</span>
              </div>
              
              <h3 className="text-4xl font-black text-white mb-4 tracking-tight">BUILT ON TRUST & SECURITY</h3>
              <p className="text-gray-300 text-lg max-w-2xl mx-auto font-light">
                GrocyGo is powered by industry-leading technologies and security standards.
              </p>
            </div>

            {/* Integration Logos */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {integrations.map((integration, index) => (
                <div
                  key={index}
                  className="group flex flex-col items-center text-center"
                >
                  <div className={`p-6 bg-gradient-to-br ${integration.color} rounded-3xl shadow-2xl shadow-${integration.color.split('-')[1]}-500/20 group-hover:shadow-${integration.color.split('-')[1]}-500/40 transition-all duration-300 group-hover:scale-110 mb-4 border border-white/20`}>
                    {integration.icon}
                  </div>
                  <span className="text-gray-300 font-bold tracking-wide">{integration.name}</span>
                </div>
              ))}
            </div>

            {/* Security Badge */}
            <div className="mt-12 text-center">
              <div className="inline-flex items-center gap-4 bg-gradient-to-r from-green-600/80 to-green-700/80 backdrop-blur-xl px-8 py-4 rounded-2xl shadow-2xl shadow-green-500/20 border border-green-500/30">
                <Shield className="w-6 h-6 animate-pulse" />
                <div>
                  <div className="font-black text-lg tracking-wide">100% ENCRYPTED & SECURE</div>
                  <div className="text-sm opacity-90 font-light">Cloud-based sync with military-grade security</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Footer */}
        <div className="container mx-auto px-6 py-16">
          <div className="grid md:grid-cols-4 gap-12">
            {/* Brand */}
            <div className="md:col-span-1">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-teal-500 to-orange-500 rounded-2xl flex items-center justify-center shadow-lg shadow-teal-500/30 border border-teal-300/50">
                  <span className="text-white font-black text-xl">G</span>
                </div>
                <span className="text-2xl font-black tracking-wide">GrocyGo</span>
              </div>
              <p className="text-gray-300 leading-relaxed mb-6 font-light">
                Transforming grocery management with AI-powered planning and smart inventory tracking.
              </p>
              <div className="flex gap-4">
                <a href="#" className="w-10 h-10 bg-gradient-to-br from-slate-700 to-slate-800 hover:from-teal-600 hover:to-teal-700 rounded-xl flex items-center justify-center transition-all duration-300 hover:scale-110 border border-teal-500/30">
                  <Twitter className="w-5 h-5" />
                </a>
                <a href="#" className="w-10 h-10 bg-gradient-to-br from-slate-700 to-slate-800 hover:from-teal-600 hover:to-teal-700 rounded-xl flex items-center justify-center transition-all duration-300 hover:scale-110 border border-teal-500/30">
                  <Github className="w-5 h-5" />
                </a>
                <a href="#" className="w-10 h-10 bg-gradient-to-br from-slate-700 to-slate-800 hover:from-orange-600 hover:to-orange-700 rounded-xl flex items-center justify-center transition-all duration-300 hover:scale-110 border border-orange-500/30">
                  <Mail className="w-5 h-5" />
                </a>
              </div>
            </div>

            {/* Product */}
            <div>
              <h4 className="text-lg font-black mb-6 text-teal-300 tracking-wide">PRODUCT</h4>
              <ul className="space-y-3">
                {['Features', 'Demo', 'Pricing', 'Integrations', 'API'].map((item) => (
                  <li key={item}>
                    <a href="#" className="text-gray-300 hover:text-teal-400 transition-colors duration-300 font-light">
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Company */}
            <div>
              <h4 className="text-lg font-black mb-6 text-orange-300 tracking-wide">COMPANY</h4>
              <ul className="space-y-3">
                {['About', 'Blog', 'Careers', 'Press', 'Partners'].map((item) => (
                  <li key={item}>
                    <a href="#" className="text-gray-300 hover:text-orange-400 transition-colors duration-300 font-light">
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Support */}
            <div>
              <h4 className="text-lg font-black mb-6 text-teal-300 tracking-wide">SUPPORT</h4>
              <ul className="space-y-3">
                {['Help Center', 'Contact', 'Privacy Policy', 'Terms of Service', 'Status'].map((item) => (
                  <li key={item}>
                    <a href="#" className="text-gray-300 hover:text-teal-400 transition-colors duration-300 font-light">
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-teal-500/20">
          <div className="container mx-auto px-6 py-8">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <p className="text-gray-300 font-light">
                © 2025 GrocyGo. All rights reserved. Made with ❤️ for smarter grocery management.
              </p>
              <div className="flex items-center gap-2">
                <span className="text-gray-300 font-light">Download on:</span>
                <div className="flex gap-3">
                  <div className="px-4 py-2 bg-gradient-to-br from-slate-700 to-slate-800 hover:from-slate-600 hover:to-slate-700 rounded-lg transition-all duration-300 cursor-pointer border border-teal-500/30">
                    <span className="text-sm font-bold text-teal-300">App Store</span>
                  </div>
                  <div className="px-4 py-2 bg-gradient-to-br from-slate-700 to-slate-800 hover:from-slate-600 hover:to-slate-700 rounded-lg transition-all duration-300 cursor-pointer border border-orange-500/30">
                    <span className="text-sm font-bold text-orange-300">Google Play</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Live Chat Bubble */}
        <div className="fixed bottom-6 right-6 z-50">
          <button className="w-16 h-16 bg-gradient-to-r from-teal-500 to-orange-500 rounded-full shadow-2xl shadow-teal-500/30 hover:shadow-teal-500/50 transition-all duration-300 hover:scale-110 flex items-center justify-center group border border-teal-300/50">
            <span className="text-2xl group-hover:animate-bounce">💬</span>
          </button>
        </div>
      </div>
    </footer>
  );
};