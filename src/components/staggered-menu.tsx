"use client";

import { gsap } from "gsap";
import { useEffect, useLayoutEffect, useRef } from "react";

export type StaggeredMenuItem = {
  key: string;
  label: string;
  ariaLabel: string;
};

type StaggeredMenuProps = {
  open: boolean;
  items: StaggeredMenuItem[];
  activeKey: string;
  children: React.ReactNode;
  colors?: string[];
  accentColor?: string;
  onClose: () => void;
  onSelect: (key: string) => void;
};

export function StaggeredMenu({
  open,
  items,
  activeKey,
  children,
  colors = ["#ffe2ec", "#78dcb9", "#f72c7b"],
  accentColor = "#f72c7b",
  onClose,
  onSelect,
}: StaggeredMenuProps): React.ReactElement {
  const panelRef = useRef<HTMLElement | null>(null);
  const layerRefs = useRef<Array<HTMLDivElement | null>>([]);

  useLayoutEffect(() => {
    const panel = panelRef.current;
    const layers = layerRefs.current.filter(Boolean);
    gsap.set([panel, ...layers], { xPercent: 100 });
  }, []);

  useEffect(() => {
    const panel = panelRef.current;
    const layers = layerRefs.current.filter(Boolean);
    if (!panel) {
      return;
    }

    if (open) {
      gsap.timeline()
        .to(layers, {
          xPercent: 0,
          duration: 0.46,
          ease: "power4.out",
          stagger: 0.06,
        })
        .to(panel, { xPercent: 0, duration: 0.58, ease: "power4.out" }, "-=0.18")
        .fromTo(
          panel.querySelectorAll(".sm-home-item"),
          { yPercent: 130, rotate: 8 },
          { yPercent: 0, rotate: 0, duration: 0.7, ease: "power4.out", stagger: 0.06 },
          "-=0.32",
        )
        .fromTo(
          panel.querySelector(".sm-home-content"),
          { opacity: 0, y: 18 },
          { opacity: 1, y: 0, duration: 0.42, ease: "power2.out" },
          "-=0.32",
        );
      return;
    }

    gsap.to([panel, ...layers], {
      xPercent: 100,
      duration: 0.34,
      ease: "power3.in",
      stagger: 0.025,
    });
  }, [open]);

  return (
    <div className={`sm-home-wrapper ${open ? "is-open" : ""}`} aria-hidden={!open}>
      <button className="sm-home-backdrop" type="button" aria-label="Close profile menu" onClick={onClose} />
      <div className="sm-home-layers" aria-hidden="true">
        {colors.map((color, index) => (
          <div
            className="sm-home-layer"
            key={color}
            ref={(node) => {
              layerRefs.current[index] = node;
            }}
            style={{ background: color }}
          />
        ))}
      </div>
      <aside
        className="sm-home-panel"
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label="Profile menu"
        style={{ ["--sm-home-accent" as string]: accentColor }}
      >
        <div className="sm-home-header">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.16em] text-muted">Mystery Scoop</p>
            <h2 className="mt-1 text-3xl font-black">Your space</h2>
          </div>
          <button className="sm-home-close" type="button" aria-label="Close profile menu" onClick={onClose}>
            ×
          </button>
        </div>

        <div className="sm-home-body">
          <nav className="sm-home-nav" aria-label="Profile sidebar options">
            {items.map((item, index) => (
              <button
                className={`sm-home-item ${activeKey === item.key ? "is-active" : ""}`}
                key={item.key}
                type="button"
                aria-label={item.ariaLabel}
                aria-pressed={activeKey === item.key}
                onClick={() => onSelect(item.key)}
              >
                <span className="sm-home-number">{String(index + 1).padStart(2, "0")}</span>
                <span>{item.label}</span>
              </button>
            ))}
          </nav>
          <div className="sm-home-content">{children}</div>
        </div>
      </aside>
    </div>
  );
}
