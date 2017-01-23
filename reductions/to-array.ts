import { Ninq } from '../core/ninq';
import { Loopable } from '../core/declarations';
import ArrayLikeIterable from '../core/array-like-iterable';
import { iterable } from '../core/symbols';

declare module '../core/ninq' {
	namespace Ninq {
		/**
		 * Creates an array from a Iterable<T>
		 *
		 * @static
		 * @template T - The type of the elements of it
		 * @param {Loopable<T>} it - An Iterable<T> to create an array from
		 * @returns {T[]} - An array that contains the elements from the input sequence
		 *
		 * @memberOf Ninq
		 */
		export function toArray<T>(it: Loopable<T>): T[];
	}
	interface Ninq<T> {
		/**
		 * Creates an array from a Iterable<T>
		 *
		 * @returns {T[]} - An array that contains the elements from the input sequence
		 *
		 * @memberOf Ninq
		 */
		toArray(): T[];
	}
}

Object.assign(Ninq, {
	toArray<T>(it: Loopable<T>): T[] {
		if (it instanceof Array) {
			return it;
		}
		return [...ArrayLikeIterable.toIterable(it)];
	},
});
Object.assign(Ninq.prototype, {
	toArray<T>(this: Ninq<T>): T[] {
		return Ninq.toArray(<Loopable<T>>this[iterable]);
	}
});
