import { Ninq } from '../core/ninq';
import { Loopable } from '../core/declarations';
import { isArrayLike, ReverseArrayLikeIterable } from '../core/array-like-iterable';
import ArrayLikeIterable from '../core/array-like-iterable';
import { iterable } from '../core/symbols';

export class ReverseIterable<T> extends Ninq<T> {
	constructor(iterable: Iterable<T>) {
		super({
			*[Symbol.iterator]() {
				const elements = [...iterable];
				for (let i = elements.length - 1; i >= 0; i--) {
					yield elements[i];
				}
			}
		});
	}
}

declare module '../core/ninq' {
	namespace Ninq {
		/**
		 * Inverts the order of the elements in a sequence
		 *
		 * @static
		 * @template T - The type of the elements of it
		 * @param {Loopable<T>} iterable - A sequence of values to reverse
		 * @returns {Iterable<T>} - A sequence whose elements correspond to those of the input sequence in reverse order
		 *
		 * @memberOf Ninq
		 */
		export function reverse<T>(iterable: Loopable<T>): Ninq<T>;
	}
	interface Ninq<T> {
		/**
		 * Inverts the order of the elements in the sequence
		 *
		 * @returns - A sequence whose elements correspond to those of the input sequence in reverse order
		 *
		 * @memberOf Ninq
		 */
		reverse(): Ninq<T>;
	}
}

Object.assign(Ninq, {
	reverse<T>(iterable: Loopable<T>): Ninq<T> {
		return isArrayLike(iterable)
			? new Ninq(new ReverseArrayLikeIterable(iterable))
			: new ReverseIterable<T>(ArrayLikeIterable.toIterable(iterable));
	}

});
Object.assign(Ninq.prototype, {
	reverse<T>(this: Ninq<T>): Ninq<T> {
		return Ninq.reverse(<Iterable<T>>this[iterable]);
	}
});
