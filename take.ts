import { Predicate, Loopable } from './core/declarations';
import { Ninq } from './core/ninq';
import ArrayLikeIterable from './core/array-like-iterable';
import { iterable } from './core/symbols';
import { isArrayLike } from './core/array-like-iterable';

export class TakeWhileIterable<T> extends Ninq<T> {
	constructor(
		iterable: Iterable<T>,
		predicate: Predicate<T>
	) {
		super({
			*[Symbol.iterator]() {
				let i = 0;
				for (let item of iterable) {
					if (!predicate(item, i++)) {
						break;
					}
					yield item;
				}
			}
		});
	}
}

declare module './core/ninq' {
	namespace Ninq {
		/**
		 * - Returns elements from a sequence as long as a specified condition is true
		 *
		 * @static
		 * @template T - The type of the elements of it
		 * @param {Loopable<T>} it - A sequence to return elements from
		 * @param {Predicate<T>} predicate - A function to test each element for a condition
		 * @returns - An Iterable<T> that contains the elements from the input sequence
		 * 	that occur before the element at which the test no longer passes
		 *
		 * @memberOf Ninq
		 */
		export function takeWhile<T>(it: Loopable<T>, predicate: Predicate<T>): Ninq<T>;
		/**
		 * Returns a specified number of contiguous elements from the start of a sequence
		 *
		 * @static
		 * @template T - The type of the elements of it
		 * @param {Loopable<T>} it - The sequence to return elements from
		 * @param {number} count - The number of elements to return
		 * @returns - An Iterable<T> that contains the specified number of elements from the start of the input sequence
		 *
		 * @memberOf Ninq
		 */
		export function take<T>(it: Loopable<T>, count: number): Ninq<T>;
	}
	interface Ninq<T> {
		/**
		 * - Returns elements from a sequence as long as a specified condition is true
		 *
		 * @param {Predicate<T>} predicate - A function to test each element for a condition
		 * @returns - An Iterable<T> that contains the elements from the input sequence
		 * 	that occur before the element at which the test no longer passes
		 *
		 * @memberOf Ninq
		 */
		takeWhile(predicate: Predicate<T>): Ninq<T>;
		/**
		 * Returns a specified number of contiguous elements from the start of this sequence
		 *
		 *
		 * @param {number} count - The number of elements to return
		 * @returns - An Iterable<T> that contains the specified number of elements from the start of the input sequence
		 *
		 * @memberOf Ninq
		 */
	}
}

Object.assign(Ninq, {
	takeWhile<T>(it: Loopable<T>, predicate: Predicate<T>): Ninq<T> {
		return new TakeWhileIterable(
			ArrayLikeIterable.toIterable(it),
			predicate
		);
	},


	take<T>(it: Loopable<T>, count: number): Ninq<T> {
		if (count < 0) {
			throw new Error('count must be greater or equal to zero');
		}
		return isArrayLike(it)
			? new Ninq(new ArrayLikeIterable(it, 0, count))
			: Ninq.takeWhile(it, (_, index) => index < count);
	},
});
Object.assign(Ninq.prototype, {
	takeWhile<T>(this: Ninq<T>, predicate: Predicate<T>): Ninq<T> {
		return Ninq.takeWhile(this[iterable], predicate);
	},

	take<T>(this: Ninq<T>, count: number): Ninq<T> {
		return Ninq.take(<Loopable<T>>this[iterable], count);
	},
});
