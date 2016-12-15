import { Comparer, Loopable } from '../types';
/**
 * An iterable that is sorted
 *
 * @export
 * @interface SortedIterable
 * @extends {Iterable<T>}
 * @template T
 */
export interface SortedIterable<T> extends Iterable<T> {
    /**
     * Performs a subsequent ordering of the elements in a sequence in specified order by using a specified comparer
     *
     * @param {Comparer<T>} comparer - A comparer function to compare keys
     * @param {boolean} [descending] - true for descending order; otherwise ascending order would be used
     * @returns {SortedIterable<T>} - A SortedIterable whose elements are sorted
     *
     * @memberOf SortedIterable
     */
    thenBy(comparer: Comparer<T>, descending?: boolean): SortedIterable<T>;
}
export declare class SortingIterable<T> implements SortedIterable<T> {
    protected readonly iterable: Iterable<T>;
    private readonly _comparer;
    constructor(iterable: Iterable<T>, comparer: Comparer<T>, descending?: boolean);
    [Symbol.iterator](): IterableIterator<T>;
    thenBy(comparer: Comparer<T>, descending?: boolean): SortedIterable<T>;
    protected sort(it: Iterable<T>): IterableIterator<T>;
}
export default SortingIterable;
export declare function isSortedIterable<T>(iterable: Loopable<T>): iterable is SortedIterable<T>;
