import type { getPageAccount } from './server/service.server';

export type Account = ArrayElement<AsyncReturnType<typeof getPageAccount>['data']>;
