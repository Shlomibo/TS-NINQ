import { Loopable } from '../types';
export default class ArrayLikeIterable<T> implements Iterable<T> {
    private readonly arrayLike;
    readonly continious: boolean;
    constructor(arrayLike: ArrayLike<T>, continious?: boolean);
    [Symbol.iterator](): IterableIterator<T>;
    static toIterable<T>(it: Loopable<T>): Iterable<T>;
}
export declare function isIterable<T>(obj: any): obj is Iterable<T>;
export declare function isArrayLike<T>(obj: any): obj is ArrayLike<T>;
