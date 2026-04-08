import React from "react";
import { Link, Outlet, useLocation } from "react-router";
import { motion, AnimatePresence } from "motion/react";
import { Moon, Star, Menu, X } from "lucide-react";

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
    <div className="min-h-screen flex flex-col relative overflow-hidden bg-[#FFF5EA]">
      {/* Background soft ambient blobs */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-[#E5BE90] opacity-20 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] rounded-full bg-[#E84C3D] opacity-20 blur-[150px] pointer-events-none" />

      {/* Navigation */}
      <header className="fixed top-0 left-0 right-0 z-50 px-6 py-4">
        <nav className="max-w-7xl mx-auto glass-panel rounded-full px-6 py-3 flex items-center justify-between ghost-border shadow-[0_8px_32px_rgba(88,88,88,0.06)]">
          <Link to="/" className="flex items-center gap-2 group">
            <Moon className="w-6 h-6 text-[#E84C3D] transition-transform group-hover:rotate-12" />
            <span className="font-serif text-xl font-semibold tracking-tight text-[#585858]">KosmicAlign</span>
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
              className="bg-[#E84C3D] text-white px-6 py-2.5 rounded-full text-sm font-semibold hover:bg-[#C0392B] hover:shadow-[0_8px_32px_rgba(117,162,158,0.25)] transition-all duration-200 ease-out transform hover:scale-[1.02] flex items-center gap-2"
            >
              Book Reading <Star className="w-4 h-4" />
            </Link>
          </div>

          {/* Mobile Menu Toggle */}
          <button
            className="md:hidden text-[#585858]"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
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
            className="fixed inset-0 z-40 bg-[#FFF5EA]/95 backdrop-blur-md pt-28 px-6 pb-6 md:hidden flex flex-col"
          >
            <div className="flex flex-col gap-6 items-center">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`text-2xl font-serif font-semibold ${
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
                Book Your Reading
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main className="flex-1 pt-32 pb-24 px-6 relative z-10">
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
      <footer className="bg-white py-16 px-6 relative z-10 mt-auto rounded-t-[3rem] shadow-[0_-8px_32px_rgba(88,88,88,0.02)]">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="col-span-1 md:col-span-2">
            <Link to="/" className="flex items-center gap-2 mb-6 group">
              <Moon className="w-6 h-6 text-[#E84C3D]" />
              <span className="font-serif text-2xl font-semibold text-[#585858]">KosmicAlign</span>
            </Link>
            <p className="text-[#7A7A7A] leading-relaxed max-w-md font-sans">
              A premium fortune telling and spiritual guidance platform. Navigate life's tough moments with a trusted advisor.
            </p>
          </div>
          <div>
            <h4 className="font-serif text-[#585858] text-lg mb-6 font-semibold">Explore</h4>
            <ul className="space-y-4">
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
            <h4 className="font-serif text-[#585858] text-lg mb-6 font-semibold">Connect</h4>
            <ul className="space-y-4 text-[#7A7A7A]">
              <li>Delhi, India & Worldwide</li>
              <li>hello@kosmicalign.com</li>
              <li>WhatsApp Consultation</li>
            </ul>
          </div>
        </div>
        <div className="max-w-7xl mx-auto mt-16 pt-8 border-t border-[#7A7A7A]/10 flex flex-col md:flex-row items-center justify-between text-sm text-[#7A7A7A]">
          <p>© 2026 KosmicAlign. All rights reserved.</p>
          <div className="flex gap-4 mt-4 md:mt-0">
            <Link to="#" className="hover:text-[#E84C3D]">Privacy</Link>
            <Link to="#" className="hover:text-[#E84C3D]">Terms</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}