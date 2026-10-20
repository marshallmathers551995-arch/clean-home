import { randomBytes } from "node:crypto";

// No 0/O/1/I so numbers are easy to read out over WhatsApp. 32 symbols, so a random byte maps evenly.
const ALPHABET = "23456789ABCDEFGHJKLMNPQRSTUVWXYZ";

/** Random and unguessable, so order pages (which show name and address) can't be found by counting. */
export function generateOrderNumber(): string {
  let suffix = "";
  for (const byte of randomBytes(8)) suffix += ALPHABET[byte % ALPHABET.length];
  return `CH-${suffix}`;
}
