import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import { useEffect, useState, useCallback, createContext, useContext, lazy, Suspense } from "react";

// ─── Preloader context ────────────────────────────────────────────────────────
export const PreloaderContext = createContext<boolean>(true);
/** Returns true once the preloader has completed (or if there was no preloader). */
export function usePreloaderDone() {
  return useContext(PreloaderContext);
}
import { Navbar } from "./components/layout/Navbar";
import { Preloader } from "./components/layout/Preloader";
import { useCustomCursor } from "./hooks/useCustomCursor";
import { useLenis } from "./hooks/useLenis";
import { useScrollAnimations } from "./hooks/useScrollAnimations";
import { useAOS } from "./hooks/useAOS";
import { Footer } from "./components/layout/Footer";
// Pages are code-split so a visitor downloads only the route they land on.
// Loading all twelve eagerly produced a single ~1.6 MB bundle.
const Home = lazy(() => import("./pages/Home"));
const About = lazy(() => import("./pages/About"));
const Services = lazy(() => import("./pages/Services"));
const ServiceDetail = lazy(() => import("./pages/ServiceDetail"));
const Industries = lazy(() => import("./pages/Industries"));
const CaseStudies = lazy(() => import("./pages/CaseStudies"));
const CaseStudyDetail = lazy(() => import("./pages/CaseStudyDetail"));
const BlogIndex = lazy(() => import("./pages/Blog"));
const BlogDetail = lazy(() => import("./pages/BlogDetail"));
const Contact = lazy(() => import("./pages/Contact"));
const Careers = lazy(() => import("./pages/Careers"));
const NotFound = lazy(() => import("./pages/NotFound"));
import { logger } from './lib/logger';

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

/**
 * Shown while a route chunk downloads. Deliberately minimal: the page frame
 * (navbar/footer) is already painted, so a heavy skeleton would flash.
 */
function RouteFallback() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center" role="status" aria-label="Loading page">
      <div className="h-8 w-8 animate-spin rounded-full border-2 border-gray-200 border-t-red-600" />
    </div>
  );
}

function AppContent() {
  const [preloaderDone, setPreloaderDone] = useState(!isFirstMount);

  useEffect(() => {
    // After first mount, mark that preloader has been shown
    isFirstMount = false;
  }, []);

  const handlePreloaderComplete = useCallback(() => {
    logger.debug("[App] Loading state changed: preloaderDone = true");
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
          <Suspense fallback={<RouteFallback />}>
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
          </Suspense>
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