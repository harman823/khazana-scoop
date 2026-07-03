"use client";

import { useEffect } from "react";

const EASE = 0.105;
const WHEEL_MULTIPLIER = 1.08;
const STOP_THRESHOLD = 0.45;

export function SmoothScrollController(): null {
  useEffect(() => {
    if (typeof window === "undefined") return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (reducedMotion.matches) return;
    if (!window.matchMedia("(pointer: fine)").matches) return;

    let frameId = 0;
    let currentY = window.scrollY;
    let targetY = window.scrollY;
    let isAnimating = false;

    document.documentElement.classList.add("smooth-scroll-active");

    const maxScroll = (): number => {
      const root = document.documentElement;
      return Math.max(0, root.scrollHeight - window.innerHeight);
    };

    const clampScroll = (value: number): number => Math.min(Math.max(value, 0), maxScroll());

    const stopAnimation = (): void => {
      if (frameId) {
        window.cancelAnimationFrame(frameId);
        frameId = 0;
      }
      isAnimating = false;
    };

    const animate = (): void => {
      const delta = targetY - currentY;
      if (Math.abs(delta) <= STOP_THRESHOLD) {
        currentY = targetY;
        window.scrollTo(0, currentY);
        stopAnimation();
        return;
      }

      currentY += delta * EASE;
      window.scrollTo(0, currentY);
      frameId = window.requestAnimationFrame(animate);
    };

    const shouldKeepNativeScroll = (event: WheelEvent): boolean => {
      if (event.ctrlKey || event.metaKey) return true;
      const path = event.composedPath();

      return path.some((node) => {
        if (!(node instanceof HTMLElement)) return false;
        if (node === document.body || node === document.documentElement) return false;
        if (node.closest("input, textarea, select, [role='dialog'], [data-native-scroll]")) return true;
        if (
          node.classList.contains("scroll-stack-scroller") ||
          node.classList.contains("sm-home-panel") ||
          node.classList.contains("carousel-content")
        ) {
          return true;
        }

        const style = window.getComputedStyle(node);
        const canScrollY = /(auto|scroll|overlay)/.test(style.overflowY);
        return canScrollY && node.scrollHeight > node.clientHeight;
      });
    };

    const onWheel = (event: WheelEvent): void => {
      if (shouldKeepNativeScroll(event)) return;

      const maxY = maxScroll();
      if (maxY <= 0) return;

      event.preventDefault();
      targetY = clampScroll(targetY + event.deltaY * WHEEL_MULTIPLIER);

      if (!isAnimating) {
        currentY = window.scrollY;
        isAnimating = true;
        frameId = window.requestAnimationFrame(animate);
      }
    };

    const onScroll = (): void => {
      if (isAnimating) return;
      currentY = window.scrollY;
      targetY = currentY;
    };

    const onResize = (): void => {
      targetY = clampScroll(targetY);
      currentY = clampScroll(currentY);
    };

    window.addEventListener("wheel", onWheel, { passive: false });
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize, { passive: true });

    return () => {
      stopAnimation();
      document.documentElement.classList.remove("smooth-scroll-active");
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  return null;
}
