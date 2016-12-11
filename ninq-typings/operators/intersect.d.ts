/// <reference types="node" />
import { EqualityComparer } from '../types';
export default class IntersectionIterator<T> implements Iterable<T> {
    private readonly left;
    private readonly right;
    private readonly comparer;
    constructor(left: Iterable<T>, right: Iterable<T>, comparer: EqualityComparer<T>);
    [Symbol.iterator](): IterableIterator<T>;
}
