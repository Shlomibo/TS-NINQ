import { Ninq } from '../core/ninq';
import { Loopable } from '../core/declarations';
import ArrayLikeIterable from '../core/array-like-iterable';
import { iterable } from '../core/symbols';

export class ZipIterable<T, U> extends Ninq<[T | undefined, U | undefined]> {
	constructor(
		left: Iterable<T>,
		right: Iterable<U>,
		throughAll = false
	) {
		super({
			*[Symbol.iterator](): Iterator<[T | undefined, U | undefined]> {
				const [lIt, rIt] = [left, right]
					.map(x => x[Symbol.iterator]()) as [Iterator<T>, Iterator<U>];
				for (
					let left = lIt.next(), right = rIt.next();
					ZipIterable._shouldIterate(throughAll, left, right);
					left = left.done ? left : lIt.next(), right = right.done ? right : rIt.next()
				) {
					yield [
						left.done ? undefined : left.value,
						right.done ? undefined : right.value
					];
				}
			}
		});
	}

	private static _shouldIterate<T, U>(
		throughAll: boolean,
		{done: lDone}: IteratorResult<T>,
		{done: rDone}: IteratorResult<U>) {
		return throughAll
			? (!lDone || !rDone)
			: (!lDone && !rDone);
	}
}

declare module '../core/ninq' {
	namespace Ninq {
		/**
		 * Return an array with the corresponding elements of two sequences, producing a sequence of the results
		 *
		 * @static
		 * @template L - The type of the elements of the input sequences
		 * @template R - The type of the elements of the input sequences
		 * @param {Loopable<L>} left - The first sequence to merge
		 * @param {Loopable<R>} right - The second sequence to merge
		 * @returns {Iterable<[T, T]>} - An Iterable<T> that contains merged elements of two input sequences
		 *
		 * @memberOf Ninq
		 */
		export function zip<L, R>(left: Loopable<L>, right: Loopable<R>): Ninq<[L, R]>;
		/**
		 * Return an array with the corresponding elements of two sequences, producing a sequence of the results
		 *
		 * @static
		 * @template T - The type of the elements of the input sequences
		 * @param {Loopable<T>} left - The first sequence to merge
		 * @param {Loopable<T>} right - The second sequence to merge
		 * @param {boolean} [throughAll] - true to return all elements from both sequences; otherwise, iteration stops with
		 *	the first exhausted sequence
		* @returns {(Iterable<[T | undefined, T | undefined]>)} - An Iterable<T> that contains merged elements of two input sequences
		*
		* @memberOf Ninq
		*/
		export function zip<L, R>(left: Loopable<L>, right: Loopable<R>, throughAll?: boolean): Ninq<[L | undefined, R | undefined]>;
	}
	interface Ninq<T> {
		/**
		 * Return an array with the corresponding elements of two sequences, producing a sequence of the results
		 *
		 * @param {Loopable<T>} other - The other sequence to merge
		 * @returns {(Ninq<[T, T]>)} - An Iterable<T> that contains merged elements of two input sequences
		 *
		 * @memberOf Ninq
		 */
		zip<U>(other: Loopable<U>): Ninq<[T, U]>;
		/**
		 * Return an array with the corresponding elements of two sequences, producing a sequence of the results
		 *
		 * @param {Loopable<T>} other - The other sequence to merge
		 * @param {boolean} [throughAll] - true to return all elements from both sequences; otherwise, iteration stops with
		 *	the first exhausted sequence
		* @returns {(Ninq<[T | undefined, T | undefined]>)} - An Iterable<T> that contains merged elements of two input sequences
		*
		* @memberOf Ninq
		*/
		zip<U>(other: Loopable<U>, throughAll?: boolean): Ninq<[T | undefined, U | undefined]>;
	}
}

Object.assign(Ninq, {
	zip<L, R>(left: Loopable<L>, right: Loopable<R>, throughAll?: boolean) {
		[left, right] = [left, right].map(ArrayLikeIterable.toIterable) as [Iterable<L>, Iterable<R>];
		return new ZipIterable(left, right, throughAll);
	}

});
Object.assign(Ninq.prototype, {
	zip<T, U>(this: Ninq<T>, other: Loopable<U>, throughAll?: boolean) {
		return Ninq.zip(this[iterable], other);
	},
});
