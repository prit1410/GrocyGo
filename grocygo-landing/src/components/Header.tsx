import { useEffect, useState } from 'react';
import trLogo from '../assets/logo/tr_logo.png';

export const Header = () => {
  const [show, setShow] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [, setScrolledUp] = useState(false);
  const [atTop, setAtTop] = useState(true);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setAtTop(currentScrollY === 0);
      if (currentScrollY > lastScrollY && currentScrollY > 60) {
        setShow(false); // Hide on scroll down
        setScrolledUp(false);
      } else if (currentScrollY < lastScrollY) {
        setShow(true); // Show on scroll up
        setScrolledUp(true);
      }
      setLastScrollY(currentScrollY);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  // Navbar is transparent only at the very top
  const isWhiteBg = !atTop;

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${!show ? '-translate-y-full' : 'translate-y-0'} ${isWhiteBg ? 'bg-white/90 shadow-lg backdrop-blur' : 'bg-transparent'}`}
    >
      <div className="container mx-auto px-6">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <img 
              src={trLogo}
              alt="GrocyGo Logo" 
              className="fixed left-8 h-13 w-52 object-cover object-center hover:scale-105 transition-transform duration-300"
              style={{ objectPosition: 'center' }}
            />
          </div>

          {/* Navigation - All items in horizontal line */}
          <nav className={`flex items-center gap-8 ${isWhiteBg ? 'text-black' : ''}`}>
            <a href="#features" className={`${isWhiteBg ? 'text-black hover:text-teal-600' : 'text-gray-300 hover:text-teal-400'} transition-colors duration-300 font-medium`}>
              Features
            </a>
            <a href="#demo" className={`${isWhiteBg ? 'text-black hover:text-teal-600' : 'text-gray-300 hover:text-teal-400'} transition-colors duration-300 font-medium`}>
              Demo
            </a>
            <a href="#testimonials" className={`${isWhiteBg ? 'text-black hover:text-teal-600' : 'text-gray-300 hover:text-teal-400'} transition-colors duration-300 font-medium`}>
              Reviews
            </a>
            <a href="#faq" className={`${isWhiteBg ? 'text-black hover:text-teal-600' : 'text-gray-300 hover:text-teal-400'} transition-colors duration-300 font-medium`}>
              FAQ
            </a>
            <button className={`px-6 py-2 bg-gradient-to-r from-teal-500 to-teal-600 ${isWhiteBg ? 'text-black border border-teal-500 bg-white/80 hover:bg-white' : 'text-white'} rounded-xl font-semibold hover:shadow-lg hover:shadow-teal-500/25 transition-all duration-300 hover:scale-105`}>
              Get Started
            </button>
          </nav>
        </div>
      </div>
    </header>
  );
};