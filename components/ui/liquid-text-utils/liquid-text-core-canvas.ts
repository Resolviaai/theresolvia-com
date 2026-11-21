import { useState, useEffect, type RefObject } from "react";

export function defaultMaxDpr(): number {
  return typeof window !== "undefined" ? Math.min(window.devicePixelRatio || 1, 2) : 1;
}

export function sizeCanvas(
  canvas: HTMLCanvasElement,
  cssWidth: number,
  cssHeight: number,
  dpr: number
): number {
  canvas.width = Math.round(cssWidth * dpr);
  canvas.height = Math.round(cssHeight * dpr);
  canvas.style.width = `${cssWidth}px`;
  canvas.style.height = `${cssHeight}px`;
  return dpr;
}

export function useElementSize(ref: RefObject<HTMLElement | null>): { width: number; height: number } {
  const [size, setSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const measure = () => {
      const r = el.getBoundingClientRect();
      setSize({ width: r.width, height: r.height });
    };

    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);

    return () => ro.disconnect();
  }, [ref]);

  return size;
}
