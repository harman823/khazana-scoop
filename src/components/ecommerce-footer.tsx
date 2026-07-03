import Link from "next/link";
import { ExternalLink } from "lucide-react";
import { BrandMark } from "./brand-mark";

const footerGroups = [
  {
    title: "Product",
    links: ["Mystery scoops", "Lucky capsules", "Charm mixes", "Gift hampers", "Live packing"],
  },
  {
    title: "Resources",
    links: ["How it works", "Scoop points", "Re-scoop policy", "Shipping guide", "FAQs"],
  },
  {
    title: "Solutions",
    links: ["Collectors", "Gifting", "Party favors", "Bulk orders", "Creator drops"],
  },
  {
    title: "Company",
    links: ["About", "Contact", "Careers", "Partnerships", "Admin"],
  },
  {
    title: "Legal",
    links: ["Privacy", "Terms", "Refund policy", "Cookie policy"],
  },
];

const socialLinks = [
  { label: "Instagram", mark: "IG" },
  { label: "YouTube", mark: "YT" },
  { label: "Facebook", mark: "FB" },
  { label: "LinkedIn", mark: "IN" },
];

export function EcommerceFooter(): React.ReactElement {
  return (
    <footer className="site-footer">
      <div className="site-footer-container">
        <section className="footer-promo-card" aria-labelledby="footer-promo-title">
          <h2 id="footer-promo-title">Build your next surprise scoop.</h2>
          <p>
            Pick a size, choose your favorite tiny treasures, and let our packing team turn it
            into a bright collectible moment.
          </p>
          <Link className="footer-promo-button focus-ring" href="/mystery-scoops">
            Start your scoop
          </Link>
        </section>

        <section className="footer-links-region" aria-label="Footer navigation">
          <div className="footer-logo-column">
            <BrandMark />
            <p>Small surprises, packed with care and tracked from scoop to shipment.</p>
          </div>
          <div className="footer-link-grid">
            {footerGroups.map((group) => (
              <div className="footer-link-group" key={group.title}>
                <h3>{group.title}</h3>
                <ul>
                  {group.links.map((item) => (
                    <li key={item}>
                      <Link href={footerHrefFor(item)}>{item}</Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        <section className="footer-bottom-bar">
          <div className="footer-status-cluster">
            <span>© {new Date().getFullYear()} Mystery Scoop</span>
            <Link className="footer-status-link" href="/admin/fulfillment">
              <span className="footer-status-dot" />
              All Systems Operational
              <ExternalLink size={12} strokeWidth={2.4} />
            </Link>
          </div>
          <div className="footer-social-row" aria-label="Social links">
            {socialLinks.map(({ label, mark }) => (
              <Link aria-label={label} href="/contact" key={label}>
                <span>{mark}</span>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </footer>
  );
}

function footerHrefFor(label: string): string {
  const routes: Record<string, string> = {
    About: "/about",
    Admin: "/admin",
    Contact: "/contact",
    "Gift hampers": "/products/gift-hampers",
    "Lucky capsules": "/products/lucky-capsules",
    "Mystery scoops": "/mystery-scoops",
    "Re-scoop policy": "/about",
    "Shipping guide": "/tracking",
  };

  return routes[label] ?? "/products";
}
