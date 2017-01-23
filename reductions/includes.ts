import { Ninq } from '../core/ninq';
import { Loopable, EqualityComparer } from '../core/declarations';
import ArrayLikeIterable from '../core/array-like-iterable';
import { iterable } from '../core/symbols';

declare module '../core/ninq' {
	namespace Ninq {
		/**
		 * Determines whether a sequence contains a specified element
		 *
		 * @static
		 * @template T - Itrable's elements' type
		 * @param {Loopable<T>} it - Iterable to calculate avg for
		 * @param {T} item - The value to locate in the sequence
		 * @param {EqualityComparer<T>} [comparer] - An optional equality comparer to compare values
		 * @returns true if the source sequence contains an element that has the specified value; otherwise, false
		 *
		 * @memberOf Ninq
		 */
		export function includes<T>(it: Loopable<T>, item: T, comparer?: EqualityComparer<T>): boolean;
	}
	interface Ninq<T> {
		/**
		 * Determines whether the sequence contains a specified element
		 *
		 * @param {T} item - The value to locate in the sequence
		 * @param {EqualityComparer<T>} [comparer] - An optional equality comparer to compare values
		 * @returns true if the source sequence contains an element that has the specified value; otherwise, false
		 *
		 * @memberOf Ninq
		 */
		includes(item: T, comparer?: EqualityComparer<T>): boolean;
	}
}

Object.assign(Ninq, {
	includes<T>(it: Loopable<T>, item: T, comparer?: EqualityComparer<T>): boolean {
		it = ArrayLikeIterable.toIterable(it);
		comparer = comparer || ((x, y) => x === y);
		for (let element of it) {
			if (comparer(item, element)) {
				return true;
			}
		}
		return false;
	},
});
Object.assign(Ninq.prototype, {
	includes<T>(
		this: Ninq<T>,
		item: T,
		comparer?: EqualityComparer<T>
	): boolean {
		return Ninq.includes(this[iterable], item, comparer);
	},
});
