import { formatRM } from "./money";

type OrderLike = {
  number: string;
  customerName: string;
  phone: string;
  address: string;
  area: string;
  notes?: string | null;
  subtotalSen: number;
  deliveryFeeSen: number;
  totalSen: number;
  items: { name: string; quantity: number; unitPriceSen: number }[];
};

export function whatsappMessage(order: OrderLike): string {
  const lines = order.items.map(
    (i) => `- ${i.quantity} x ${i.name} (${formatRM(i.unitPriceSen * i.quantity)})`,
  );
  return [
    `Hi CleanHome, I'd like to place an order (${order.number}).`,
    "",
    ...lines,
    "",
    `Subtotal: ${formatRM(order.subtotalSen)}`,
    `Delivery: ${order.deliveryFeeSen === 0 ? "FREE" : formatRM(order.deliveryFeeSen)}`,
    `Total: ${formatRM(order.totalSen)}`,
    "",
    `Name: ${order.customerName}`,
    `Phone: ${order.phone}`,
    `Address: ${order.address}, ${order.area}`,
    ...(order.notes ? [`Notes: ${order.notes}`] : []),
  ].join("\n");
}

export function whatsappUrl(number: string, message: string): string {
  return `https://wa.me/${number.replace(/\D/g, "")}?text=${encodeURIComponent(message)}`;
}
