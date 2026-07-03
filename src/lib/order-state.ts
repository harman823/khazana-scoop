import type { CustomerOrder, OrderStatus } from "./types";

const transitions: Record<OrderStatus, OrderStatus[]> = {
  Pending: ["Awaiting Approval", "Scooped", "Cancelled"],
  "Awaiting Approval": ["Scooped", "Cancelled"],
  Scooped: ["Shipped", "Cancelled"],
  Shipped: ["Delivered"],
  Delivered: [],
  Cancelled: [],
};

export function canTransition(from: OrderStatus, to: OrderStatus): boolean {
  return transitions[from].includes(to);
}

export function canReScoop(order: CustomerOrder, now: Date = new Date()): boolean {
  if (order.status !== "Awaiting Approval") {
    return false;
  }
  if (!order.approvalExpiresAt) {
    return false;
  }
  if (order.reScoopCount >= order.reScoopLimit) {
    return false;
  }
  return new Date(order.approvalExpiresAt).getTime() > now.getTime();
}

export function approvalSecondsRemaining(order: CustomerOrder, now: Date = new Date()): number {
  if (!order.approvalExpiresAt) {
    return 0;
  }
  const diffMs = new Date(order.approvalExpiresAt).getTime() - now.getTime();
  return Math.max(0, Math.floor(diffMs / 1000));
}
