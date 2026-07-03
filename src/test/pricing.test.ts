import { describe, expect, it } from "vitest";
import { calculateCart, SHIPPING_CENTS } from "@/lib/pricing";

describe("calculateCart", () => {
  it("calculates tier, add-ons, shipping, and points", () => {
    const cart = calculateCart({
      tierId: "large",
      addOnIds: ["re-scoop", "lucky-capsule"],
    });

    expect(cart.subtotalCents).toBe(2497);
    expect(cart.shippingCents).toBe(SHIPPING_CENTS);
    expect(cart.totalCents).toBe(2996);
    expect(cart.pointsEarned).toBe(299);
    expect(cart.lines.map((line) => line.label)).toEqual([
      "Large Scoop",
      "Re-scoop",
      "Lucky capsule",
    ]);
  });
});
