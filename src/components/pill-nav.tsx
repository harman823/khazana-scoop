"use client";

import { gsap } from "gsap";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";

export type PillNavItem = {
  label: string;
  href: string;
  ariaLabel?: string;
};

type PillNavProps = {
  items: PillNavItem[];
  activeHref?: string;
  className?: string;
  ease?: string;
  baseColor?: string;
  pillColor?: string;
  hoveredPillTextColor?: string;
  pillTextColor?: string;
  initialLoadAnimation?: boolean;
};

function isExternalOrHashLink(href: string): boolean {
  return (
    href.startsWith("http://") ||
    href.startsWith("https://") ||
    href.startsWith("//") ||
    href.startsWith("mailto:") ||
    href.startsWith("tel:") ||
    href.startsWith("#")
  );
}

function isActiveHref(currentPath: string, activeHref: string | undefined, href: string): boolean {
  const resolvedActive = activeHref ?? currentPath;
  if (href.startsWith("#")) return resolvedActive === href;
  if (href === "/") return resolvedActive === "/";
  return resolvedActive === href || resolvedActive.startsWith(`${href}/`);
}

export function PillNav({
  items,
  activeHref,
  className = "",
  ease = "power3.out",
  baseColor = "#1e293b",
  pillColor = "#fffdf5",
  hoveredPillTextColor = "#ffffff",
  pillTextColor,
  initialLoadAnimation = true,
}: PillNavProps): React.ReactElement {
  const pathname = usePathname();
  const resolvedPillTextColor = pillTextColor ?? baseColor;
  const circleRefs = useRef<Array<HTMLSpanElement | null>>([]);
  const timelineRefs = useRef<Array<gsap.core.Timeline | null>>([]);
  const activeTweenRefs = useRef<Array<gsap.core.Tween | null>>([]);
  const logoRef = useRef<HTMLAnchorElement | null>(null);
  const logoGlyphRef = useRef<HTMLSpanElement | null>(null);
  const logoTweenRef = useRef<gsap.core.Tween | null>(null);
  const navItemsRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const layout = () => {
      circleRefs.current.forEach((circle, index) => {
        if (!circle?.parentElement) return;

        const pill = circle.parentElement;
        const rect = pill.getBoundingClientRect();
        const { width, height } = rect;
        const radius = ((width * width) / 4 + height * height) / (2 * height);
        const diameter = Math.ceil(2 * radius) + 2;
        const delta = Math.ceil(radius - Math.sqrt(Math.max(0, radius * radius - (width * width) / 4))) + 1;
        const originY = diameter - delta;

        circle.style.width = `${diameter}px`;
        circle.style.height = `${diameter}px`;
        circle.style.bottom = `-${delta}px`;

        gsap.set(circle, {
          scale: 0,
          transformOrigin: `50% ${originY}px`,
          xPercent: -50,
        });

        const label = pill.querySelector<HTMLElement>(".pill-label");
        const hoverLabel = pill.querySelector<HTMLElement>(".pill-label-hover");

        if (label) gsap.set(label, { y: 0 });
        if (hoverLabel) gsap.set(hoverLabel, { opacity: 0, y: height + 12 });

        timelineRefs.current[index]?.kill();
        const timeline = gsap.timeline({ paused: true });

        timeline.to(circle, { duration: 1.2, ease, overwrite: "auto", scale: 1.18, xPercent: -50 }, 0);
        if (label) timeline.to(label, { duration: 1.2, ease, overwrite: "auto", y: -(height + 8) }, 0);
        if (hoverLabel) timeline.to(hoverLabel, { duration: 1.2, ease, opacity: 1, overwrite: "auto", y: 0 }, 0);

        timelineRefs.current[index] = timeline;
      });
    };

    layout();
    window.addEventListener("resize", layout);
    document.fonts?.ready.then(layout).catch(() => undefined);

    if (initialLoadAnimation) {
      if (logoRef.current) {
        gsap.fromTo(logoRef.current, { scale: 0.82 }, { duration: 0.5, ease, scale: 1 });
      }

      if (navItemsRef.current) {
        gsap.fromTo(navItemsRef.current, { opacity: 0, y: -6 }, { duration: 0.45, ease, opacity: 1, y: 0 });
      }
    }

    const timelines = timelineRefs.current;
    const activeTweens = activeTweenRefs.current;

    return () => {
      window.removeEventListener("resize", layout);
      timelines.forEach((timeline) => timeline?.kill());
      activeTweens.forEach((tween) => tween?.kill());
      logoTweenRef.current?.kill();
    };
  }, [ease, initialLoadAnimation, items]);

  const handleEnter = (index: number) => {
    const timeline = timelineRefs.current[index];
    if (!timeline) return;
    activeTweenRefs.current[index]?.kill();
    activeTweenRefs.current[index] = timeline.tweenTo(timeline.duration(), {
      duration: 0.28,
      ease,
      overwrite: "auto",
    });
  };

  const handleLeave = (index: number) => {
    const timeline = timelineRefs.current[index];
    if (!timeline) return;
    activeTweenRefs.current[index]?.kill();
    activeTweenRefs.current[index] = timeline.tweenTo(0, {
      duration: 0.2,
      ease,
      overwrite: "auto",
    });
  };

  const handleLogoEnter = () => {
    if (!logoGlyphRef.current) return;
    logoTweenRef.current?.kill();
    gsap.set(logoGlyphRef.current, { rotate: 0 });
    logoTweenRef.current = gsap.to(logoGlyphRef.current, {
      duration: 0.35,
      ease,
      overwrite: "auto",
      rotate: 360,
    });
  };

  const cssVars = {
    "--base": baseColor,
    "--hover-text": hoveredPillTextColor,
    "--pill-bg": pillColor,
    "--pill-text": resolvedPillTextColor,
  } as React.CSSProperties;

  const renderNavLink = (item: PillNavItem, index: number, mobile = false) => {
    const active = isActiveHref(pathname, activeHref, item.href);
    const classNameForLink = mobile ? `mobile-menu-link${active ? " is-active" : ""}` : `pill${active ? " is-active" : ""}`;
    const content = mobile ? (
      item.label
    ) : (
      <>
        <span
          aria-hidden="true"
          className="hover-circle"
          ref={(element) => {
            circleRefs.current[index] = element;
          }}
        />
        <span className="label-stack">
          <span className="pill-label">{item.label}</span>
          <span aria-hidden="true" className="pill-label-hover">
            {item.label}
          </span>
        </span>
      </>
    );

    if (isExternalOrHashLink(item.href)) {
      return (
        <a
          aria-label={item.ariaLabel ?? item.label}
          className={classNameForLink}
          href={item.href}
          onMouseEnter={mobile ? undefined : () => handleEnter(index)}
          onMouseLeave={mobile ? undefined : () => handleLeave(index)}
          role={mobile ? undefined : "menuitem"}
        >
          {content}
        </a>
      );
    }

    return (
      <Link
        aria-label={item.ariaLabel ?? item.label}
        className={classNameForLink}
        href={item.href}
        onMouseEnter={mobile ? undefined : () => handleEnter(index)}
        onMouseLeave={mobile ? undefined : () => handleLeave(index)}
        role={mobile ? undefined : "menuitem"}
      >
        {content}
      </Link>
    );
  };

  return (
    <div className="pill-nav-container">
      <nav aria-label="Primary navigation" className={`pill-nav ${className}`} style={cssVars}>
        <Link
          aria-label="Mystery Scoop home"
          className="pill-logo"
          href="/"
          onMouseEnter={handleLogoEnter}
          ref={logoRef}
        >
          <span className="pill-logo-glyph" ref={logoGlyphRef}>
            <span />
          </span>
          <span className="pill-logo-text">Mystery Scoop</span>
        </Link>

        <div className="pill-nav-items desktop-only" ref={navItemsRef}>
          <ul className="pill-list" role="menubar">
            {items.map((item, index) => (
              <li key={item.href} role="none">
                {renderNavLink(item, index)}
              </li>
            ))}
          </ul>
        </div>

        <details className="pill-mobile-details mobile-only">
          <summary aria-label="Toggle menu" className="mobile-menu-button">
            <span className="hamburger-line" />
            <span className="hamburger-line" />
          </summary>
          <div className="mobile-menu-popover" style={cssVars}>
            <ul className="mobile-menu-list">
              {items.map((item, index) => (
                <li key={item.href}>{renderNavLink(item, index, true)}</li>
              ))}
            </ul>
          </div>
        </details>
      </nav>
    </div>
  );
}
