import { addOns, scoopTiers } from "./data";
import type { CartSelection, CartSummary } from "./types";

export const SHIPPING_CENTS = 499;

export function formatMoney(cents: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(cents / 100);
}

export function calculateCart(selection: CartSelection): CartSummary {
  const tier = scoopTiers.find((candidate) => candidate.id === selection.tierId) ?? scoopTiers[1];
  const selectedAddOns = addOns.filter((addOn) => selection.addOnIds.includes(addOn.id));
  const lines = [
    { label: tier.name, priceCents: tier.priceCents, quantity: 1 },
    ...selectedAddOns.map((addOn) => ({
      label: addOn.name,
      priceCents: addOn.priceCents,
      quantity: 1,
    })),
  ];
  const subtotalCents = lines.reduce(
    (total, line) => total + line.priceCents * line.quantity,
    0,
  );
  const totalCents = subtotalCents + SHIPPING_CENTS;

  return {
    lines,
    subtotalCents,
    shippingCents: SHIPPING_CENTS,
    totalCents,
    pointsEarned: Math.floor(totalCents / 10),
  };
}
