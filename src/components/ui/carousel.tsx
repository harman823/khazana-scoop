"use client";

import * as React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

type CarouselContextValue = {
  contentRef: React.MutableRefObject<HTMLDivElement | null>;
  scrollByPage: (direction: "previous" | "next") => void;
};

const CarouselContext = React.createContext<CarouselContextValue | null>(null);

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

  const scrollByPage = React.useCallback((direction: "previous" | "next"): void => {
    const content = contentRef.current;
    if (!content) return;
    const firstItem = content.querySelector<HTMLElement>(".carousel-item");
    const contentStyles = window.getComputedStyle(content);
    const gap = Number.parseFloat(contentStyles.columnGap || contentStyles.gap || "0");
    const distance = firstItem ? firstItem.offsetWidth + gap : content.clientWidth;

    content.scrollBy({
      behavior: "smooth",
      left: direction === "next" ? distance : -distance,
    });
  }, []);

  return (
    <CarouselContext.Provider value={{ contentRef, scrollByPage }}>
      <div className={cx("carousel", className)} data-align={opts?.align ?? "start"} {...props}>
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
  const { contentRef } = useCarousel();

  return (
    <div
      className={cx("carousel-content", className)}
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
