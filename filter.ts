import { Predicate, Loopable } from './core/declarations';
import { Ninq } from './core/ninq';
import { symbols } from './core/symbols';
import ArrayLikeIterable from './core/array-like-iterable';
const iterable = symbols.iterable;

class FilterIterable<T> extends Ninq<T> {
	constructor(
		it: Iterable<T>,
		predicate: Predicate<T>,
	) {
		super({
			*[Symbol.iterator]() {
				let i = 0;
				for (let item of it) {
					if (predicate(item, i++)) {
						yield item;
					}
				}
			}
		});
	}
}

declare module './core/ninq' {
	namespace Ninq {
		/**
		 * Filters a sequence of values based on a predicate
		 *
		 * @static
		 * @template T
		 * @param {Loopable<T>} it - An Iterable<T> to filter
		 * @param {Predicate<T>} predicate - A function to test each element for a condition.
		 * @returns {Iterable<T>} - An Iterable<T> that contains elements from the input sequence that satisfy the condition
		 *
		 * @memberOf Ninq
		 */
		export function filter<T>(it: Loopable<T>, predicate: Predicate<T>): Ninq<T>;
	}
	interface Ninq<T> {
		/**
		 * Filters the sequence of values based on a predicate
		 *
		 * @param {Predicate<T>} predicate - A function to test each element for a condition.
		 * @returns - - A Ninq<T> that contains elements from the input sequence that satisfy the condition
		 *
		 * @memberOf Ninq
		 */
		filter(predicate: Predicate<T>): Ninq<T>;
	}
}

Object.assign(Ninq, {
	filter<T>(it: Loopable<T>, predicate: Predicate<T>)
		: Ninq<T> {

		return new FilterIterable(
			ArrayLikeIterable.toIterable(it),
			predicate
		);
	}
});
Object.assign(Ninq.prototype, {
	filter<T>(this: Ninq<T>, predicate: Predicate<T>) {
		return Ninq.filter(this[iterable], predicate);
	}
});
