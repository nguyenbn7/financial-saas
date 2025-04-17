import type { getTransactions } from './server/repository';

export type Transaction = ArrayElement<AsyncReturnType<typeof getTransactions>>;
