import { Mapping } from '../types';
export declare class MappingIterable<TSource, TResult> implements Iterable<TResult> {
    private readonly iterable;
    private readonly mapping;
    constructor(iterable: Iterable<TSource>, mapping: Mapping<TSource, TResult>);
    [Symbol.iterator](): IterableIterator<TResult>;
}
export declare class MapManyIterable<TSource, TCollection, TResult> implements Iterable<TResult> {
    private readonly iterable;
    private readonly seqMapping;
    private readonly resultMapping;
    constructor(iterable: Iterable<TSource>, seqMapping: Mapping<TSource, Iterable<TCollection>>, resultMapping: Mapping<TCollection, TResult>);
    [Symbol.iterator](): IterableIterator<TResult>;
}
