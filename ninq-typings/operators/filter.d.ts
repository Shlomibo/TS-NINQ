/// <reference types="node" />
import { Predicate } from '../types';
export default class FilterIterable<T> implements Iterable<T> {
    private readonly it;
    private readonly predicate;
    constructor(it: Iterable<T>, predicate: Predicate<T>);
    [Symbol.iterator](): IterableIterator<T>;
}
