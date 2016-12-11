import { SortedCollection, Comparer } from '../types';
export declare class TwoThreeTree<T> implements SortedCollection<T> {
    private _root;
    private readonly _comparer;
    constructor(comparer: Comparer<T>);
    add(...items: T[]): void;
    addRange(items: Iterable<T>): void;
    [Symbol.iterator](): Iterator<T>;
    toString(): string;
}
