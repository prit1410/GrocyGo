import React, { useState } from 'react';
import { ChevronDown, Shield, Users, Mic, Bell, HelpCircle, CheckCircle } from 'lucide-react';

export const FAQ = () => {
  const [openFAQ, setOpenFAQ] = useState<number | null>(null);

  const faqs = [
    {
      icon: <Shield className="w-6 h-6" />,
      question: "Is my data safe and secure?",
      answer: "Absolutely! We use enterprise-grade encryption and secure cloud infrastructure. Your data is stored with military-grade security and never shared with third parties. We're GDPR compliant and take privacy seriously.",
      category: "SECURITY"
    },
    {
      icon: <Users className="w-6 h-6" />,
      question: "Can I share this app with my family?",
      answer: "Yes! GrocyGo supports family sharing with up to 6 members. Each family member can add items, view the shopping list, and contribute to meal planning. Changes sync instantly across all devices.",
      category: "SHARING"
    },
    {
      icon: <Mic className="w-6 h-6" />,
      question: "Does it support voice commands?",
      answer: "Coming soon! Voice commands will allow you to add items to your shopping list, check what's in your inventory, and get recipe suggestions hands-free. Perfect for when you're cooking or busy with other tasks.",
      category: "FEATURES"
    },
    {
      icon: <Bell className="w-6 h-6" />,
      question: "Will it notify me when items expire?",
      answer: "Yes! Smart notifications alert you 3 days before items expire, suggest recipes to use expiring ingredients, and remind you when you're running low on essentials. You can customize notification preferences.",
      category: "ALERTS"
    },
    {
      question: "How accurate is the AI meal planning?",
      answer: "Our AI has 99.5% accuracy in meal suggestions. It learns from your preferences, dietary restrictions, and cooking habits. The more you use it, the better it gets at suggesting meals you'll love.",
      category: "AI"
    },
    {
      question: "Does it work offline?",
      answer: "Core features like viewing your inventory and shopping lists work offline. Data syncs automatically when you're back online. This ensures you always have access to your grocery information.",
      category: "CONNECTIVITY"
    }
  ];

  const toggleFAQ = (index: number) => {
    setOpenFAQ(openFAQ === index ? null : index);
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
            <HelpCircle className="w-5 h-5 text-teal-400 animate-pulse" />
            <span className="text-teal-300 font-bold text-sm tracking-wider uppercase">KNOWLEDGE BASE</span>
          </div>
          
          <div className="space-y-6">
            <h2 className="text-6xl lg:text-8xl font-black text-white leading-none tracking-tight">
              FREQUENTLY ASKED
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 via-teal-300 to-orange-400 animate-pulse">
                QUESTIONS
              </span>
            </h2>
            
            <div className="space-y-4">
              <p className="text-2xl lg:text-3xl font-bold text-gray-300 leading-tight">
                Everything You Need To Know
              </p>
              
              <p className="text-lg text-gray-400 leading-relaxed max-w-3xl mx-auto font-light">
                Everything you need to know about GrocyGo and how it transforms your grocery experience.
              </p>
            </div>
          </div>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="space-y-6">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className="group bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-2xl rounded-3xl border border-teal-500/30 shadow-2xl shadow-teal-500/20 hover:shadow-teal-500/40 transition-all duration-300 overflow-hidden"
              >
                {/* Holographic Effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-teal-500/10 via-transparent to-orange-500/10 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="absolute inset-0 border border-teal-400/20 rounded-3xl animate-pulse opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                
                <button
                  onClick={() => toggleFAQ(index)}
                  className="relative z-10 w-full p-8 text-left flex items-center justify-between hover:bg-slate-800/50 transition-colors duration-300"
                >
                  <div className="flex items-center gap-4">
                    {faq.icon && (
                      <div className="p-3 bg-gradient-to-br from-teal-500 to-orange-500 rounded-xl text-white shadow-lg shadow-teal-500/30 border border-teal-300/50">
                        {faq.icon}
                      </div>
                    )}
                    <div>
                      {faq.category && (
                        <div className="text-xs font-bold text-teal-400 tracking-wider mb-1">
                          {faq.category}
                        </div>
                      )}
                      <h3 className="text-xl font-black text-white tracking-wide">
                        {faq.question}
                      </h3>
                    </div>
                  </div>
                  <ChevronDown
                    className={`w-6 h-6 text-teal-300 transition-transform duration-300 ${
                      openFAQ === index ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                
                <div
                  className={`overflow-hidden transition-all duration-500 ease-in-out ${
                    openFAQ === index ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                  }`}
                >
                  <div className="relative z-10 px-8 pb-8">
                    <div className="pl-16">
                      <p className="text-gray-300 leading-relaxed text-lg font-light">
                        {faq.answer}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Scanning Line */}
                <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-teal-400 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 animate-pulse"></div>
              </div>
            ))}
          </div>
        </div>

        {/* Support CTA */}
        <div className="mt-16 text-center">
          <div className="inline-flex items-center gap-4 bg-gradient-to-r from-teal-500 to-orange-500 text-white px-8 py-4 rounded-2xl shadow-2xl shadow-teal-500/30 hover:shadow-teal-500/50 transition-all duration-300 hover:scale-105 border border-teal-300/50">
            <span className="text-2xl">💬</span>
            <div>
              <div className="font-black tracking-wide">Still have questions?</div>
              <div className="text-sm opacity-90 font-light">Chat with our support team</div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Gradient */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-slate-900 to-transparent"></div>
    </section>
  );
};