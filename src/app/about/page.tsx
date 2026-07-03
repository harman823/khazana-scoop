import { PageChrome } from "@/components/page-chrome";

export default function AboutPage(): React.ReactElement {
  return (
    <PageChrome
      title="About Mystery Scoop"
      subtitle="We pack collectible surprise scoops with clear tracking, rewards, and a customer-first approval flow."
    >
      <div className="grid gap-6 md:grid-cols-3">
        {[
          ["Hand-packed", "Every scoop is assembled with a balanced mix of charms, crystals, stationery, and miniatures."],
          ["Watch the reveal", "Packing media can be attached to each order so customers can see the moment their scoop comes together."],
          ["Built for trust", "Inventory, orders, payments, and rewards are managed with production database flows."],
        ].map(([title, body]) => (
          <section className="app-card p-6" key={title}>
            <h2 className="text-xl font-black">{title}</h2>
            <p className="mt-3 text-sm leading-6 text-muted">{body}</p>
          </section>
        ))}
      </div>
    </PageChrome>
  );
}
