export type ReductionFunc<T, U> = (aggregate: U | undefined, item: T, index: number) => U;
export type Predicate<T> = (item: T, index: number) => boolean;
export type KeySelector<T, U> = (item: T) => U;
export type Mapping<T, U> = (item: T, index: number) => U;
export type EqualityComparer<T> = (left: T, right: T) => boolean;
export type Comparable = number | string;
export type Comparer<T> = (left: T, right: T) => number;
export type ComparisonFunc<T, R> = (x: T, y: T) => R;

export interface SortedCollection<T> extends Iterable<T> {
	add(...items: T[]): void;
	addRange(items: T[]): void;
}
