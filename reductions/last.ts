import { Ninq } from '../core/ninq';
import { Loopable, Predicate } from '../core/declarations';
import { isArrayLike } from '../core/array-like-iterable';
import ArrayLikeIterable from '../core/array-like-iterable';
import { iterable } from '../core/symbols';

declare module '../core/ninq' {
	namespace Ninq {
		/**
		 * Returns the last element of a sequence that satisfies a condition or undefined if no such element is found
		 *
		 * @static
		 * @template T - The type of the elements of it
		 * @param {Loopable<T>} it - An Iterable<T> to return the last element of
		 * @param {Predicate<T>} [predicate] - A function to test each element for a condition
		 * @returns - undefined if the sequence is empty or if no elements pass the test in the predicate function;
		 * 	otherwise, the last element that passes the test in the predicate function
		 *
		 * @memberOf Ninq
		 */
		export function lastOrDefault<T>(it: Loopable<T>, predicate?: Predicate<T>): T | undefined;
		/**
		 * Returns the last element of a sequence that satisfies a condition or a default value if no such element is found
		 *
		 * @static
		 * @template T - The type of the elements of it
		 * @template U - Default value's type
		 * @param {Loopable<T>} it - An Iterable<T> to return the last element of
		 * @param {T} defValue - Default value to return in case no element satisfies the predicate
		 * @param {Predicate<T>} [predicate] - A function to test each element for a condition
		 * @returns - defValue if the sequence is empty or if no elements pass the test in the predicate function;
		 * 	otherwise, the last element that passes the test in the predicate function
		 *
		 * @memberOf Ninq
		 */
		export function lastOrDefault<T, U>(it: Loopable<T>, defValue: U, predicate?: Predicate<T>): T | U;
		/**
		 * Returns the last element of a sequence
		 *
		 * @static
		 * @template T - The type of the elements of it
		 * @param {Loopable<T>} it - An Iterable<T> to return the last element of
		 * @returns {T} - The value at the last position in the source sequence
		 *
		 * @memberOf Ninq
		 */
		export function last<T>(it: Loopable<T>): T;
		/**
		 * Returns the last element of a sequence that satisfies a specified condition
		 *
		 * @static
		 * @template T - The type of the elements of it
		 * @param {Loopable<T>} it - An Iterable<T> to return the last element of
		 * @param {Predicate<T>} predicate - A function to test each element for a condition
		 * @returns {T} - The last element in the sequence that passes the test in the specified predicate function
		 *
		 * @memberOf Ninq
		 */
		export function last<T>(it: Loopable<T>, predicate: Predicate<T>): T;
	}
	interface Ninq<T> {
		lastOrDefault(predicate?: Predicate<T>): T | undefined;
		/**
		 * Returns the last element of a sequence that satisfies a condition or a default value if no such element is found
		 *
		 * @param {T} defValue - Default value to return in case no element satisfies the predicate
		 * @param {Predicate<T>} [predicate] - A function to test each element for a condition
		 * @returns {T} - defValue if the sequence is empty or if no elements pass the test in the predicate function;
		 * 	otherwise, the last element that passes the test in the predicate function
		 *
		 * @memberOf Ninq
		 */
		lastOrDefault<U>(defValue: U, predicate?: Predicate<T>): T | U;
		/**
		 * Returns the last element of a sequence
		 *
		 * @returns {T} - The value at the last position in the source sequence
		 *
		 * @memberOf Ninq
		 */
		last(): T;
		/**
		 * Returns the last element of a sequence that satisfies a specified condition
		 *
		 * @param {Predicate<T>} predicate - A function to test each element for a condition
		 * @returns {T} - The last element in the sequence that passes the test in the specified predicate function
		 *
		 * @memberOf Ninq
		 */
		last(predicate: Predicate<T>): T;
	}
}

Object.assign(Ninq, {
	lastOrDefault<T, U>(
		it: Loopable<T>,
		defValueOrPredicate?: U | Predicate<T>,
		predicate?: Predicate<T>
	): T | U | undefined {
		let defValue: any;
		if ((typeof defValueOrPredicate === 'function') && !predicate) {
			predicate = defValueOrPredicate;
		}
		else {
			defValue = defValueOrPredicate;
		}
		if (isArrayLike(it)) {
			if (!predicate) {
				return it.length > 0
					? it[it.length - 1]
					: defValue;
			}
			it = ArrayLikeIterable.toIterable(it);
		}

		if (predicate) {
			it = Ninq.filter(it, predicate);
		}
		let result: T | U = defValue;
		for (result of it) {
			;
		}
		return result;
	},

	last<T>(it: Loopable<T>, predicate?: Predicate<T>) {
		const errVal = '\0__ERROR__\0',
			result = Ninq.lastOrDefault(it, errVal, predicate as any);
		if (result === errVal) {
			throw new Error('No values returned from iterable');
		}
		return result;
	},
});
Object.assign(Ninq.prototype, {
	lastOrDefault<T, U>(
		this: Ninq<T>,
		defValueOrPredicate?: U | Predicate<T>,
		predicate?: Predicate<T>
	): T | U | undefined {
		return Ninq.lastOrDefault(this[iterable], defValueOrPredicate as any, predicate);
	},

	last<T>(this: Ninq<T>, predicate?: Predicate<T>): T {
		return Ninq.last(<Iterable<T>>this[iterable], predicate as any);
	},
});
