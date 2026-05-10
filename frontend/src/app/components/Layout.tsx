import React from "react";
import { Link, Outlet, useLocation } from "react-router";
import { motion, AnimatePresence } from "motion/react";
import { Instagram, Mail, MapPin, MessageCircle, Star, Menu, X } from "lucide-react";
import { Chatbot } from "./Chatbot";

const INSTAGRAM_URL =
  "https://www.instagram.com/kosmicalign?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==";

function LogoMark({ className = "" }: { className?: string }) {
  return (
    <img
      src="/img/kosmicalign-logo.png"
      alt=""
      className={`block h-10 w-10 shrink-0 rounded-full object-cover transition-transform group-hover:rotate-6 ${className}`}
      aria-hidden="true"
    />
  );
}

export function Layout() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
  const location = useLocation();

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "About Me", path: "/about" },
    { name: "Services", path: "/services" },
    { name: "Booking", path: "/booking" },
    { name: "Contact", path: "/contact" },
  ];

  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden md:overflow-x-hidden md:overflow-y-visible bg-[#FFF5EA]">
      {/* Background soft ambient blobs */}
      <div className="absolute top-[-10%] left-[-10%] hidden w-[50%] h-[50%] rounded-full bg-[#E5BE90] opacity-20 blur-[120px] pointer-events-none md:block" />
      <div className="absolute bottom-[-10%] right-[-10%] hidden w-[60%] h-[60%] rounded-full bg-[#E84C3D] opacity-20 blur-[150px] pointer-events-none md:block" />

      {/* Navigation */}
      <header className="fixed top-0 left-0 right-0 z-50 px-3 py-3 sm:px-6 sm:py-4">
        <nav className="max-w-7xl mx-auto glass-panel rounded-full px-4 py-3 sm:px-6 flex items-center justify-between ghost-border shadow-[0_8px_32px_rgba(88,88,88,0.06)]">
          <Link to="/" className="flex items-center gap-2 group">
            <LogoMark className="h-9 w-9 sm:h-10 sm:w-10" />
            <span className="font-serif text-lg sm:text-xl font-semibold tracking-tight text-[#125E8A]">KosmicAlign</span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className={`text-sm font-medium transition-colors ${
                  location.pathname === link.path
                    ? "text-[#E84C3D]"
                    : "text-[#7A7A7A] hover:text-[#E84C3D]"
                }`}
              >
                {link.name}
              </Link>
            ))}
          </div>

          <div className="hidden md:flex items-center">
            <Link
              to="/booking"
              className="bg-[#E84C3D] text-white px-6 py-2.5 rounded-full text-sm font-semibold hover:bg-[#C0392B] transition-colors duration-300 flex items-center gap-2"
            >
              Book Session <Star className="w-4 h-4" />
            </Link>
          </div>

          {/* Mobile Menu Toggle */}
          <button
            className="md:hidden text-[#585858] mobile-tap-highlight rounded-full p-2 -mr-2"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
            aria-expanded={isMobileMenuOpen}
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </nav>
      </header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.24, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-0 z-40 bg-[#FFF5EA]/95 backdrop-blur-md pt-24 px-5 pb-6 md:hidden flex flex-col overflow-y-auto"
          >
            <div className="flex min-h-full flex-col gap-5 items-center justify-center py-8">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`text-2xl font-serif font-semibold mobile-tap-highlight rounded-full px-4 py-2 ${
                    location.pathname === link.path
                      ? "text-[#E84C3D]"
                      : "text-[#585858]"
                  }`}
                >
                  {link.name}
                </Link>
              ))}
              <Link
                to="/booking"
                onClick={() => setIsMobileMenuOpen(false)}
                className="mt-8 bg-[#E84C3D] text-white px-8 py-4 rounded-full text-lg font-semibold w-full text-center hover:bg-[#C0392B]"
              >
                Book Your Session
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main className="flex-1 pt-[5.5rem] sm:pt-32 pb-10 sm:pb-24 px-4 sm:px-6 relative z-10">
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="max-w-7xl mx-auto h-full"
          >
            <Outlet />
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Footer */}
      <footer className="bg-white py-8 sm:py-16 px-5 sm:px-6 relative z-10 mt-auto rounded-t-[1.5rem] sm:rounded-t-[3rem] shadow-[0_-8px_32px_rgba(88,88,88,0.02)]">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-7 md:gap-12">
          <div className="col-span-1 md:col-span-2">
            <Link to="/" className="flex items-center gap-2 mb-4 sm:mb-6 group">
              <LogoMark className="h-11 w-11 transition-none group-hover:rotate-0" />
              <span className="font-serif text-2xl font-semibold text-[#125E8A]">KosmicAlign</span>
            </Link>
            <p className="text-[#7A7A7A] leading-relaxed max-w-md font-sans text-sm sm:text-base">
              A holistic counselling and therapy space for structured healing, inner alignment, and support through life's tough moments.
            </p>
          </div>
          <div>
            <h4 className="font-serif text-[#585858] text-lg mb-4 sm:mb-6 font-semibold">Explore</h4>
            <ul className="space-y-3 sm:space-y-4">
              {navLinks.map((link) => (
                <li key={link.name}>
                  <Link to={link.path} className="text-[#7A7A7A] hover:text-[#E84C3D] transition-colors">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="font-serif text-[#585858] text-lg mb-4 sm:mb-6 font-semibold">Connect</h4>
            <ul className="space-y-3 sm:space-y-4 text-[#7A7A7A]">
              <li className="flex items-start gap-3">
                <MapPin className="h-4 w-4 text-[#E84C3D] mt-1 shrink-0" />
                Delhi, India & Worldwide
              </li>
              <li>
                <a href="mailto:hello@kosmicalign.com" className="flex items-start gap-3 hover:text-[#E84C3D] transition-colors break-all">
                  <Mail className="h-4 w-4 text-[#E84C3D] mt-1 shrink-0" />
                  <span>hello@kosmicalign.com</span>
                </a>
              </li>
              <li className="flex items-start gap-3">
                <MessageCircle className="h-4 w-4 text-[#E84C3D] mt-1 shrink-0" />
                WhatsApp Consultation
              </li>
              <li>
                <a href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer" className="flex items-start gap-3 hover:text-[#E84C3D] transition-colors">
                  <Instagram className="h-4 w-4 text-[#E84C3D] mt-1 shrink-0" />
                  Instagram
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="max-w-7xl mx-auto mt-8 sm:mt-16 pt-6 sm:pt-8 border-t border-[#7A7A7A]/10 flex flex-col md:flex-row items-center justify-between text-sm text-[#7A7A7A]">
          <p>© 2026 KosmicAlign. All rights reserved.</p>
          <div className="flex gap-4 mt-4 md:mt-0">
            <Link to="#" className="hover:text-[#E84C3D]">Privacy</Link>
            <Link to="#" className="hover:text-[#E84C3D]">Terms</Link>
          </div>
        </div>
      </footer>

      <Chatbot />
    </div>
  );
}
