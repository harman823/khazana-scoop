import { describe, expect, it } from "vitest";
import { approvalSecondsRemaining, canReScoop, canTransition } from "@/lib/order-state";
import type { CustomerOrder } from "@/lib/types";

const baseOrder: CustomerOrder = {
  id: "MS-TEST",
  tierName: "Medium Scoop",
  status: "Awaiting Approval",
  itemCount: 1,
  createdAt: "2026-07-02",
  totalCents: 3796,
  approvalExpiresAt: "2026-07-02T10:05:00.000Z",
  reScoopCount: 0,
  reScoopLimit: 1,
};

describe("order state rules", () => {
  it("allows only explicit status transitions", () => {
    expect(canTransition("Pending", "Awaiting Approval")).toBe(true);
    expect(canTransition("Pending", "Shipped")).toBe(false);
    expect(canTransition("Scooped", "Shipped")).toBe(true);
  });

  it("allows re-scoop within approval window and limit", () => {
    expect(canReScoop(baseOrder, new Date("2026-07-02T10:02:00.000Z"))).toBe(true);
    expect(approvalSecondsRemaining(baseOrder, new Date("2026-07-02T10:04:00.000Z"))).toBe(60);
  });

  it("blocks expired or exhausted re-scoops", () => {
    expect(canReScoop(baseOrder, new Date("2026-07-02T10:06:00.000Z"))).toBe(false);
    expect(canReScoop({ ...baseOrder, reScoopCount: 1 }, new Date("2026-07-02T10:02:00.000Z"))).toBe(false);
    expect(canReScoop({ ...baseOrder, status: "Pending" }, new Date("2026-07-02T10:02:00.000Z"))).toBe(false);
  });
});
