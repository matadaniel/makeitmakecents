import { derived, writable } from 'svelte/store';

export const currency = writable('USD');

export const locale = writable(undefined);

export const formatToCurrency = derived(
	[currency, locale],
	([$currency, $locale]) =>
		new Intl.NumberFormat($locale, { style: 'currency', currency: $currency }).format
);
