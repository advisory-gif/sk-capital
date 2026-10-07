export const currencyKey = 'skcapital.currency';
export function isCurrency(value) { return ['INR', 'USD', 'AED'].includes(value); }
export function currencyForCountry(country) {
  const code = typeof country === 'string' ? country.toUpperCase() : '';
  return code === 'IN' ? 'INR' : code === 'AE' ? 'AED' : 'USD';
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
    if (!response.ok) return 'USD';
    const data = await response.json();
    return currencyForCountry(data?.country);
  } catch { return 'USD'; }
}
