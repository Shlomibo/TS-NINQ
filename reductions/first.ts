import { Ninq } from '../core/ninq';
import { Loopable, Predicate } from '../core/declarations';
import { iterable } from '../core/symbols';
import '../filter';

declare module '../core/ninq' {
	namespace Ninq {
		/**
		 * Returns the first element of a sequence, or undefined if the sequence contains no elements.
		 *
		 *
		 * @static
		 * @template T - Itrable's elements' type
		 * @param {Loopable<T>} it - Iterable to calculate avg for
		 * @param {Predicate<T>} [predicate] - A function to test each element for a condition
		 * @returns undefined if source is empty; otherwise, the first element in source
		 *
		 * @memberOf Ninq
		 */
		export function firstOrDefault<T>(it: Loopable<T>, predicate?: Predicate<T>): T | undefined;
		/**
		 * Returns the first element of a sequence, or a default value if the sequence contains no elements.
		 *
		 * @static
		 * @template T - Itrable's elements' type
		 * @template U - Default value's type
		 * @param {Loopable<T>} it - Iterable to calculate avg for
		 * @param {T} defValue
		 * @param {Predicate<T>} [predicate] - A function to test each element for a condition
		 * @returns defValue if source is empty; otherwise, the first element in source
		 *
		 * @memberOf Ninq
		 */
		export function firstOrDefault<T, U>(it: Loopable<T>, defValue: U, predicate?: Predicate<T>): T | U;
		/**
		 * Returns the first element in a sequence that satisfies a specified condition
		 *
		 * @static
		 * @template T - Itrable's elements' type
		 * @param {Loopable<T>} it - Iterable to calculate avg for
		 * @param {Predicate<T>} [predicate] - A function to test each element for a condition
		 * @returns The first element in the sequence that passes the test in the specified predicate function
		 *
		 * @memberOf Ninq
		 */
		export function first<T>(it: Loopable<T>, predicate?: Predicate<T>): T;
	}
	interface Ninq<T> {
		/**
		 * Returns the first element of a sequence, or undefined if the sequence contains no elements.
		 *
		 * @param {Predicate<T>} [predicate] - A function to test each element for a condition
		 * @returns undefined if source is empty; otherwise, the first element in source
		 *
		 * @memberOf Ninq
		 */
		firstOrDefault(predicate?: Predicate<T>): T | undefined;
		/**
		 * Returns the first element of a sequence, or a default value if the sequence contains no elements.
		 *
		 * @template U - Default value's type
		 * @param {U} defValue
		 * @param {Predicate<T>} [predicate] - A function to test each element for a condition
		 * @returns defValue if source is empty; otherwise, the first element in source
		 *
		 * @memberOf Ninq
		 */
		firstOrDefault<U>(defValue: U, predicate?: Predicate<T>): T | U;
		/**
		 * Returns the first element in a sequence that satisfies a specified condition
		 *
		 * @param {Predicate<T>} [predicate] - A function to test each element for a condition
		 * @returns The first element in the sequence that passes the test in the specified predicate function
		 *
		 * @memberOf Ninq
		 */
		first(predicate?: Predicate<T>): T;
	}
}

Object.assign(Ninq, {
	firstOrDefault<T, U>(
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

		if (typeof predicate === 'function') {
			return Ninq.filter(it, predicate)
				.firstOrDefault(defValue);
		}
		return Ninq.elementAtOrDefault(it, 0, defValue);
	},

	first<T>(it: Loopable<T>, predicate?: Predicate<T>): T {
		const errValue = '\0__ERR__\0',
			result = Ninq.firstOrDefault(it, errValue, predicate);
		if (result === errValue) {
			throw new RangeError('Could not find an item');
		}
		return result;
	},
});
Object.assign(Ninq.prototype, {
	firstOrDefault<T, U>(
		this: Ninq<T>,
		defValueOrPredicate?: U | Predicate<T>,
		predicate?: Predicate<T>
	): T | U {
		return Ninq.firstOrDefault(
			<Iterable<T>>this[iterable],
			defValueOrPredicate as any,
			predicate
		);
	},

	first<T>(this: Ninq<T>, predicate?: Predicate<T>): T {
		return Ninq.first(this[iterable], predicate);
	}
});
