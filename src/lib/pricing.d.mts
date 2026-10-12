import type { Currency } from './currency.mjs';

export const prices: Record<Currency, { review: number; monthly: number }>;
export function formatGrouped(amount: number): string;
export function formatPrice(currency: Currency, amount: number): string;
