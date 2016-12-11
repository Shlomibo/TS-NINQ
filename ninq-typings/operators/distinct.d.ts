/// <reference types="node" />
import { EqualityComparer } from '../types';
export interface Tracker<T> {
    wasReturned(item: T): boolean;
}
export declare class ComparerTracker<T> implements Tracker<T> {
    private readonly comparer;
    private readonly prevItems;
    constructor(comparer: EqualityComparer<T>, items?: Iterable<T>);
    wasReturned(item: T): boolean;
}
export default class DistinctIterable<T> implements Iterable<T> {
    private readonly it;
    private readonly tracker;
    constructor(it: Iterable<T>, comparer?: EqualityComparer<T>);
    [Symbol.iterator](): IterableIterator<T>;
}
