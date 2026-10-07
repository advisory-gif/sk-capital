export type Currency = 'INR' | 'USD' | 'AED';
export const currencyKey: string;
export function isCurrency(value: unknown): value is Currency;
export function currencyForCountry(country: unknown): Currency;
export function savedCurrency(storage: Pick<Storage, 'getItem'> | undefined): Currency | null;
export function saveCurrency(storage: Pick<Storage, 'setItem'> | undefined, value: Currency): void;
export function detectCurrency(fetcher: typeof fetch, signal?: AbortSignal): Promise<Currency>;
