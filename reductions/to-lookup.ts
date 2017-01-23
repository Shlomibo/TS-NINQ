import { Ninq } from '../core/ninq';
import { Loopable, KeySelector, Lookup } from '../core/declarations';
import ArrayLikeIterable from '../core/array-like-iterable';
import { iterable } from '../core/symbols';

declare module '../core/ninq' {
	namespace Ninq {
		/**
		 * Creates a Lookup<TKey,T> from an Iterable<T> according to a specified key selector function
		 *
		 * @static
		 * @template T - The type of the elements of it
		 * @template TKey - The type of the key returned by keySelector
		 * @param {Loopable<T>} it - The Iterable<T> to create a Lookup<TKey, T> from
		 * @param {KeySelector<T, TKey>} keySelector - A function to extract a key from each element
		 * @returns {Lookup<TKey, T>} - A Lookup<TKey, T> that contains keys and values
		 *
		 * @memberOf Ninq
		 */
		export function toLookup<T, TKey>(it: Loopable<T>, keySelector: KeySelector<T, TKey>): Lookup<TKey, T>;
		/**
		 * Creates a Lookup<TKey, TValue> from an Iterable<T> according to specified key selector and element selector functions
		 *
		 * @static
		 * @template T - The type of the elements of it
		 * @template TKey - The type of the key returned by keySelector
		 * @template TValue
		 * @param {Loopable<T>} it - The Iterable<T> to create a Lookup<TKey, T> from
		 * @param {KeySelector<T, TKey>} keySelector - A function to extract a key from each element
		 * @param {KeySelector<T, TValue>} valueSelector - A transform function to produce a result element value from each element
		 * @returns {Lookup<TKey, TValue>} - A Lookup<TKey, TV> that contains keys and values
		 *
		 * @memberOf Ninq
		 */
		export function toLookup<T, TKey, TValue>(
			it: Loopable<T>,
			keySelector: KeySelector<T, TKey>,
			valueSelector: KeySelector<T, TValue>
		): Lookup<TKey, TValue>;
	}
	interface Ninq<T> {
		/**
		 * Creates a Lookup<TKey,T> from an Iterable<T> according to a specified key selector function
		 *
		 * @template TKey - The type of the key returned by keySelector
		 * @param {KeySelector<T, TKey>} keySelector - A function to extract a key from each element
		 * @returns {Lookup<TKey, T>} - A NinqLookup<TKey, T> that contains keys and values
		 *
		 * @memberOf Ninq
		 */
		toLookup<TKey>(keySelector: KeySelector<T, TKey>): Lookup<TKey, T>;
		/**
		 * Creates a Lookup<TKey, TValue> from an Iterable<T> according to specified key selector and element selector functions
		 *
		 * @template TKey - The type of the key returned by keySelector
		 * @template TValue - The type of the value returned by valueSelector
		 * @param {KeySelector<T, TKey>} keySelector - A function to extract a key from each element
		 * @param {KeySelector<T, TValue>} valueSelector - A transform function to produce a result element value from each element
		 * @returns {Lookup<TKey, TValue>} - A NinqLookup<TKey, TValue> that contains keys and values
		 *
		 * @memberOf Ninq
		 */
		toLookup<TKey, TValue>(
			keySelector: KeySelector<T, TKey>,
			valueSelector: KeySelector<T, TValue>
		): Lookup<TKey, TValue>;
	}
}

Object.assign(Ninq, {
	toLookup<T, TKey>(
		it: Loopable<T>,
		keySelector: KeySelector<T, TKey>,
		vs?: KeySelector<T, any>
	): Lookup<TKey, any> {
		const valueSelector = vs || (x => x);
		const result = new Map<TKey, Iterable<any>>();

		it = ArrayLikeIterable.toIterable(it);
		for (const item of it) {
			const key = keySelector(item),
				value = valueSelector(item),
				list = result.get(key);
			if (!list) {
				result.set(key, [value]);
			}
			else {
				(list as any[]).push(value);
			}
		}
		return new Map<TKey, Ninq<any>>(
			Ninq.map(
				result.entries(),
				([key, value]) => [key, new Ninq(value)]
			)
		);
	},
});
Object.assign(Ninq.prototype, {
	toLookup<T, TKey>(
		this: Ninq<T>,
		keySelector: KeySelector<T, TKey>,
		vs?: KeySelector<T, any>
	): Lookup<TKey, any> {
		return Ninq.toLookup(this[iterable], keySelector, vs as any);
	},
});
