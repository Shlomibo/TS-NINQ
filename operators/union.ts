import { EqualityComparer } from '../core/declarations';
import { ComparerTracker } from './distinct';
import { Ninq, extendToNinq } from '../core/ninq';
import { Loopable } from '../core/declarations';
import ArrayLikeIterable from '../core/array-like-iterable';
import { iterable } from '../core/symbols';

export class UnionIterable<T> extends Ninq<T> {
	constructor(
		left: Iterable<T>,
		right: Iterable<T>,
		comparer: EqualityComparer<T>
	) {
		super({
			*[Symbol.iterator]() {
				const tracker = new ComparerTracker(comparer, left);
				for (const item of right) {
					if (!tracker.wasReturned(item)) {
						yield item;
					}
				}
			}
		});
	}
}

declare module '../core/ninq' {
	namespace Ninq {
		/**
		 * Produces the set union of two sequences
		 *
		 * @static
		 * @template T - The type of the elements of the input sequences
		 * @param {Loopable<T>} left - An Iterable<T> whose distinct elements form the first set for the union
		 * @param {Loopable<T>} right - An Iterable<T> whose distinct elements form the second set for the union
		 * @returns {Set<T>} - A Set<T> that contains the elements from both input sequences, excluding duplicates
		 *
		 * @memberOf Ninq
		 */
		export function union<T>(left: Loopable<T>, right: Loopable<T>): Ninqed<T, Set<T>>;
		/**
		 * Produces the set union of two sequences by using a specified comparer
		 *
		 * @static
		 * @template T - The type of the elements of the input sequences
		 * @param {Loopable<T>} left - An Iterable<T> whose distinct elements form the first set for the union
		 * @param {Loopable<T>} right - An Iterable<T> whose distinct elements form the second set for the union
		 * @param {EqualityComparer<T>} [comparer] - The comparer to compare values
		 * @returns {Iterable<T>} - An Iterable<T> that contains the elements from both input sequences, excluding duplicates
		 *
		 * @memberOf Ninq
		 */
		export function union<T>(
			left: Loopable<T>,
			right: Loopable<T>,
			comparer: EqualityComparer<T>
		): Ninq<T>;
	}
	interface Ninq<T> {
		/**
	 * Produces the set union of two sequences by using a specified comparer
	 *
	 * @param {Loopable<T>} other - An Iterable<T> whose distinct elements form the second set for the union
	 * @param {EqualityComparer<T>} [comparer] - The comparer to compare values
	 * @returns {Ninq<T>} - An Iterable<T> that contains the elements from both input sequences, excluding duplicates
	 *
	 * @memberOf Ninq
	 */
		union(
			other: Loopable<T>,
			comparer?: EqualityComparer<T>
		): Ninq<T>;
	}
}

Object.assign(Ninq, {
	union<T>(
		left: Loopable<T>,
		right: Loopable<T>,
		comparer?: EqualityComparer<T>
	): Ninq<T> {
		[left, right] = [left, right].map(ArrayLikeIterable.toIterable);
		if (comparer) {
			return new UnionIterable(left, right, comparer);
		}
		else {
			const result = new Set(left);
			for (const item of right) {
				result.add(item);
			}
			return extendToNinq<T, Set<T>>(result);
		}
	},
});
Object.assign(Ninq.prototype, {
	union<T>(
		this: Ninq<T>,
		other: Loopable<T>,
		comparer?: EqualityComparer<T>
	): Ninq<T> {
		return Ninq.union(this[iterable], other, comparer as any);
	}
});
