import { useCallback, RefObject } from "react";
import { useMotionValue, useSpring, useTransform, type SpringOptions, type MotionStyle } from "motion/react";

const springConfig: SpringOptions = {
  damping: 12,
  stiffness: 300,
  mass: 0.4,
};

export interface TiltHandlers {
  style: MotionStyle;
  onMouseMove: (e: React.MouseEvent) => void;
  onMouseLeave: () => void;
}

/**
 * Premium 3D tilt hook using Framer Motion
 *
 * Features:
 * - Perspective 1200px
 * - Stronger rotateX / rotateY based on cursor position
 * - Scale 1.04 on hover
 * - Smooth spring animation for Apple-like premium feel
 * - GPU accelerated transforms only
 */
export function useMotionTilt(
  scale: number = 1.04,
  maxRotate: number = 8
): TiltHandlers {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [maxRotate, -maxRotate]), springConfig);
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-maxRotate, maxRotate]), springConfig);
  const tiltScale = useSpring(1, springConfig);
  const tiltY = useSpring(0, springConfig);

  const onMouseMove = useCallback((e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;

    mouseX.set(x);
    mouseY.set(y);
    tiltScale.set(scale);
    tiltY.set(-8);
  }, [mouseX, mouseY, tiltScale, tiltY, scale]);

  const onMouseLeave = useCallback(() => {
    mouseX.set(0);
    mouseY.set(0);
    tiltScale.set(1);
    tiltY.set(0);
  }, [mouseX, mouseY, tiltScale, tiltY]);

  return {
    style: {
      perspective: 1200,
      rotateX,
      rotateY,
      scale: tiltScale,
      y: tiltY,
      transformStyle: "preserve-3d",
    } as MotionStyle,
    onMouseMove,
    onMouseLeave,
  };
}