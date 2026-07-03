import { EcommerceFooter } from "./ecommerce-footer";
import { PillNav } from "./pill-nav";

const pageNavItems = [
  { label: "Products", href: "/products" },
  { label: "Scoops", href: "/mystery-scoops" },
  { label: "Cart", href: "/cart" },
  { label: "Orders", href: "/orders" },
  { label: "Profile", href: "/profile" },
  { label: "Admin", href: "/admin" },
];

export function PageChrome({
  children,
  title,
  subtitle,
}: {
  children: React.ReactNode;
  title: string;
  subtitle: string;
}): React.ReactElement {
  return (
    <main className="min-h-screen">
      <header className="shell page-pill-header">
        <PillNav
          baseColor="#1e293b"
          className="page-pill-nav"
          hoveredPillTextColor="#ffffff"
          items={pageNavItems}
          pillColor="#fffdf5"
          pillTextColor="#1e293b"
        />
      </header>
      <section className="shell py-8">
        <h1 className="text-5xl font-black leading-tight">{title}</h1>
        <p className="mt-3 max-w-2xl text-lg leading-8 text-muted">{subtitle}</p>
      </section>
      <section className="shell">{children}</section>
      <EcommerceFooter />
    </main>
  );
}
