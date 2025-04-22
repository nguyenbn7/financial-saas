import { CLERK_SECRET_KEY } from '$env/static/private';
import { PUBLIC_CLERK_PUBLISHABLE_KEY } from '$env/static/public';

import { differenceInDays, parse, subDays } from 'date-fns';

import { Hono } from 'hono';
import { clerkMiddleware } from '@hono/clerk-auth';
import { zValidator } from '@hono/zod-validator';

import { calculatePercentageChange, fillMissingDays } from '$lib';

import { clerkMiddlewareAuthenticated } from '$lib/server/api/middleware';

import { querySummarySchema } from '$features/summary/schema';
import {
	getFinancialData,
	getCategoriesByFinancialData,
	getActiveDays
} from '$features/summary/server/service';

const app = new Hono()
	.use(
		clerkMiddleware({
			secretKey: CLERK_SECRET_KEY,
			publishableKey: PUBLIC_CLERK_PUBLISHABLE_KEY
		})
	)
	.use(clerkMiddlewareAuthenticated())
	.get('/', zValidator('query', querySummarySchema), async (c) => {
		const { userId } = c.var;
		const { from, to, accountId } = c.req.valid('query');

		const defaultTo = new Date();
		const defaultFrom = subDays(defaultTo, 30);

		const startDate = from ? parse(from, 'yyyy-MM-dd', new Date()) : defaultFrom;
		const endDate = to ? parse(to, 'yyyy-MM-dd', new Date()) : defaultTo;

		const periodLength = differenceInDays(endDate, startDate) + 1;
		const lastPeriodStart = subDays(startDate, periodLength);
		const lastPeriodEnd = subDays(endDate, periodLength);

		const [currentPeriod] = await getFinancialData({ userId, startDate, endDate, accountId });
		const [lastPeriod] = await getFinancialData({
			userId,
			startDate: lastPeriodStart,
			endDate: lastPeriodEnd,
			accountId
		});

		const incomeChange = calculatePercentageChange(currentPeriod.income, lastPeriod.income);
		const expenseChange = calculatePercentageChange(currentPeriod.expense, lastPeriod.expense);
		const remainingChange = calculatePercentageChange(
			currentPeriod.remaining,
			lastPeriod.remaining
		);

		const categories = await getCategoriesByFinancialData({
			userId,
			startDate,
			endDate,
			accountId
		});

		const topCategories = categories.slice(0, 3);
		const otherCategories = categories.slice(3);
		const otherSum = otherCategories.reduce((sum, current) => sum + current.value, 0);
		const finalCategories = topCategories;
		if (otherCategories.length > 0) {
			finalCategories.push({ name: 'Other', value: otherSum });
		}

		const activeDays = await getActiveDays({
			userId,
			startDate,
			endDate,
			accountId
		});

		const days = fillMissingDays(activeDays, startDate, endDate);

		return c.json({
			remainingAmount: currentPeriod.remaining,
			remainingChange,
			incomeAmount: currentPeriod.income,
			incomeChange,
			expenseAmount: currentPeriod.expense,
			expenseChange,
			categories: finalCategories,
			days
		});
	});

export default app;
