import { Ninq } from '../core/ninq';
import { KeySelector, Loopable } from '../core/declarations';
import ArrayLikeIterable from '../core/array-like-iterable';
import { iterable } from '../core/symbols';

declare module '../core/ninq' {
	namespace Ninq {
		/**
		 * Computes the average of a sequence of number values that are obtained by invoking
		 * a transform function on each element of the input sequence
		 *
		 * @static
		 * @template T - Itrable's elements' type
		 * @param {(Iterable<T> | ArrayLike<T>)} it - Iterable to calculate avg for
		 * @param {KeySelector<T, number>} selector - A transform function to apply to each element
		 * @returns {(number | undefined)}
		 *
		 * @memberOf Ninq
		 */
		export function average<T>(it: Loopable<T>, selector: KeySelector<T, number>): number | undefined;
	}
	interface Ninq<T> {
		/**
		 * Computes the average of a sequence of number values that are obtained by invoking
		 * a transform function on each element of the input sequence
		 *
		 * @param {Selector<T, number>} selector - A transform function to apply to each element
		 * @returns The average of the sequence of values
		 *
		 * @memberOf Ninq
		 */
		average(selector: KeySelector<T, number>): number | undefined;
	}
}

Object.assign(Ninq, {
	average<T>(it: Loopable<T>, selector: KeySelector<T, number>): number | undefined {

		it = ArrayLikeIterable.toIterable(it);
		return Ninq.reduce<T, number>(
			it,
			(prev, item, index) => {
				const num = selector(item);
				if (index === 0) {
					return num;
				}
				else {
					prev *= index;
					return (num + prev) / (index + 1);
				}
			}
		);
	},
});
Object.assign(Ninq.prototype, {
	average<T>(this: Ninq<T>, selector: KeySelector<T, number>): number | undefined {
		return Ninq.average(this[iterable], selector);
	}
});
