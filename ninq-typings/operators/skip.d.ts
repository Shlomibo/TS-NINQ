/// <reference types="node" />
import { Predicate } from '../types';
export declare class SkippingIterable<T> implements Iterable<T> {
    private readonly iterable;
    private readonly predicate;
    constructor(iterable: Iterable<T>, predicate: Predicate<T>);
    [Symbol.iterator](): IterableIterator<T>;
}
