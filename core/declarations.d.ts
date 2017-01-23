import { Ninq } from './ninq';
export type ReductionFunc<T, U> = (this: void, aggregate: U | undefined, item: T, index: number) => U;
export type Predicate<T> = (this: void, item: T, index: number) => boolean;
export type KeySelector<T, U> = (this: void, item: T) => U;
export type Mapping<T, U> = (this: void, item: T, index: number) => U;
export type EqualityComparer<T> = (this: void, left: T, right: T) => boolean;
export type Comparable = number | string;
export type Comparer<T> = (this: void, left: T, right: T) => number;
export type ComparisonFunc<T, R> = (this: void, x: T, y: T) => R;
export type Loopable<T> = Iterable<T> | ArrayLike<T>;
export type Generator<T> = (...args: any[]) => Iterable<T>;
export type Action = (this: void) => void;
export type Action1<T> = (this: void, arg: T) => void;
export type Action2<T1, T2> = (this: void, arg1: T1, arg2: T2) => void;
export type Action3<T1, T2, T3> = (this: void, arg1: T1, arg2: T2, arg3: T3) => void;

export interface SortedCollection<T> extends Iterable<T> {
	add(this: SortedCollection<T>, ...items: T[]): void;
	addRange(this: SortedCollection<T>, items: T[]): void;
}

export interface IndexedHash<Key, Index extends Key> {
	[key: string]: Key;
	[index: number]: Index;
}
export interface Hash<T> extends IndexedHash<T, T> { }

export interface Lookup<K, V> extends Map<K, Ninq<V>> { }
export interface NinqLookup<K, V> extends Map<K, Ninq<V>> { }
export type NotNull = {} | boolean | number | string | symbol;

export interface Constructor<T> {
	new (): T;
}
