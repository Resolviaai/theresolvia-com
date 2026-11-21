import { useEffect, useRef, type RefObject } from "react";

export interface VisibleLoopOptions {
  enabled?: boolean;
}

export function useVisibleLoop(
  targetRef: RefObject<HTMLElement | null>,
  callback: (dt: number) => void,
  options: VisibleLoopOptions = {}
) {
  const { enabled = true } = options;
  const callbackRef = useRef(callback);
  callbackRef.current = callback;

  useEffect(() => {
    if (!enabled) return;
    const target = targetRef.current;
    if (!target) return;

    let isVisible = true;
    let animId: number | null = null;
    let lastTime: number | null = null;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          isVisible = entry.isIntersecting;
          if (isVisible && animId === null) {
            lastTime = performance.now();
            animId = requestAnimationFrame(loop);
          }
        }
      },
      { threshold: 0.05 }
    );

    const loop = (now: number) => {
      if (!isVisible) {
        animId = null;
        return;
      }
      if (lastTime === null) lastTime = now;
      const dt = Math.min((now - lastTime) / 1000, 0.1);
      lastTime = now;
      callbackRef.current(dt);
      animId = requestAnimationFrame(loop);
    };

    observer.observe(target);
    lastTime = performance.now();
    animId = requestAnimationFrame(loop);

    return () => {
      observer.disconnect();
      if (animId !== null) {
        cancelAnimationFrame(animId);
      }
    };
  }, [enabled, targetRef]);
}
