import type { Uuid } from "@lambda-group/scylladb";

export type MergeTuples<T> = T extends [infer Head, ...infer Rest]
	? Head | MergeTuples<Rest>
	: never;

// biome-ignore lint/suspicious/noExplicitAny: any is needed here
export type Reverse<T extends any[]> = T extends [infer First, ...infer Rest]
	? [...Reverse<Rest>, First]
	: [];
// biome-ignore lint/suspicious/noExplicitAny: any is needed here
export type Flatten<T> = T extends any ? MergeTuples<T> : never;

// biome-ignore lint/suspicious/noExplicitAny: any is needed here
export type TupleToUnion<T> = T extends any[] ? T[number] : never;

export type UnionToIntersection<U> =
	// biome-ignore lint/suspicious/noExplicitAny: any is needed here
	(U extends any ? (k: U) => void : never) extends (k: infer I) => void
		? I
		: never;

export type UnionToTuple<U> = UnionToIntersection<
	// biome-ignore lint/suspicious/noExplicitAny: any is needed here
	U extends any ? () => U : never
> extends () => infer R
	? [...UnionToTuple<Exclude<U, R>>, R]
	: [];

export type CombineUnionOfTuples<T> = UnionToTuple<TupleToUnion<Flatten<T>>>;

export type UnionCombinations<T, Keys extends Array<keyof T>> = Keys extends []
	? never
	: Keys extends [infer First, ...infer Rest]
		? First extends keyof T
			? Rest extends Array<keyof T>
				? StrictPick<T, First | Rest[number]> | UnionCombinations<T, Rest>
				: never
			: never
		: never;

export type StrictPick<T, K extends keyof T> = Pick<T, K> & {
	[P in keyof T as P extends K ? never : P]?: never;
};

export const PrimaryKeyProp = Symbol("PrimaryKeyProp");
export type IsAny<T> = 0 extends 1 & T ? true : false;
export type Scalar =
	| boolean
	| number
	| string
	| bigint
	| symbol
	| Date
	| Uuid
	| { toHexString(): string };
export type UnwrapPrimary<T> = T extends Scalar ? T : Primary<T>;
// biome-ignore lint/suspicious/noExplicitAny: any is needed here
type ReadonlyPrimary<T> = T extends any[] ? Readonly<T> : T;
type PrimaryPropToType<T, Keys extends (keyof T)[]> = {
	[Index in keyof Keys]: UnwrapPrimary<T[Extract<Keys[Index], keyof T>]>;
};
export type Primary<T> = IsAny<T> extends true
	? // biome-ignore lint/suspicious/noExplicitAny: any is needed here
		any
	: T extends { [PrimaryKeyProp]?: infer PK }
		? PK extends keyof T
			? ReadonlyPrimary<UnwrapPrimary<T[PK]>>
			: PK extends (keyof T)[]
				? ReadonlyPrimary<PrimaryPropToType<T, PK>>
				: PK
		: never;

export type PrimaryProperty<T> = T extends { [PrimaryKeyProp]?: infer PK }
	? PK extends keyof T
		? PK
		: // biome-ignore lint/suspicious/noExplicitAny: any is needed here
			PK extends any[]
			? PK[number]
			: never
	: never;

export type IPrimaryKeyValue = number | string | bigint | Date;
export type IPrimaryKey<T extends IPrimaryKeyValue = IPrimaryKeyValue> = T;

export type FilterQuery<T> = Reverse<
	CombineUnionOfTuples<Primary<T>>
> extends (keyof T)[]
	? UnionCombinations<T, Reverse<CombineUnionOfTuples<Primary<T>>>>
	: never;
