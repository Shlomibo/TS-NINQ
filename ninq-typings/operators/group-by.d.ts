/// <reference types="node" />
import { KeySelector, EqualityComparer } from '../types';
export interface Grouping<TKey, TElement> extends Iterable<TElement> {
    readonly key: TKey;
}
export default class GroupingIterable<TSource, TKey, TElement> implements Iterable<Grouping<TKey, TElement>> {
    private readonly iterable;
    private readonly keySelector;
    private readonly elementSelector;
    private readonly comparer;
    constructor(iterable: Iterable<TSource>, keySelector: KeySelector<TSource, TKey>, elementSelector: KeySelector<TSource, TElement>, comparer?: EqualityComparer<TKey>);
    [Symbol.iterator](): IterableIterator<Grouping<TKey, TElement>>;
}
