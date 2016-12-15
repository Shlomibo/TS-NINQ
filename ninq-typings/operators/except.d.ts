import { EqualityComparer } from '../types';
export default class ExceptIterable<T> implements Iterable<T> {
    private readonly left;
    private readonly right;
    private readonly comparer;
    constructor(left: Iterable<T>, right: Iterable<T>, comparer?: EqualityComparer<T>);
    [Symbol.iterator](): IterableIterator<T>;
}
