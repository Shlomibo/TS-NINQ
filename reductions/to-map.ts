import { Ninq } from '../core/ninq';
import { Loopable, KeySelector } from '../core/declarations';
import ArrayLikeIterable from '../core/array-like-iterable';
import { iterable } from '../core/symbols';

declare module '../core/ninq' {
	namespace Ninq {
		/**
		 * Creates a Map<TKey, T> from an Iterable<T> according to a specified key selector function
		 *
		 * @static
		 * @template T - The type of the elements of it
		 * @template TKey - The type of the key returned by keySelector
		 * @param {Loopable<T>} it - An Iterable<T> to create a Map<TKey, T> from
		 * @param {KeySelector<T, TKey>} keySelector - A function to extract a key from each element
		 * @returns {Map<TKey, T>} - A Map<TKey, T> that contains keys and values
		 *
		 * @memberOf Ninq
		 */
		export function toMap<T, TKey>(it: Loopable<T>, keySelector: KeySelector<T, TKey>): Map<TKey, T>;
		/**
		 * Creates a Map<TKey, TValue> from an Iterable<T> according to specified key selector and element selector functions
		 *
		 * @static
		 * @template T - The type of the elements of it
		 * @template TKey - The type of the key returned by keySelector
		 * @template TValue - The type of the value returned by valueSelector
		 * @param {Loopable<T>} it - An Iterable<T> to create a Map<TKey, TValue> from
		 * @param {KeySelector<T, TKey>} keySelector - A function to extract a key from each element
		 * @param {KeySelector<T, TValue>} valueSelector - A transform function to produce a result element value from each element
		 * @returns {Map<TKey, TValue>} - A Map<TKey, TValue> that contains values of type TValue selected from the input sequence
		 *
		 * @memberOf Ninq
		 */
		export function toMap<T, TKey, TValue>(
			it: Loopable<T>,
			keySelector: KeySelector<T, TKey>,
			valueSelector: KeySelector<T, TValue>
		): Map<TKey, TValue>;

	}
	interface Ninq<T> {
		/**
		 * Creates a Map<TKey, T> from an Iterable<T> according to a specified key selector function
		 *
		 * @template TKey - The type of the key returned by keySelector
		 * @param {KeySelector<T, TKey>} keySelector - A function to extract a key from each element
		 * @returns {Map<TKey, T>} - A Map<TKey, T> that contains keys and values
		 *
		 * @memberOf Ninq
		 */
		toMap<TKey>(keySelector: KeySelector<T, TKey>): Map<TKey, T>;
		/**
		 * Creates a Map<TKey, TValue> from an Iterable<T> according to specified key selector and element selector functions
		 *
		 * @template TKey - The type of the key returned by keySelector
		 * @template TValue - The type of the value returned by valueSelector
		 * @param {KeySelector<T, TKey>} keySelector - A function to extract a key from each element
		 * @param {KeySelector<T, TValue>} valueSelector - A transform function to produce a result element value from each element
		 * @returns {Map<TKey, TValue>} - A Map<TKey, TValue> that contains values of type TValue selected from the input sequence
		 *
		 * @memberOf Ninq
		 */
		toMap<TKey, TValue>(
			keySelector: KeySelector<T, TKey>,
			valueSelector: KeySelector<T, TValue>
		): Map<TKey, TValue>;

	}
}

Object.assign(Ninq, {
	toMap<T, TK>(
		it: Loopable<T>,
		keySelector: KeySelector<T, TK>,
		vs?: KeySelector<T, any>
	): Map<TK, any> {
		const valueSelector: KeySelector<T, any> = vs || (x => x);
		const result = new Map<TK, any>();

		it = ArrayLikeIterable.toIterable(it);
		for (const item of it) {
			const key = keySelector(item),
				value = valueSelector(item);
			result.set(key, value);
		}
		return result;
	},
});
Object.assign(Ninq.prototype, {
	toMap<T, TK>(
		this: Ninq<T>,
		keySelector: KeySelector<T, TK>,
		vs?: KeySelector<T, any>
	): Map<TK, any> {
		return Ninq.toMap(this[iterable], keySelector, vs as any);
	},
});
