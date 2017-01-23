import { Ninq } from '../core/ninq';
import { Loopable, KeySelector, Hash } from '../core/declarations';
import ArrayLikeIterable from '../core/array-like-iterable';
import { iterable } from '../core/symbols';

declare module '../core/ninq' {
	namespace Ninq {
		/**
		 * Creates a Hash<T> from an Iterable<T>
		 *
		 * @static
		 * @template T - The type of the elements of it
		 * @param {Loopable<T>} it - An Iterable<T> to create a Hash<T> from
		 * @param {KeySelector<T, string>} keySelector - A function to extract a key from each element
		 * @returns {Hash<T>} - A Hash<T> that contains keys and values
		 *
		 * @memberOf Ninq
		 */
		export function toObject<T>(it: Loopable<T>, keySelector: KeySelector<T, string>): Hash<T>;
		/**
		 * Creates a Hash<TValue> from an Iterable<T> according to specified element selector function
		 *
		 * @static
		 * @template T - The type of the elements of it
		 * @template TValue - The type of the value returned by valueSelector
		 * @param {Loopable<T>} it - An Iterable<T> to create a Hash<TValue> from
		 * @param {KeySelector<T, string>} keySelector - A function to extract a key from each element
		 * @param {KeySelector<T, TValue>} valueSelector - A transform function to produce a result element value from each element
		 * @returns {Hash<TValue>} - A Hash<TValue> that contains values of type TValue selected from the input sequence
		 *
		 * @memberOf Ninq
		 */
		export function toObject<T, TValue>(
			it: Loopable<T>,
			keySelector: KeySelector<T, string>,
			valueSelector: KeySelector<T, TValue>
		): Hash<TValue>;
	}
	interface Ninq<T> {
		/**
		 * Creates a Hash<T> from an Iterable<T>
		 *
		 * @param {KeySelector<T, string>} keySelector - A function to extract a key from each element
		 * @returns {Hash<T>} - A Hash<T> that contains keys and values
		 *
		 * @memberOf Ninq
		 */
		toObject(keySelector: KeySelector<T, string>): Hash<T>;
		/**
		 * Creates a Hash<TValue> from an Iterable<T> according to specified element selector function
		 *
		 * @template TValue - The type of the value returned by valueSelector
		 * @param {KeySelector<T, string>} keySelector - A function to extract a key from each element
		 * @param {KeySelector<T, TValue>} valueSelector - A transform function to produce a result element value from each element
		 * @returns {Hash<TValue>} - A Hash<TValue> that contains values of type TValue selected from the input sequence
		 *
		 * @memberOf Ninq
		 */
		toObject<TValue>(
			keySelector: KeySelector<T, string>,
			valueSelector: KeySelector<T, TValue>
		): Hash<TValue>;

	}
}

Object.assign(Ninq, {
	toObject<T>(
		it: Loopable<T>,
		keySelector: KeySelector<T, string>,
		valueSelector: KeySelector<T, any> = x => x
	): Hash<any> {
		const result: Hash<any> = {};

		it = ArrayLikeIterable.toIterable(it);
		for (const item of it) {
			const key = keySelector(item),
				value = valueSelector(item);
			result[key] = value;
		}
		return result;
	},
});
Object.assign(Ninq.prototype, {
	toObject<T>(
		this: Ninq<T>,
		keySelector: KeySelector<T, string>,
		vs?: KeySelector<T, any>
	): Hash<any> {
		return Ninq.toObject(this[iterable], keySelector, vs as any);
	}

});
