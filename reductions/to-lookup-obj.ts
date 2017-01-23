import { Ninq } from '../core/ninq';
import { Loopable, KeySelector, Hash } from '../core/declarations';
import ArrayLikeIterable from '../core/array-like-iterable';
import { iterable } from '../core/symbols';

declare module '../core/ninq' {
	namespace Ninq {
/**
	 * Creates a Hash<Iterable<T>> from an Iterable<T> according to a specified key selector function
	 *
	 * @static
	 * @template T - The type of the elements of it
	 * @param {Loopable<T>} it - The Iterable<T> to create a Hash<Iterable<T>> from
	 * @param {KeySelector<T, string>} keySelector - A function to extract a key from each element
	 * @returns {Hash<Iterable<T>>} - A Hash<Iterable<T>> that contains keys and values
	 *
	 * @memberOf Ninq
	 */
	export function toLookupObject<T>(it: Loopable<T>, keySelector: KeySelector<T, PropertyKey>): Hash<Ninq<T>>;
	/**
	 * Creates a Hash<Iterable<TValue>> from an Iterable<T> according to specified key selector and element selector functions
	 *
	 * @static
	 * @template T - The type of the elements of it
	 * @template TValue - The type of the value returned by valueSelector
	 * @param {Loopable<T>} it - The Iterable<T> to create a Hash<Iterable<T>> from
	 * @param {KeySelector<T, string>} keySelector - A function to extract a key from each element
	 * @param {KeySelector<T, TValue>} valueSelector - A transform function to produce a result element value from each element
	 * @returns {Hash<Iterable<TValue>>} - A Hash<Iterable<TValue>> that contains keys and values
	 *
	 * @memberOf Ninq
	 */
	export function toLookupObject<T, TValue>(
		it: Loopable<T>,
		keySelector: KeySelector<T, string>,
		valueSelector: KeySelector<T, TValue>
	): Hash<Ninq<TValue>>;

	}
	interface Ninq<T> {
		/**
		 * Creates a Hash<Iterable<T>> from an Iterable<T> according to a specified key selector function
		 *
		 * @param {KeySelector<T, string>} keySelector - A function to extract a key from each element
		 * @returns {Hash<Iterable<T>>} - A Hash<Iterable<T>> that contains keys and values
		 *
		 * @memberOf Ninq
		 */
		toLookupObject(keySelector: KeySelector<T, string>): Hash<Ninq<T>>;
		/**
		 * Creates a Hash<Iterable<TValue>> from an Iterable<T> according to specified key selector and element selector functions
		 *
		 * @template TValue - The type of the value returned by valueSelector
		 * @param {KeySelector<T, string>} keySelector - A function to extract a key from each element
		 * @param {KeySelector<T, TValue>} valueSelector - A transform function to produce a result element value from each element
		 * @returns {Hash<Ninq<TValue>>} - A Hash<Ninq<TValue>> that contains keys and values
		 *
		 * @memberOf Ninq
		 */
		toLookupObject<TValue>(
			keySelector: KeySelector<T, string>,
			valueSelector: KeySelector<T, TValue>
		): Hash<Ninq<TValue>>;

	}
}

Object.assign(Ninq, {
	toLookupObject<T>(
		it: Loopable<T>,
		keySelector: KeySelector<T, PropertyKey>,
		vs?: KeySelector<T, any>
	): Hash<Ninq<any>> {
		const valueSelector = vs || (x => x);
		const result: Hash<any[]> = {};

		it = ArrayLikeIterable.toIterable(it);
		for (const item of it) {
			const key = keySelector(item),
				value = valueSelector(item),
				list = result[key] || [];
			list.push(value);
			result[key] = list;
		}
		return Object.keys(result)
			.reduce((obj, key) => {
				obj[key] = new Ninq(result[key]);
				return obj;
			}, {} as Hash<Ninq<any>>);
	},
});
Object.assign(Ninq.prototype, {
	toLookupObject<T>(
		this: Ninq<T>,
		keySelector: KeySelector<T, string>,
		vs?: KeySelector<T, any>
	): Hash<Ninq<any>> {
		return Ninq.toLookupObject(this[iterable], keySelector, vs as any);
	},
});
