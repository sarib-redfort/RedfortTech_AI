import { useEffect, useRef } from "react";
import gsap from "gsap";

/**
 * Premium custom cursor follower.
 *
 * Improvements over original:
 *
 * 1. Window enter/leave — smooth opacity + scale fade (no instant pop/disappear).
 *    Uses gsap.to() on the cursor element for 0.25s transitions.
 *
 * 2. Hover interactions use transform:scale() ONLY.
 *    Never animates width or height (causes layout / paint).
 *
 * 3. Exactly ONE requestAnimationFrame loop. Never duplicated.
 *
 * 4. mouseleave/mouseenter on document.documentElement prevents flickering
 *    near browser chrome edges.
 *
 * 5. Cursor starts hidden (opacity:0, scale:0) and fades in on first move.
 *
 * 6. All cleanup in the useEffect return — zero memory leaks.
 */
export function useCustomCursor() {
  const cursorRef = useRef<HTMLDivElement | null>(null);
  const mouseX = useRef(0);
  const mouseY = useRef(0);
  const currentX = useRef(0);
  const currentY = useRef(0);
  const isInsideWindow = useRef(false);

  useEffect(() => {
    const isTouchDevice =
      "ontouchstart" in window ||
      navigator.maxTouchPoints > 0 ||
      window.matchMedia("(pointer: coarse)").matches;

    if (isTouchDevice) return;

    // ── Create cursor element ───────────────────────────────────
    const cursor = document.createElement("div");
    // Base: 10×10 red circle, hidden initially
    // Scale is the ONLY property changed on hover (no width/height mutations)
    cursor.style.cssText = [
      "position:fixed",
      "width:10px",
      "height:10px",
      "background:#DE181B",
      "border-radius:50%",
      "pointer-events:none",
      "z-index:99999",
      "left:0",
      "top:0",
      "opacity:0",
      "transform:translate(-50%,-50%) translate(0px,0px) scale(0)",
      "will-change:transform,opacity",
    ].join(";");
    document.body.appendChild(cursor);
    cursorRef.current = cursor;

    // ── Persistent quickTo setters for position ─────────────────
    // (quickTo is not suitable here because we compose multiple transforms —
    //  we keep the manual rAF loop for position + GSAP for scale/opacity)

    // ── Window visibility — enter ────────────────────────────────
    const showCursor = () => {
      if (isInsideWindow.current) return;
      isInsideWindow.current = true;
      gsap.killTweensOf(cursor);
      gsap.to(cursor, {
        opacity: 1,
        scale: 1,
        duration: 0.25,
        ease: "power2.out",
        overwrite: "auto",
      });
    };

    // ── Window visibility — leave ────────────────────────────────
    const hideCursor = () => {
      if (!isInsideWindow.current) return;
      isInsideWindow.current = false;
      gsap.killTweensOf(cursor);
      gsap.to(cursor, {
        opacity: 0,
        scale: 0,
        duration: 0.25,
        ease: "power2.in",
        overwrite: "auto",
      });
    };

    // ── Track mouse position ────────────────────────────────────
    const handleMouseMove = (e: MouseEvent) => {
      mouseX.current = e.clientX;
      mouseY.current = e.clientY;

      // Snap position on very first move to avoid flying from (0,0)
      if (!isInsideWindow.current) {
        currentX.current = e.clientX;
        currentY.current = e.clientY;
        showCursor();
      }
    };

    // ── Single rAF loop — position interpolation ────────────────
    let animationId: number;
    const animate = () => {
      currentX.current += (mouseX.current - currentX.current) * 0.12;
      currentY.current += (mouseY.current - currentY.current) * 0.12;

      if (cursorRef.current) {
        // Compose position + scale in one transform string
        // GSAP manages scale via its own transform; we override with inline here.
        // Use GSAP's internal matrix to avoid conflicts — apply position separately
        // via a CSS custom property approach using translateX/Y only:
        cursorRef.current.style.translate =
          `${currentX.current}px ${currentY.current}px`;
      }

      animationId = requestAnimationFrame(animate);
    };
    animationId = requestAnimationFrame(animate);

    // ── Hover interactions — scale only, no width/height ────────
    const handleMouseOver = (e: MouseEvent) => {
      const target = (e.target as HTMLElement).closest(
        "a, button, .hero-btn, .hero-image-inner, [data-cursor-hover]"
      );
      if (!target || !cursorRef.current) return;

      const isImage = target.classList.contains("hero-image-inner");
      const isLink  = target.tagName === "A" && !target.classList.contains("hero-btn");

      let targetScale = 1.8; // button default
      let targetOpacity = 1;

      if (isImage) {
        targetScale   = 2.0;
        targetOpacity = 0.4;
      } else if (isLink) {
        targetScale   = 1.5;
        targetOpacity = 1;
      }

      gsap.to(cursorRef.current, {
        scale: targetScale,
        opacity: targetOpacity,
        duration: 0.2,
        ease: "power2.out",
        overwrite: "auto",
      });
    };

    const handleMouseOut = (e: MouseEvent) => {
      const target = (e.target as HTMLElement).closest(
        "a, button, .hero-btn, .hero-image-inner, [data-cursor-hover]"
      );
      if (!target || !cursorRef.current) return;

      gsap.to(cursorRef.current, {
        scale: 1,
        opacity: 1,
        duration: 0.2,
        ease: "power2.out",
        overwrite: "auto",
      });
    };

    // ── Window enter/leave via documentElement ──────────────────
    // documentElement is more reliable than window events for
    // detecting when the cursor physically leaves the browser viewport
    const handleDocumentLeave = (e: MouseEvent) => {
      // Only trigger when leaving through the actual viewport edge
      if (
        e.clientY <= 0 ||
        e.clientX <= 0 ||
        e.clientX >= window.innerWidth ||
        e.clientY >= window.innerHeight
      ) {
        hideCursor();
      }
    };

    const handleDocumentEnter = () => {
      showCursor();
    };

    document.addEventListener("mousemove",   handleMouseMove);
    document.addEventListener("mouseover",   handleMouseOver, true);
    document.addEventListener("mouseout",    handleMouseOut,  true);
    document.addEventListener("mouseleave",  handleDocumentLeave);
    document.addEventListener("mouseenter",  handleDocumentEnter);

    // ── Cleanup ─────────────────────────────────────────────────
    return () => {
      cancelAnimationFrame(animationId);
      document.removeEventListener("mousemove",  handleMouseMove);
      document.removeEventListener("mouseover",  handleMouseOver, true);
      document.removeEventListener("mouseout",   handleMouseOut,  true);
      document.removeEventListener("mouseleave", handleDocumentLeave);
      document.removeEventListener("mouseenter", handleDocumentEnter);
      gsap.killTweensOf(cursor);
      if (cursorRef.current && document.body.contains(cursorRef.current)) {
        document.body.removeChild(cursorRef.current);
        cursorRef.current = null;
      }
    };
  }, []);
}