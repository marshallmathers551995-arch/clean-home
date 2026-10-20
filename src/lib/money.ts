/** Format integer sen as "RM 6.90". */
export function formatRM(sen: number): string {
  return `RM ${(sen / 100).toFixed(2)}`;
}
