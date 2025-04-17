export const locales: Intl.LocalesArgument = 'en-US';

export const options: Intl.NumberFormatOptions = {
	style: 'currency',
	currency: 'USD',
	maximumFractionDigits: 2,
	minimumFractionDigits: 2
};

export const formatter = Intl.NumberFormat(locales, options);
