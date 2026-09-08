import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import { useEffect, useState, useCallback, createContext, useContext } from "react";

// ─── Preloader context ────────────────────────────────────────────────────────
export const PreloaderContext = createContext<boolean>(true);
/** Returns true once the preloader has completed (or if there was no preloader). */
export function usePreloaderDone() {
  return useContext(PreloaderContext);
}
import { Navbar } from "./components/Navbar";
import { Preloader } from "./components/Preloader";
import { useCustomCursor } from "./hooks/useCustomCursor";
import { useLenis } from "./hooks/useLenis";
import { useScrollAnimations } from "./hooks/useScrollAnimations";
import { useAOS } from "./hooks/useAOS";
import { Footer } from "./components/Footer";
import Home from "./pages/Home";
import About from "./pages/About";
import Services from "./pages/Services";
import ServiceDetail from "./pages/ServiceDetail";
import Industries from "./pages/Industries";
import CaseStudies from "./pages/CaseStudies";
import CaseStudyDetail from "./pages/CaseStudyDetail";
import BlogIndex from "./pages/Blog";
import BlogDetail from "./pages/BlogDetail";
import Contact from "./pages/Contact";
import Careers from "./pages/Careers";
import NotFound from "./pages/NotFound";

// Module-level flag: tracks if this is the first ever mount (full page load)
// vs a subsequent SPA route navigation
let isFirstMount = true;

// ScrollToTop component forces window to reset scroll positions on navigation
function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

function AppContent() {
  const [preloaderDone, setPreloaderDone] = useState(!isFirstMount);

  useEffect(() => {
    // After first mount, mark that preloader has been shown
    isFirstMount = false;
  }, []);

  const handlePreloaderComplete = useCallback(() => {
    console.log("[App] Loading state changed: preloaderDone = true");
    setPreloaderDone(true);
  }, []);

  // Initialize custom cursor globally (visible on every page)
  useCustomCursor();

  // Initialize Lenis smooth scrolling globally (works on every page)
  useLenis();

  // Initialize global scroll animations (headings, text only)
  useScrollAnimations();

  // Initialize AOS for card reveal animations
  useAOS();

  return (
    <PreloaderContext.Provider value={preloaderDone}>
      {!preloaderDone && <Preloader onComplete={handlePreloaderComplete} />}
      <div className="flex flex-col min-h-screen bg-white text-black selection:bg-red-600 selection:text-white">
        {/* Sticky Header Nav */}
        <Navbar />

        {/* Core Layout Main Router */}
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/services" element={<Services />} />
            <Route path="/services/:id" element={<ServiceDetail />} />
            <Route path="/industries" element={<Industries />} />
            <Route path="/case-studies" element={<CaseStudies />} />
            <Route path="/case-studies/:id" element={<CaseStudyDetail />} />
            <Route path="/blog" element={<BlogIndex />} />
            <Route path="/blog/:slug" element={<BlogDetail />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/careers" element={<Careers />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>

        {/* Global Footer Grid */}
        <Footer />
      </div>
    </PreloaderContext.Provider>
  );
}

export default function App() {
  return (
    <Router>
      <ScrollToTop />
      <AppContent />
    </Router>
  );
}