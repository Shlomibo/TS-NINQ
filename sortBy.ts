import { Comparer, Loopable, Comparable } from './core/declarations';
import { TwoThreeTree } from './core/2-3-tree';
import { Ninq } from './core/ninq';
import ArrayLikeIterable from './core/array-like-iterable';
import {
	iterable,
	comparer as compSym,
} from './core/symbols';

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

export class SortingIterable<T> extends Ninq<T> implements SortedIterable<T> {

	constructor(
		iterable: Iterable<T>,
		comparer: Comparer<T>,
		descending = false
	) {
		const actualComparer = descending
			? inverter
			: comparer;

		super({
			[Symbol.iterator]() {
				return SortingIterable._sort(iterable, actualComparer);
			}
		});
		this[compSym] = actualComparer;

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

	thenBy(
		comparer: Comparer<T>,
		descending = false
	): SortedIterable<T> {

		return new SubSort(
			this,
			<Iterable<T>>this[iterable],
			comparer,
			descending
		);
	}

	protected static *_sort<T>(it: Iterable<T>, comparer: Comparer<T>) {
		const sorted = new TwoThreeTree<T>(comparer);
		sorted.addRange(it);

		yield* sorted;
	}
}
export default SortingIterable;

class SubSort<T> extends SortingIterable<T> {
	private readonly _parent: SortingIterable<T>;
	constructor(
		parent: SortingIterable<T>,
		iterable: Iterable<T>,
		comparer: Comparer<T>,
		descending = false
	) {
		super(iterable, comparer, descending);
		this._parent = parent;
	}
	[Symbol.iterator]() {
		const subSort = SortingIterable._sort(<Iterable<T>>this[iterable], this[compSym]);
		return SortingIterable._sort(subSort, this._parent[compSym]);
	}
}

export function isSortedIterable<T>(iterable: Loopable<T>)
	: iterable is SortedIterable<T> {

	return typeof (iterable as any).thenBy === 'function';
}

declare module './core/ninq' {
	namespace Ninq {
		/**
		 * Sorts the elements of a sequence in the specified order (default: ascending)
		 *
		 * @static
		 * @param {Loopable<number>} iterable - A sequence of values to order
		 * @param {boolean} [descending] - true for descending order; otherwise ascending order would be used
		 * @returns {SortedIterable<number>} - A SortedInterable<T> whose elements are sorted
		 *
		 * @memberOf Ninq
		 */
		export function sortBy(iterable: Loopable<number>, descending?: boolean): SortedIterable<number> & Ninq<number>;
		/**
		 * Sorts the elements of a sequence in the specified order (default: ascending)
		 *
		 * @static
		 * @param {Loopable<string>} iterable - A sequence of values to order
		 * @param {boolean} [descending] - true for descending order; otherwise ascending order would be used
		 * @returns {SortedIterable<string>} - A SortedInterable<T> whose elements are sorted
		 *
		 * @memberOf Ninq
		 */
		export function sortBy(iterable: Loopable<string>, descending?: boolean): SortedIterable<string> & Ninq<string>;
		/**
		 * Sorts the elements of a sequence in the specified order (default: ascending) by using a specified comparer
		 *
		 * @static
		 * @template T - The type of the elements of it
		 * @param {Loopable<T>} iterable - A sequence of values to order
		 * @param {Comparer<T>} comparer - A comparer to compare keys
		 * @param {boolean} [descending] - true for descending order; otherwise ascending order would be used
		 * @returns {SortedIterable<T>} - A SortedInterable<T> whose elements are sorted
		 *
		 * @memberOf Ninq
		 */
		export function sortBy<T>(iterable: Loopable<T>, comparer: Comparer<T>, descending?: boolean): SortedIterable<T> & Ninq<T>;
	}
	interface Ninq<T> {
		/**
		 * Sorts the elements of the sequence in the specified order (default: ascending)
		 *
		 * @param {boolean} [descending] - true for descending order; otherwise ascending order would be used
		 * @returns {SortedIterable<T>} - A SortedInterable<T> whose elements are sorted
		 *
		 * @memberOf Ninq
		 */
		sortBy(descending?: boolean): SortedIterable<T>;
		/**
		 * Sorts the elements of the sequence in the specified order (default: ascending) by using a specified comparer
		 *
		 * @param {Comparer<T>} comparer - A comparer to compare keys
		 * @param {boolean} [descending] - true for descending order; otherwise ascending order would be used
		 * @returns {SortedIterable<T>} - A SortedInterable<T> whose elements are sorted
		 *
		 * @memberOf Ninq
		 */
		sortBy(comparer?: Comparer<T>, descending?: boolean): SortedIterable<T>;
	}
}

Object.assign(Ninq, {
	sortBy<T>(iterable: Loopable<T>, comparerOrDesc?: Comparer<T> | boolean, descending?: boolean): SortedIterable<T> & Ninq<T> {
		let comparer: Comparer<T | Comparable>;
		[comparer, descending] = !comparerOrDesc || typeof comparerOrDesc === 'boolean'
			? [
				(x: Comparable, y: Comparable) =>
					x < y ? -1 :
						x === y ? 0 :
							1,
				comparerOrDesc || descending
			]
			: [comparerOrDesc, descending];
		iterable = ArrayLikeIterable.toIterable(iterable);

		return new SortingIterable(iterable, comparer, descending) as any;
	},
});
Object.assign(Ninq.prototype, {
	sortBy<T>(
		this: Ninq<T>,
		compOrDesc?: Comparer<T> | boolean,
		descending?: boolean
	): SortedIterable<T> & Ninq<T> {
		let comparer: Comparer<T>;
		[comparer, descending] = !compOrDesc || (typeof compOrDesc === 'boolean')
			? [defaultComparer, !!(compOrDesc || descending)]
			: [compOrDesc, !!descending];

		return Ninq.sortBy(<Iterable<T>>this[iterable], comparer, descending);

		function defaultComparer(x: any, y: any) {
			return x < y ? -1 :
				x === y ? 0 :
					1;
		}
	},
});
