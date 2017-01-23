import { Ninq } from '../core/ninq';
import { Loopable, Predicate } from '../core/declarations';
import ArrayLikeIterable from '../core/array-like-iterable';
import { iterable } from '../core/symbols';

declare module '../core/ninq' {
	namespace Ninq {
		/**
		 * Determines whether all elements of a sequence satisfy a condition
		 *
		 * @static
		 * @template T - Itrable's elements' type
		 * @param {Loopable<T>} it - Iterable to calculate avg for
		 * @param {Predicate<T>} predicate - A function to test each element for a condition
		 * @returns true if every element of the source sequence passes the test in the specified predicate,
		 * or if the sequence is empty; otherwise, false
		 *
		 * @memberOf Ninq
		 */
		export function every<T>(
			it: Loopable<T>,
			predicate: Predicate<T>
		): boolean;
	}
	interface Ninq<T> {
		/**
		 * Determines whether all elements of a sequence satisfy a condition
		 *
		 * @param {Predicate<T>} predicate - A function to test each element for a condition
		 * @returns true if every element of the source sequence passes the test in the specified predicate,
		 * or if the sequence is empty; otherwise, false
		 *
		 * @memberOf Ninq
		 */
		every(predicate: Predicate<T>): boolean;
	}
}

Object.assign(Ninq, {
	every<T>(
		it: Loopable<T>,
		predicate: Predicate<T>
	): boolean {
		let result = true;
		let i = 0;
		it = ArrayLikeIterable.toIterable(it);
		for (let item of it) {
			result = predicate(item, i);
			if (!result) {
				break;
			}
			i++;
		}
		return result;
	},
});
Object.assign(Ninq.prototype, {
	every<T>(this: Ninq<T>, predicate: Predicate<T>): boolean {
		return Ninq.every(this[iterable], predicate);
	},
});
