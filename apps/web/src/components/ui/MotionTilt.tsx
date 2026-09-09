import { motion } from "motion/react";
import { useMotionTilt } from "../../hooks/useMotionTilt";
import type { ReactNode } from "react";

interface MotionTiltProps {
  children: ReactNode;
  className?: string;
  scale?: number;
  maxRotate?: number;
}

/**
 * Wrapper component for 3D tilt on standalone images
 * Framer Motion replacement for the old GSAP image-tilt effect.
 */
export function MotionTilt({
  children,
  className = "",
  scale = 1.02,
  maxRotate = 5,
}: MotionTiltProps) {
  const tilt = useMotionTilt(scale, maxRotate);

  return (
    <motion.div
      className={className}
      style={tilt.style}
      onMouseMove={tilt.onMouseMove}
      onMouseLeave={tilt.onMouseLeave}
    >
      {children}
    </motion.div>
  );
}