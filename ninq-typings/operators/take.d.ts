import { Predicate } from '../types';
export declare class TakeWhileIterable<T> implements Iterable<T> {
    private readonly iterable;
    private readonly predicate;
    constructor(iterable: Iterable<T>, predicate: Predicate<T>);
    [Symbol.iterator](): IterableIterator<T>;
}
