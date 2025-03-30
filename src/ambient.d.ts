type MaybePromise<T> = T | Promise<T> | PromiseLike<T>;

type ArrayElement<ArrayType extends readonly unknown[]> =
	ArrayType extends readonly (infer ElementType)[] ? ElementType : never;

type AsyncReturnType<T extends (...args: never) => Promise<unknown>> = T extends (
	...args: any
) => Promise<infer R>
	? R
	: unknown;

type Pagination<TData> = {
	page: number;
	pageSize: number;
	totalRecords: number;
	data: TData[];
};
