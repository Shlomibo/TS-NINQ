import { Ninq } from './ninq';
export declare type ReductionFunc<T, U> = (this: void, aggregate: U | undefined, item: T, index: number) => U;
export declare type Predicate<T> = (this: void, item: T, index: number) => boolean;
export declare type KeySelector<T, U> = (this: void, item: T) => U;
export declare type Mapping<T, U> = (this: void, item: T, index: number) => U;
export declare type EqualityComparer<T> = (this: void, left: T, right: T) => boolean;
export declare type Comparable = number | string;
export declare type Comparer<T> = (this: void, left: T, right: T) => number;
export declare type ComparisonFunc<T, R> = (this: void, x: T, y: T) => R;
export declare type Loopable<T> = Iterable<T> | ArrayLike<T>;
export declare type Generator<T> = (...args: any[]) => Iterable<T>;
export declare type Action = (this: void) => void;
export declare type Action1<T> = (this: void, arg: T) => void;
export declare type Action2<T1, T2> = (this: void, arg1: T1, arg2: T2) => void;
export declare type Action3<T1, T2, T3> = (this: void, arg1: T1, arg2: T2, arg3: T3) => void;
export interface SortedCollection<T> extends Iterable<T> {
    add(this: SortedCollection<T>, ...items: T[]): void;
    addRange(this: SortedCollection<T>, items: T[]): void;
}
export interface Hash<T> {
    [key: string]: T;
}
export interface Lookup<K, V> extends Map<K, Iterable<V>> {
}
export interface NinqLookup<K, V> extends Map<K, Ninq<V>> {
}
