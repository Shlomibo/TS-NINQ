import { Ninq } from '../core/ninq';
import { Loopable } from '../core/declarations';
import ArrayLikeIterable from '../core/array-like-iterable';
import { iterable } from '../core/symbols';

declare module '../core/ninq' {
	namespace Ninq {
		/**
		 * Returns the elements of the specified sequence or the specified value in a singleton collection if the sequence is empty
		 *
		 * @static
		 * @template T - Itrable's elements' type
		 * @param {Loopable<T>} it - Iterable to calculate avg for
		 * @param {T} defValue - The value to return if the sequence is empty
		 * @returns A sequence that contains defaultValue if source is empty; otherwise, source
		 *
		 * @memberOf Ninq
		 */
		export function defaultIfEmpty<T>(it: Loopable<T>, defValue: T): Ninq<T>;
	}
	interface Ninq<T> {
		/**
		 * Returns the elements of the specified sequence or the specified value in a singleton collection if the sequence is empty
		 *
		 * @param {T} defValue - The value to return if the sequence is empty
		 * @returns A sequence that contains defaultValue if source is empty; otherwise, source
		 *
		 * @memberOf Ninq
		 */
		defaultIfEmpty(defValue: T): Ninq<T>;
	}
}

Object.assign(Ninq, {
	defaultIfEmpty<T>(it: Loopable<T>, defValue: T): Ninq<T> {
		return new Ninq(
			Ninq.some(it)
				? ArrayLikeIterable.toIterable(it)
				: [defValue]
		);
	},
});
Object.assign(Ninq.prototype, {
	defaultIfEmpty<T>(this: Ninq<T>, defValue: T): Ninq<T> {
		return this.some()
			? this
			: Ninq.defaultIfEmpty(this[iterable], defValue);
	},
});
