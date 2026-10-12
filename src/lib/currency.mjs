export const currencyKey = 'clearfig.currency';
export function isCurrency(value) { return ['INR', 'AED', 'GBP'].includes(value); }
export function currencyForCountry(country) {
  const code = typeof country === 'string' ? country.toUpperCase() : '';
  if (code === 'AE') return 'AED';
  if (code === 'GB') return 'GBP';
  return 'INR';
}
export function savedCurrency(storage) {
  try { const value = storage?.getItem(currencyKey); return isCurrency(value) ? value : null; }
  catch { return null; }
}
export function saveCurrency(storage, value) {
  if (!isCurrency(value)) return;
  try { storage?.setItem(currencyKey, value); } catch { /* Session choice still works. */ }
}
export async function detectCurrency(fetcher, signal) {
  try {
    const response = await fetcher('/api/country', { signal, cache: 'no-store', credentials: 'same-origin' });
    if (!response.ok) return 'INR';
    const data = await response.json();
    return currencyForCountry(data?.country);
  } catch { return 'INR'; }
}
