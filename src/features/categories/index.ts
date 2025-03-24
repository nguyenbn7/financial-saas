import type { getPageCategory } from './server/service.server';

export type Category = ArrayElement<AsyncReturnType<typeof getPageCategory>['data']>;
