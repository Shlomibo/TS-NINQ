import { Ninq } from '../core/ninq';
import { Predicate, Loopable } from '../core/declarations';
import { isArrayLike } from '../core/array-like-iterable';
import ArrayLikeIterable from '../core/array-like-iterable';
import { iterable } from '../core/symbols';

declare module '../core/ninq' {
	namespace Ninq {
		/**
		 * Returns a number that represents how many elements in the specified sequence satisfy a condition
		 *
		 * @static
		 * @template T - Itrable's elements' type
		 * @param {Loopable<T>} it - Iterable to calculate avg for
		 * @param {Predicate<T>} [predicate] - A function to test each element for a condition
		 * @returns {number} - A number that represents how many elements in the sequence satisfy the condition in the predicate function
		 *
		 * @memberOf Ninq
		 */
		export function count<T>(it: Loopable<T>, predicate?: Predicate<T>): number;
	}
	interface Ninq<T> {
		/**
		 * Returns a number that represents how many elements in the specified sequence satisfy a condition
		 *
		 * @param {Predicate<T>} predicate - A function to test each element for a condition
		 * @returns {number} - A number that represents how many elements in the sequence satisfy the condition in the predicate function
		 *
		 * @memberOf Ninq
		 */
		count(predicate?: Predicate<T>): number;
	}
}

Object.assign(Ninq, {
	count<T>(it: Loopable<T>, predicate?: Predicate<T>): number {
		let result = 0,
			index = 0;
		if (isArrayLike(it)) {
			if (!predicate) {
				return it.length;
			}
			it = ArrayLikeIterable.toIterable(it);
		}
		predicate = predicate || (x => true);
		for (let item of it) {
			if (predicate(item, index)) {
				result++;
			}
			index++;
		}
		return result;
	}
});
Object.assign(Ninq.prototype, {
	count<T>(this: Ninq<T>, predicate?: Predicate<T>): number {
		return Ninq.count(this[iterable], predicate as any);
	}
});
