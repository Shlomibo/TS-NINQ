import { Ninq } from '../core/ninq';
import { Loopable, Predicate } from '../core/declarations';
import ArrayLikeIterable from '../core/array-like-iterable';
import { iterable } from '../core/symbols';

declare module '../core/ninq' {
	namespace Ninq {
		/**
		 * Returns the only element of a sequence, or a default value if the sequence is empty;
		 * 	this method throws an exception if there is more than one element in the sequence
		 *
		 * @static
		 * @template T - The type of the elements of it
		 * @param {Loopable<T>} it - An Iterable<T> to return the single element of
		 * @param {T} defVal - An element to return if the sequence contains no elements
		 * @returns {T} - The single element of the input sequence, or defValue if the sequence contains no elements
		 *
		 * @memberOf Ninq
		 */
		export function singleOrDefault<T, U>(it: Loopable<T>, defVal: U): T | U;
		/**
		 * Returns the only element of a sequence that satisfies a specified condition or a default value if no such element exists;
		 * 	this method throws an exception if more than one element satisfies the condition
		 *
		 * @static
		 * @template T - The type of the elements of it
		 * @param {Loopable<T>} it
		 * @param {T} defVal - An element to return if the sequence contains no elements
		 * @param {Predicate<T>} predicate - A function to test an element for a condition
		 * @returns {T} - The single element of the input sequence that satisfies the condition, or defVal if no such element is found
		 *
		 * @memberOf Ninq
		 */
		export function singleOrDefault<T, U>(it: Loopable<T>, defVal: U, predicate: Predicate<T>): T | U;
		/**
		 * Returns the only element of a sequence, and throws an exception if there is not exactly one element in the sequence
		 *
		 * @static
		 * @template T - The type of the elements of it
		 * @param {Loopable<T>} it - An Iterable<T> to return the single element of
		 * @returns {T} - The single element of the input sequence
		 *
		 * @memberOf Ninq
		 */
		export function single<T>(it: Loopable<T>): T;
		/**
		 * Returns the only element of a sequence that satisfies a specified condition,
		 * 	and throws an exception if more than one such element exists
		 *
		 * @static
		 * @template T - The type of the elements of it
		 * @param {Loopable<T>} it - An Iterable<T> to return the single element of
		 * @param {Predicate<T>} predicate - A function to test an element for a condition
		 * @returns {T} - The single element of the input sequence that satisfies a condition
		 *
		 * @memberOf Ninq
		 */
		export function single<T>(it: Loopable<T>, predicate: Predicate<T>): T;
	}
	interface Ninq<T> {
		/**
		 * Returns the only element of a sequence, or a default value if the sequence is empty;
		 * 	this method throws an exception if there is more than one element in the sequence
		 *
		 * @param {T} defVal - An element to return if the sequence contains no elements
		 * @returns {T} - The single element of the input sequence, or defValue if the sequence contains no elements
		 *
		 * @memberOf Ninq
		 */
		singleOrDefault<U>(defVal: U): T | U;
		/**
		 * Returns the only element of a sequence that satisfies a specified condition or a default value if no such element exists;
		 * 	this method throws an exception if more than one element satisfies the condition
		 *
		 * @param {T} defVal - An element to return if the sequence contains no elements
		 * @param {Predicate<T>} predicate - A function to test an element for a condition
		 * @returns {T} - The single element of the input sequence that satisfies the condition, or defVal if no such element is found
		 *
		 * @memberOf Ninq
		 */
		singleOrDefault<U>(defVal: U, predicate: Predicate<T>): T | U;
		/**
		 * Returns the only element of a sequence, and throws an exception if there is not exactly one element in the sequence
		 *
		 * @returns {T} - The single element of the input sequence
		 *
		 * @memberOf Ninq
		 */
		single(): T;
		/**
		 * Returns the only element of a sequence that satisfies a specified condition,
		 * 	and throws an exception if more than one such element exists
		 *
		 * @param {Predicate<T>} predicate - A function to test an element for a condition
		 * @returns {T} - The single element of the input sequence that satisfies a condition
		 *
		 * @memberOf Ninq
		 */
		single(predicate: Predicate<T>): T;
	}
}

Object.assign(Ninq, {
	singleOrDefault<T, U>(it: Loopable<T>, defVal: U, predicate?: Predicate<T>) {
		if (predicate) {
			it = Ninq.filter(it, predicate);
		}
		else {
			it = ArrayLikeIterable.toIterable(it);
		}
		let isFirstIteration = true;
		let result: T | U = defVal;
		for (let item of it) {
			if (!isFirstIteration) {
				throw new Error('Expected single value');
			}
			result = item;
			isFirstIteration = false;
		}
		return result;
	},

	single<T>(it: Loopable<T>, predicate?: Predicate<T>) {
		const errValue = '\0__ERROR__\0',
			result = Ninq.singleOrDefault(it, errValue, predicate as any);
		if (result === errValue) {
			throw new Error('Empty sequence');
		}
		return result;
	},
});
Object.assign(Ninq.prototype, {
	singleOrDefault<T, U>(
		this: Ninq<T>,
		defVal: U,
		predicate?: Predicate<T>): T | U {
		return Ninq.singleOrDefault(<Iterable<T>>this[iterable], defVal, predicate as any);
	},

	single<T>(this: Ninq<T>, predicate?: Predicate<T>): T {
		return Ninq.single(<Iterable<T>>this[iterable]);
	},
});
