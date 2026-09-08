import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import { LucideIcon } from "./LucideIcon";

export function Navbar() {
  const location = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 30) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [location.pathname]);

  const menuItems = [
    { label: "Home", path: "/" },
    { label: "About", path: "/about" },
    { label: "Services", path: "/services" },
    { label: "Industries", path: "/industries" },
    { label: "Case Studies", path: "/case-studies" },
    { label: "Blog", path: "/blog" },
    { label: "Contact", path: "/contact" }
  ];

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 flex justify-center ${
          isScrolled ? "py-3" : "py-6"
        }`}
      >
        <nav
          className={`w-[92%] max-w-7xl px-6 py-3 rounded-full transition-all duration-500 flex items-center justify-between ${
            isScrolled
              ? "glass-pill-nav shadow-[0_10px_30px_rgba(0,0,0,0.8)] border border-neutral-800/80"
              : "bg-black/40 backdrop-blur-md border border-white/10"
          }`}
        >
          {/* Logo - RedFort AI */}
          <Link to="/" className="flex items-center group shrink-0">
            <img
              src="/assets/logos/logo.png"
              alt="RedFort AI Logo"
              className="h-9 w-auto object-contain group-hover:scale-105 transition-transform duration-300"
              referrerPolicy="no-referrer"
            />
          </Link>

          {/* Desktop Nav Links */}
          <div className="hidden lg:flex items-center space-x-1 bg-black/30 border border-white/5 rounded-full px-4 py-1.5 backdrop-blur-sm">
            {menuItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`text-[11px] font-sans font-bold uppercase tracking-widest px-3.5 py-1.5 rounded-full transition-all duration-300 relative ${
                    isActive ? "text-white" : "text-neutral-400 hover:text-white"
                  }`}
                >
                  <span className="relative z-10">{item.label}</span>
                  {isActive && (
                    <motion.div
                      layoutId="navPillActive"
                      className="absolute inset-0 bg-red-600 rounded-full shadow-[0_0_12px_rgba(211,47,47,0.6)]"
                      transition={{ type: "spring", stiffness: 400, damping: 30 }}
                    />
                  )}
                </Link>
              );
            })}
          </div>

          {/* Action CTAs: Glowing Red Pill Button */}
          <div className="hidden lg:flex items-center space-x-3 shrink-0">
            <Link
              to="/contact"
              className="group relative inline-flex items-center justify-center bg-red-600 hover:bg-red-700 text-white font-sans text-xs font-bold tracking-widest px-5 py-2.5 rounded-full transition-all duration-300 shadow-[0_0_20px_rgba(211,47,47,0.4)] hover:shadow-[0_0_30px_rgba(211,47,47,0.7)] hover:scale-105"
            >
              <span>GET STARTED</span>
              <span className="ml-1.5 group-hover:translate-x-1 transition-transform duration-300">→</span>
            </Link>
          </div>

          {/* Mobile Menu Toggle Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden text-white hover:text-red-600 transition-colors p-2 rounded-full bg-neutral-900 border border-neutral-800"
            aria-label="Toggle Menu"
          >
            <LucideIcon name={isMobileMenuOpen ? "X" : "Menu"} className="w-5 h-5" />
          </button>
        </nav>
      </header>

      {/* Mobile Sliding Navigation Drawer */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 bg-black/95 backdrop-blur-2xl z-40 flex flex-col justify-between p-8 lg:hidden"
          >
            <div className="flex justify-between items-center pt-4">
              <Link to="/" onClick={() => setIsMobileMenuOpen(false)}>
                <img
                  src="/assets/logos/logo.png"
                  alt="RedFort AI Logo"
                  className="h-9 w-auto object-contain"
                  referrerPolicy="no-referrer"
                />
              </Link>
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-neutral-400 hover:text-white p-2"
              >
                <LucideIcon name="X" className="w-6 h-6" />
              </button>
            </div>

            <div className="flex flex-col space-y-5 my-auto">
              {menuItems.map((item, idx) => {
                const isActive = location.pathname === item.path;
                return (
                  <motion.div
                    key={item.path}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.04 }}
                  >
                    <Link
                      to={item.path}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={`text-2xl font-sans font-bold tracking-tight block ${
                        isActive ? "text-red-600" : "text-neutral-300 hover:text-white"
                      }`}
                    >
                      {item.label}
                    </Link>
                  </motion.div>
                );
              })}
            </div>

            <div className="pt-6 border-t border-neutral-900 flex flex-col space-y-3">
              <Link
                to="/contact"
                onClick={() => setIsMobileMenuOpen(false)}
                className="w-full text-center bg-red-600 text-white font-sans text-xs font-bold tracking-widest py-4 rounded-full shadow-[0_0_25px_rgba(211,47,47,0.5)]"
              >
                GET STARTED NOW →
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}