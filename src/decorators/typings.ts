export const PrimaryKeyProp = Symbol("PrimaryKeyProp");

// biome-ignore lint/suspicious/noExplicitAny: Just validating if the type is an array
export type AnyArray = any[];

export type Primary<T> = T extends { [PrimaryKeyProp]?: infer PK }
	? PK
	: unknown;

export type Flatten<T> = T extends [infer F, ...infer R]
	? [...(F extends AnyArray ? F : [F]), ...Flatten<R>]
	: [];

export type UnionCombinations<
	T,
	Keys extends Array<keyof T>,
	AccumulatedKeys extends Array<keyof T> = [],
> = Keys extends [infer First, ...infer Rest]
	? First extends keyof T
		? Rest extends Array<keyof T>
			?
					| StrictPick<T, First | AccumulatedKeys[number]>
					| UnionCombinations<T, Rest, [First, ...AccumulatedKeys]>
			: never
		: never
	: never;

export type StrictPick<T, K extends keyof T> = Pick<T, K> & {
	[P in keyof T as P extends K ? never : P]?: never;
};

export type NonFilteredQuery<T extends { [PrimaryKeyProp]?: AnyArray }> =
	UnionCombinations<T, Flatten<Primary<T>>>;

export type FilterQuery<T extends { [PrimaryKeyProp]?: AnyArray }> =
	| NonFilteredQuery<T>
	| ({ allowFiltering: true } & Partial<T>);
