import { eachDayOfInterval, isSameDay } from 'date-fns';

function _delay(minSeconds: number, maxSeconds: number) {
	const min = Math.ceil(minSeconds * 1000);
	const max = Math.floor(maxSeconds * 1000);
	return Math.floor(Math.random() * (max - min + 1)) + min;
}

export async function delay(minSeconds: number, maxSeconds: number): Promise<void> {
	return new Promise((fullfill) => setTimeout(fullfill, _delay(minSeconds, maxSeconds)));
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
