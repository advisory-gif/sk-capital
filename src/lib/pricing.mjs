/** Approved public fees. India, the UAE and the UK only. */
export const prices = {
  INR: { review: 35000, monthly: 25000 },
  AED: { review: 7500, monthly: 4500 },
  GBP: { review: 2500, monthly: 1500 },
};

export function formatGrouped(amount) {
  return String(amount).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

export function formatPrice(currency, amount) {
  const grouped = formatGrouped(amount);
  if (currency === 'INR') return `₹${grouped}`;
  if (currency === 'AED') return `AED ${grouped}`;
  if (currency === 'GBP') return `£${grouped}`;
  return grouped;
}
