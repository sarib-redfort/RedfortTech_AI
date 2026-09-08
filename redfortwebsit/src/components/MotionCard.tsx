import { motion } from "motion/react";
import { useMotionTilt } from "../hooks/useMotionTilt";
import type { ReactNode } from "react";

interface MotionCardProps {
  children: ReactNode;
  className?: string;
  scale?: number;
  maxRotate?: number;
  id?: string;
  onClick?: (e: React.MouseEvent) => void;
  role?: string;
  tabIndex?: number;
  onKeyDown?: (e: React.KeyboardEvent) => void;
  "data-aos"?: string;
  "data-aos-delay"?: number;
}

/**
 * Wrapper component for 3D tilt on cards
 * Uses Framer Motion to replace GSAP-based useCardHover
 *
 * Features:
 * - Perspective 1000px
 * - rotateX / rotateY based on cursor position
 * - Scale 1.03 on hover
 * - Spring animation for smooth reset
 * - GPU accelerated transforms only
 */
export function MotionCard({
  children,
  className = "",
  scale = 1.04,
  maxRotate = 8,
  "data-aos": dataAos,
  "data-aos-delay": dataAosDelay,
  id,
  ...rest
}: MotionCardProps) {
  const tilt = useMotionTilt(scale, maxRotate);

  return (
    <div
      data-aos={dataAos}
      data-aos-delay={dataAosDelay}
      id={id}
      className="w-full h-full"
    >
      <motion.div
        className={`${className} w-full h-full`}
        style={tilt.style}
        onMouseMove={tilt.onMouseMove}
        onMouseLeave={tilt.onMouseLeave}
        {...(rest as any)}
      >
        {children}
      </motion.div>
    </div>
  );
}