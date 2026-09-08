import { Link } from "react-router-dom";
import { motion } from "motion/react";
import { LucideIcon } from "../components/LucideIcon";

export default function NotFound() {
  return (
    <div className="bg-black text-white min-h-screen flex items-center justify-center py-20 relative overflow-hidden font-sans">
      {/* Absolute glow effects */}
      <div className="absolute right-0 bottom-0 w-96 h-96 bg-red-600/5 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute left-10 top-10 w-48 h-48 bg-white/[0.01] rotate-45 pointer-events-none" />

      <div className="max-w-md mx-auto px-6 text-center space-y-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="text-red-600 mb-6">
            <LucideIcon name="ShieldAlert" className="w-16 h-16 mx-auto animate-pulse" />
          </div>

          <h1 className="text-7xl md:text-8xl font-sans font-black tracking-tighter text-red-600">
            404
          </h1>

          <span className="inline-block text-xs font-mono bg-neutral-900 border border-neutral-800 px-3 py-1.5 rounded tracking-widest uppercase text-neutral-400 mt-2">
            ROUTING TRANSACTION REJECTED
          </span>

          <h2 className="text-2xl font-extrabold tracking-tight mt-6">
            Destination Not Located
          </h2>

          <p className="text-neutral-500 text-sm leading-relaxed mt-3">
            The database coordinate or page path you requested has been moved, archived, or is private.
            Ensure you have authorization permissions.
          </p>

          <div className="pt-8">
            <Link
              to="/"
              className="inline-flex items-center space-x-2 bg-red-600 hover:bg-red-600/90 text-white font-mono text-xs font-bold tracking-widest px-8 py-4.5 rounded transition-all duration-300 transform hover:-translate-y-0.5"
            >
              <span>RETURN TO SYSTEMS CONTROL</span>
              <span>→</span>
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
