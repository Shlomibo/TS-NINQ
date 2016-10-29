import { Comparer } from '../types';
import { TwoThreeTree } from '../modules/2-3-tree';

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
	thenBy(
		comparer: Comparer<T>,
		descending?: boolean
	): SortedIterable<T>;
}

export class SortingIterable<T> implements SortedIterable<T> {

	private readonly _comparer: Comparer<T>;

	constructor(
		protected readonly iterable: Iterable<T>,
		comparer: Comparer<T>,
		descending = false
	) {
		this._comparer = descending
			? inverter
			: comparer;

		function inverter(x: T, y: T) {
			const cmp = comparer(x, y);
			if (cmp < 0) {
				return 1;
			}
			else if (cmp === 0) {
				return 0;
			}
			else {
				return -1;
			}
		}
	}
	[Symbol.iterator]() {
		return this.sort(this.iterable);
	}

	thenBy(
		comparer: Comparer<T>,
		descending = false
	): SortedIterable<T> {

		return new SubSort(
			this,
			this.iterable,
			comparer,
			descending
		);
	}

	protected *sort(it: Iterable<T>) {
		const sorted = new TwoThreeTree<T>(this._comparer);
		sorted.addRange(it);

		yield* sorted;
	}
}
export default SortingIterable;

class SubSort<T> extends SortingIterable<T> {
	constructor(
		private readonly parent: SortingIterable<T>,
		iterable: Iterable<T>,
		comparer: Comparer<T>,
		descending = false
	) {
		super(iterable, comparer, descending);
	}
	[Symbol.iterator]() {
		const subSort = this.sort(this.iterable);
		return this.sort.call(this.parent, subSort);
	}
}

export function isSortedIterable<T>(iterable: Iterable<T>)
	: iterable is SortedIterable<T> {

	return typeof (iterable as any).thenBy === 'function';
}