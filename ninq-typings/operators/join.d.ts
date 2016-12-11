/// <reference types="node" />
import { KeySelector, EqualityComparer } from '../types';
export interface JoinMatch<TOuter, TInner> {
    outer: TOuter;
    inner: TInner;
}
export default class JoinIterable<TOuter, TInner, TKey> implements Iterable<JoinMatch<TOuter, TInner>> {
    private readonly outer;
    private readonly inner;
    private readonly outerKeySelector;
    private readonly innerKeySelector;
    private readonly comparer;
    constructor(outer: Iterable<TOuter>, inner: Iterable<TInner>, outerKeySelector: KeySelector<TOuter, TKey>, innerKeySelector: KeySelector<TInner, TKey>, comparer?: EqualityComparer<TKey>);
    [Symbol.iterator](): IterableIterator<JoinMatch<TOuter, TInner>>;
    private iterateWithMap();
    private iterateWithComparer();
}
