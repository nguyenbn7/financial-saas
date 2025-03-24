import type { getTransactions } from './server/service.server';

export type Transaction = ArrayElement<AsyncReturnType<typeof getTransactions>>;
