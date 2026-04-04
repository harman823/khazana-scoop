import { Link, Outlet, useLocation } from 'react-router';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from './Button';
import { StartingLoader } from './StartingLoader';
import { useUI } from './UIContext';

const links = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/services", label: "Services" },
  { href: "/booking", label: "Booking" },
  { href: "/webinars", label: "Webinars" },
  { href: "/contact", label: "Contact" },
];

export function Layout() {
  const location = useLocation();
  const { isLoaded } = useUI();

  return (
    <>
      <StartingLoader />
      <div className="min-h-screen bg-surface flex flex-col font-body">
      {/* Navigation */}
      <motion.header 
        initial={{ y: "-100%" }}
        animate={isLoaded ? { y: 0 } : { y: "-100%" }}
        transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
        className="sticky top-0 z-50 glass-panel border-b-0 py-6 px-6 lg:px-12 flex items-center justify-between"
      >
        <Link to="/" className="font-display font-bold text-2xl tracking-tighter uppercase text-on-surface hover:text-primary transition-colors">
          Kosmic Align
        </Link>
        <nav className="hidden md:flex gap-8">
          {links.map((link) => (
            <Link
              key={link.href}
              to={link.href}
              className={cn(
                "font-mono text-sm tracking-widest uppercase py-2 transition-colors relative group",
                location.pathname === link.href ? "text-primary font-bold" : "text-on-surface-variant hover:text-on-surface"
              )}
            >
              {link.label}
              <span className={cn(
                "absolute -bottom-1 left-0 w-full h-[2px] bg-primary scale-x-0 transition-transform origin-left",
                location.pathname === link.href ? "scale-x-100" : "group-hover:scale-x-100"
              )} />
            </Link>
          ))}
        </nav>
        {/* Mobile menu button would go here */}
      </motion.header>

      {/* Main Content */}
      <main className="flex-grow flex flex-col relative">
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.6, ease: [0.76, 0, 0.24, 1] }}
            className="flex-grow flex flex-col"
          >
            <Outlet />
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Footer */}
      <motion.footer 
        initial={{ opacity: 0 }}
        animate={isLoaded ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 0.8, delay: 0.5, ease: [0.76, 0, 0.24, 1] as any }}
        className="bg-surface-container-lowest py-20 px-6 lg:px-12 mt-20"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
          <div>
            <h2 className="font-display text-4xl font-bold uppercase tracking-tighter mb-6 text-on-surface">Kosmic Align</h2>
            <p className="font-body text-on-surface-variant max-w-sm">
              Fortune Telling Service & Astrological Guidance. Unveiling the truth through brutal honesty and clarity.
            </p>
          </div>
          <div className="flex flex-col md:items-end">
            <nav className="flex flex-col gap-4">
              {links.map(l => (
                <Link key={l.href} to={l.href} className="font-mono text-sm uppercase tracking-widest text-on-surface-variant hover:text-primary transition-colors md:text-right">
                  {l.label}
                </Link>
              ))}
            </nav>
            <div className="mt-12 text-on-surface-variant font-mono text-xs uppercase tracking-widest">
              &copy; 2026 Kosmic Align. All rights reserved.
            </div>
          </div>
        </div>
      </motion.footer>
    </div>
    </>
  );
}
