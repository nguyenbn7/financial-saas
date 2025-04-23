import { eachDayOfInterval, format, isSameDay, subDays } from 'date-fns';

function _delay(minSeconds: number, maxSeconds: number) {
	const min = Math.ceil(minSeconds * 1000);
	const max = Math.floor(maxSeconds * 1000);
	return Math.floor(Math.random() * (max - min + 1)) + min;
}

export async function delay(minSeconds: number, maxSeconds: number): Promise<void> {
	return new Promise((fullfill) => setTimeout(fullfill, _delay(minSeconds, maxSeconds)));
}

export function formatCurrency(value: number) {
	return new Intl.NumberFormat('en-US', {
		style: 'currency',
		currency: 'USD',
		minimumFractionDigits: 2
	}).format(value);
}

export function convertAmountFromMiliunits(amount: number) {
	return amount / 1000;
}

export function convertAmountToMiliunits(amount: number) {
	return Math.round(amount * 1000);
}

export function calculatePercentageChange(current: number, previous: number) {
	if (previous === 0) {
		return previous === current ? 0 : 100;
	}

	return ((current - previous) * 100) / previous;
}

export function fillMissingDays(
	activeDays: {
		date: Date;
		income: number;
		expense: number;
	}[],
	startDate: Date,
	endDate: Date
) {
	if (activeDays.length === 0) {
		return [];
	}

	const allDays = eachDayOfInterval({
		start: startDate,
		end: endDate
	});

	const transactionsByDay = allDays.map((day) => {
		const found = activeDays.find((d) => isSameDay(d.date, day));

		if (found) {
			return found;
		} else {
			return {
				date: day,
				income: 0,
				expense: 0
			};
		}
	});

	return transactionsByDay;
}

type Period = {
	from?: string | Date;
	to?: string | Date;
};

export function formatDateRange(period: Period = {}) {
	const defaultTo = new Date();
	const defaultFrom = subDays(defaultTo, 30);

	const { from, to } = period;

	if (!from) return `${format(defaultFrom, 'LLL dd')} - ${format(defaultTo, 'LLL dd, y')}`;

	if (to) return `${format(from, 'LLL dd')} - ${format(to, 'LLL dd, y')}`;

	return `${format(from, 'LLL dd, y')}`;
}

export function formatPercentage(
	value: number,
	options: { addPrefix?: boolean } = { addPrefix: false }
) {
	const result = new Intl.NumberFormat('en-US', {
		style: 'percent'
	}).format(value);

	if (options.addPrefix && value > 0) {
		return `+${result}`;
	}

	return result;
}