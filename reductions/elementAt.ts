import { Ninq } from '../core/ninq';
import { Loopable } from '../core/declarations';
import { isArrayLike } from '../core/array-like-iterable';
import { iterable } from '../core/symbols';

declare module '../core/ninq' {
	namespace Ninq {
		/**
		 * Returns the element at a specified index in a sequence or undefined
		 *
		 * @static
		 * @template T - Itrable's elements' type
		 * @param {Loopable<T>} it - Iterable to calculate avg for
		 * @param {number} index The zero-based index of the element to retrieve
		 * @returns undefined if the index is outside the bounds of the source sequence;
		 * 	otherwise, the element at the specified position in the source sequence
		 *
		 * @memberOf Ninq
		 */
		export function elementAtOrDefault<T>(it: Loopable<T>, index: number): T | undefined;
		/**
		 * Returns the element at a specified index in a sequence or a default value if the index is out of range
		 *
		 * @static
		 * @template T - Itrable's elements' type
		 * @template U - Default value's type
		 * @param {Loopable<T>} it - Iterable to calculate avg for
		 * @param {number} index The zero-based index of the element to retrieve
		 * @param {T} defValue The value to return if index is out of range
		 * @returns default(TSource) if the index is outside the bounds of the source sequence;
		 * 	otherwise, the element at the specified position in the source sequence
		 *
		 * @memberOf Ninq
		 */
		export function elementAtOrDefault<T, U>(it: Loopable<T>, index: number, defValue: U): T | U;
		/**
		 * Returns the element at a specified index in a sequence
		 *
		 * @static
		 * @template T - Itrable's elements' type
		 * @param {Loopable<T>} it - Iterable to calculate avg for
		 * @param {number} index The zero-based index of the element to retrieve
		 * @returns The element at the specified position in the source sequence
		 *
		 * @memberOf Ninq
		 */
		export function elementAt<T>(it: Loopable<T>, index: number): T;
	}
	interface Ninq<T> {
		/**
		 * Returns the element at a specified index in a sequence or undefined if the index is out of range
		 *
		 * @param {number} index The zero-based index of the element to retrieve
		 * @returns undefindef if the index is outside the bounds of the source sequence;
		 * 	otherwise, the element at the specified position in the source sequence
		 *
		 * @memberOf Ninq
		 */
		elementAtOrDefault(index: number): T | undefined;
		/**
		 * Returns the element at a specified index in a sequence or a default value if the index is out of range
		 *
		 *
		 * @template U - Default value's type
		 * @param {number} index The zero-based index of the element to retrieve
		 * @param {U} defValue The value to return if index is out of range
		 * @returns default(TSource) if the index is outside the bounds of the source sequence;
		 * 	otherwise, the element at the specified position in the source sequence
		 *
		 * @memberOf Ninq
		 */
		elementAtOrDefault<U>(index: number, defValue: U): T | U;
		/**
		 * Returns the element at a specified index in a sequence
		 *
		 * @param {number} index The zero-based index of the element to retrieve
		 * @returns The element at the specified position in the source sequence
		 *
		 * @memberOf Ninq
		 */
		elementAt(index: number): T;
	}
}

Object.assign(Ninq, {
	elementAtOrDefault<T, U>(it: Loopable<T>, index: number, defValue?: U): T | U | undefined {
		let i = 0;
		if (isArrayLike(it)) {
			return it.length <= index
				? defValue
				: it[index];
		}

		for (let item of it) {
			if (i++ === index) {
				return item;
			}
		}
		return defValue;
	},

	elementAt<T>(it: Loopable<T>, index: number): T {
		const errValue = '\0___ERR___\0',
			result = Ninq.elementAtOrDefault(it, index, errValue);
		if (result === errValue) {
			throw new Error('Could not find element');
		}
		return result;
	},
});
Object.assign(Ninq.prototype, {
	elementAtOrDefault<T, U>(
		this: Ninq<T>,
		index: number,
		defValue?: U
	): T | U | undefined {
		return Ninq.elementAtOrDefault(<Iterable<T>>this[iterable], index, defValue);
	},

	elementAt<T>(this: Ninq<T>, index: number): T {
		return Ninq.elementAt(<Iterable<T>>this[iterable], index);
	},
});
