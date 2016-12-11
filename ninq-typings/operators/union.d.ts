/// <reference types="node" />
import { EqualityComparer } from '../types';
export declare class UnionIterable<T> implements Iterable<T> {
    private readonly left;
    private readonly right;
    private readonly comparer;
    constructor(left: Iterable<T>, right: Iterable<T>, comparer: EqualityComparer<T>);
    [Symbol.iterator](): IterableIterator<T>;
}
