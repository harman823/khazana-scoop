"use client";

import * as React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

type CarouselContextValue = {
  contentRef: React.MutableRefObject<HTMLDivElement | null>;
  scrollByPage: (direction: "previous" | "next") => void;
  motion: "idle" | "previous" | "next";
};

const CarouselContext = React.createContext<CarouselContextValue | null>(null);
const MOTION_DURATION_MS = 760;

function cx(...classes: Array<string | undefined>): string {
  return classes.filter(Boolean).join(" ");
}

function useCarousel(): CarouselContextValue {
  const context = React.useContext(CarouselContext);
  if (!context) {
    throw new Error("Carousel components must be rendered inside <Carousel>.");
  }

  return context;
}

export function Carousel({
  children,
  className,
  opts,
  ...props
}: React.HTMLAttributes<HTMLDivElement> & {
  opts?: {
    align?: "start" | "center" | "end";
  };
}): React.ReactElement {
  const contentRef = React.useRef<HTMLDivElement | null>(null);
  const motionTimerRef = React.useRef<number | null>(null);
  const animationFrameRef = React.useRef<number | null>(null);
  const [motion, setMotion] = React.useState<"idle" | "previous" | "next">("idle");

  const stopScrollAnimation = React.useCallback((): void => {
    if (animationFrameRef.current) {
      window.cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }
  }, []);

  const scrollByPage = React.useCallback((direction: "previous" | "next"): void => {
    const content = contentRef.current;
    if (!content) return;
    stopScrollAnimation();
    const firstItem = content.querySelector<HTMLElement>(".carousel-item");
    const contentStyles = window.getComputedStyle(content);
    const gap = Number.parseFloat(contentStyles.columnGap || contentStyles.gap || "0");
    const distance = firstItem ? firstItem.offsetWidth + gap : content.clientWidth;
    const start = content.scrollLeft;
    const maxLeft = content.scrollWidth - content.clientWidth;
    const target = Math.min(Math.max(start + (direction === "next" ? distance : -distance), 0), maxLeft);
    const startTime = window.performance.now();

    if (motionTimerRef.current) {
      window.clearTimeout(motionTimerRef.current);
    }

    setMotion(direction);
    motionTimerRef.current = window.setTimeout(() => {
      setMotion("idle");
      motionTimerRef.current = null;
    }, MOTION_DURATION_MS);

    const tick = (now: number): void => {
      const progress = Math.min((now - startTime) / MOTION_DURATION_MS, 1);
      const eased = 1 - Math.pow(1 - progress, 4);
      content.scrollLeft = start + (target - start) * eased;

      if (progress < 1) {
        animationFrameRef.current = window.requestAnimationFrame(tick);
        return;
      }

      content.scrollLeft = target;
      animationFrameRef.current = null;
    };

    animationFrameRef.current = window.requestAnimationFrame(tick);
  }, [stopScrollAnimation]);

  React.useEffect(() => () => {
    stopScrollAnimation();
    if (motionTimerRef.current) {
      window.clearTimeout(motionTimerRef.current);
    }
  }, [stopScrollAnimation]);

  return (
    <CarouselContext.Provider value={{ contentRef, motion, scrollByPage }}>
      <div className={cx("carousel", className)} data-align={opts?.align ?? "start"} data-motion={motion} {...props}>
        {children}
      </div>
    </CarouselContext.Provider>
  );
}

export function CarouselContent({
  children,
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>): React.ReactElement {
  const { contentRef, motion } = useCarousel();

  return (
    <div
      className={cx("carousel-content", motion !== "idle" ? `carousel-content-${motion}` : undefined, className)}
      ref={contentRef}
      {...props}
    >
      {children}
    </div>
  );
}

export function CarouselItem({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>): React.ReactElement {
  return <div className={cx("carousel-item", className)} {...props} />;
}

export function CarouselPrevious({
  className,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement>): React.ReactElement {
  const { scrollByPage } = useCarousel();

  return (
    <button
      aria-label="Previous slide"
      className={cx("carousel-nav carousel-nav-previous", className)}
      onClick={() => scrollByPage("previous")}
      type="button"
      {...props}
    >
      <ChevronLeft size={20} />
    </button>
  );
}

export function CarouselNext({
  className,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement>): React.ReactElement {
  const { scrollByPage } = useCarousel();

  return (
    <button
      aria-label="Next slide"
      className={cx("carousel-nav carousel-nav-next", className)}
      onClick={() => scrollByPage("next")}
      type="button"
      {...props}
    >
      <ChevronRight size={20} />
    </button>
  );
}
