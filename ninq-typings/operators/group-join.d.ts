/// <reference types="node" />
import { KeySelector, EqualityComparer } from '../types';
export interface GroupJoinEntry<TOuter, TInner> {
    outer: TOuter;
    inner: Iterable<TInner>;
}
export default class GroupJoinIterable<TOuter, TInner, TKey, TResult> implements Iterable<TResult> {
    private readonly outer;
    private readonly inner;
    private readonly outerSelector;
    private readonly innerSelector;
    private readonly resultSelector;
    private readonly comparer;
    constructor(outer: Iterable<TOuter>, inner: Iterable<TInner>, outerSelector: KeySelector<TOuter, TKey>, innerSelector: KeySelector<TInner, TKey>, resultSelector: KeySelector<GroupJoinEntry<TOuter, TInner>, TResult>, comparer?: EqualityComparer<TKey>);
    [Symbol.iterator](): IterableIterator<TResult>;
}
