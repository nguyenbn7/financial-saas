import type { ParseMeta, ParseResult } from 'papaparse';

export enum VARIANTS {
	LIST = 'LIST',
	IMPORT = 'IMPORT'
}

export const INITIAL_IMPORT_RESULTS: ParseResult<unknown> = {
	data: [],
	errors: [],
	meta: {} as ParseMeta
};
