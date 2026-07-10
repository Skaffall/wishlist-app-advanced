export function formatPrice(price?: string): string | null {
  if (!price) return null;
  const numeric = Number(price.replace(/[^0-9.-]/g, ""));
  if (Number.isNaN(numeric)) return null;
  return `$${numeric.toFixed(2)}`;
}
