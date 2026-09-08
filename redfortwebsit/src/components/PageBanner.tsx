import { Link } from "react-router-dom";
import { motion } from "motion/react";

interface BreadcrumbItem {
  label: string;
  path?: string;
}

interface PageBannerProps {
  title: string;
  subtitle?: string;
  breadcrumbs: BreadcrumbItem[];
}

export function PageBanner({ title, subtitle, breadcrumbs }: PageBannerProps) {
  return (
    <section className="relative bg-black text-white pt-36 pb-24 md:py-36 overflow-hidden border-b border-neutral-900 flex justify-center">
      {/* Top Vertical Soft Light Beam */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-[400px] top-light-beam-subtle pointer-events-none z-0" />
      <div className="absolute right-0 top-1/2 -translate-y-1/2 w-96 h-96 bg-red-600/10 blur-[140px] rounded-full pointer-events-none z-0" />

      <div className="max-w-7xl mx-auto px-6 relative z-10 w-full">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Breadcrumbs */}
          <nav className="flex items-center space-x-2 text-xs font-mono text-neutral-400 mb-6 uppercase tracking-widest">
            {breadcrumbs.map((item, index) => (
              <div key={index} className="flex items-center space-x-2">
                {index > 0 && <span className="text-neutral-700">•</span>}
                {item.path ? (
                  <Link
                    to={item.path}
                    className="hover:text-red-600 transition-colors duration-200"
                  >
                    {item.label}
                  </Link>
                ) : (
                  <span className="text-red-600 font-bold">{item.label}</span>
                )}
              </div>
            ))}
          </nav>

          <h1 className="text-4xl md:text-6xl lg:text-7xl font-sans font-black tracking-tight mb-4 text-white">
            {title}
          </h1>

          {subtitle && (
            <p className="text-neutral-400 text-base md:text-xl max-w-2xl font-body leading-relaxed">
              {subtitle}
            </p>
          )}

          <div className="h-1 w-20 bg-red-600 mt-6 rounded-full shadow-[0_0_15px_#D32F2F]" />
        </motion.div>
      </div>
    </section>
  );
}

