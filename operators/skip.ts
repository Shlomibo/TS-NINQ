import { Predicate, Loopable } from '../core/declarations';
import { Ninq } from '../core/ninq';
import ArrayLikeIterable from '../core/array-like-iterable';
import { iterable } from '../core/symbols';
import { isArrayLike } from '../core/array-like-iterable';

export class SkippingIterable<T> extends Ninq<T> {
	constructor(
		iterable: Iterable<T>,
		predicate: Predicate<T>,
	) {
		super({
			*[Symbol.iterator]() {
				let i = 0,
					isSkipping = true;
				for (let item of iterable) {
					isSkipping = isSkipping && predicate(item, i++);
					if (!isSkipping) {
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
		 * Bypasses elements in a sequence as long as a specified condition is true and then returns the remaining elements.
		 * 	The element's index is used in the logic of the predicate function
		 *
		 * @static
		 * @template T - The type of the elements of it
		 * @param {Loopable<T>} it - An Iterable<T> to return elements from
		 * @param {Predicate<T>} predicate - A function to test each source element for a condition;
		 * 	the second parameter of the function represents the index of the source element
		 * @returns - An Iterable<T> that contains the elements from the input sequence starting
		 * 	at the first element in the linear series that does not pass the test specified by predicate
		 *
		 * @memberOf Ninq
		 */
		export function skipWhile<T>(it: Loopable<T>, predicate: Predicate<T>): Ninq<T>;

		/**
		 * Bypasses a specified number of elements in a sequence and then returns the remaining elements
		 *
		 * @static
		 * @template T - The type of the elements of it
		 * @param {Loopable<T>} it - An Iterable<T> to return elements from
		 * @param {number} count - The number of elements to skip before returning the remaining elements
		 * @returns - An Iterable<T> that contains the elements that occur after the specified index in the input sequence
		 *
		 * @memberOf Ninq
		 */
		export function skip<T>(it: Loopable<T>, count: number): Ninq<T>;
	}
	interface Ninq<T> {
		/**
		 * Bypasses elements in a sequence as long as a specified condition is true and then returns the remaining elements.
		 * 	The element's index is used in the logic of the predicate function
		 *
		 * @param {Predicate<T>} predicate - A function to test each source element for a condition;
		 * 	the second parameter of the function represents the index of the source element
		 * @returns - An Iterable<T> that contains the elements from the input sequence starting
		 * 	at the first element in the linear series that does not pass the test specified by predicate
		 *
		 * @memberOf Ninq
		 */
		skipWhile(predicate: Predicate<T>): Ninq<T>;

		/**
		 * Bypasses a specified number of elements in a sequence and then returns the remaining elements
		 *
		 * @param {number} count - The number of elements to skip before returning the remaining elements
		 * @returns - An Iterable<T> that contains the elements that occur after the specified index in the input sequence
		 *
		 * @memberOf Ninq
		 */
		skip(count: number): Ninq<T>;
	}
}

Object.assign(Ninq, {
	skipWhile<T>(it: Loopable<T>, predicate: Predicate<T>): Ninq<T> {
		return new SkippingIterable(
			ArrayLikeIterable.toIterable(it),
			predicate
		);
	},

	skip<T>(it: Loopable<T>, count: number): Ninq<T> {
		if (count < 0) {
			throw new Error('count must be greater or equal to zero');
		}
		return isArrayLike(it)
			? new Ninq(new ArrayLikeIterable(it, count))
			: Ninq.skipWhile(it, (_, index) => index < count);
	},
});
Object.assign(Ninq.prototype, {
	skipWhile<T>(this: Ninq<T>, predicate: Predicate<T>): Ninq<T> {
		return Ninq.skipWhile(this[iterable], predicate);
	},

	skip<T>(this: Ninq<T>, count: number): Ninq<T> {
		return Ninq.skip(<Iterable<T>>this[iterable], count);
	}
});
