import { Loopable } from '../types';
export default class ArrayLikeIterable<T> implements Iterable<T> {
    protected readonly arrayLike: ArrayLike<T>;
    readonly startIndex: number;
    readonly continious: boolean;
    constructor(arrayLike: ArrayLike<T>, startIndex?: number, continious?: boolean);
    [Symbol.iterator](): IterableIterator<T>;
    static toIterable<T>(it: Loopable<T>): Iterable<T>;
}
export declare class ReverseArrayLikeIterable<T> extends ArrayLikeIterable<T> {
    constructor(arrayLike: ArrayLike<T>, startIndex?: number, continious?: boolean);
    [Symbol.iterator](): IterableIterator<T>;
}
export declare function isIterable<T>(obj: any): obj is Iterable<T>;
export declare function isArrayLike<T>(obj: any): obj is ArrayLike<T>;
