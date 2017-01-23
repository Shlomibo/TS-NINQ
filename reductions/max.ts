import { Ninq } from '../core/ninq';
import { Loopable, KeySelector } from '../core/declarations';
import ArrayLikeIterable from '../core/array-like-iterable';
import { $default } from '../funcs';
import { iterable } from '../core/symbols';

declare module '../core/ninq' {
	namespace Ninq {
		/**
		 * Returns the maximum value in a sequence
		 *
		 * @static
		 * @param {Iterable<number>} it - A sequence of values to determine the maximum value of
		 * @returns {(number | undefined)} - The maximum value in the sequence or undefined
		 *
		 * @memberOf Ninq
		 */
		export function max(it: Loopable<number>): number | undefined;
		/**
		 * Invokes a transform function on each element of a sequence and returns the maximum value
		 *
		 * @static
		 * @template T - The type of the elements of it
		 * @param {Loopable<T>} it - A sequence of values to determine the maximum value of
		 * @param {Mapping<T, number>} valSelector - A transform function to apply to each element
		 * @returns {(number | undefined)} - The maximum value in the sequence or undefined
		 *
		 * @memberOf Ninq
		 */
		export function max<T>(it: Loopable<T>, valSelector: KeySelector<T, number>): number | undefined;
	}
	interface Ninq<T> {
		/**
		 * Returns the maximum value
		 *
		 * @returns {(number | undefined)} - The maximum value in the sequence or undefined
		 *
		 * @memberOf Ninq
		 */
		max(): number | undefined;
		/**
		 * Invokes a transform function on each element of the sequence and returns the maximum value
		 *
		 * @param {Mapping<T, number>} valSelector - A transform function to apply to each element
		 * @returns {(number | undefined)} - The maximum value in the sequence or undefined
		 *
		 * @memberOf Ninq
		 */
		max(valSelector: KeySelector<T, number>): number | undefined;
	}
}

Object.assign(Ninq, {
	max<T>(it: Loopable<T>, valSelector?: KeySelector<T, number>) {
		it = ArrayLikeIterable.toIterable(it);
		const selector = valSelector || (x => x as any as number);
		return Ninq.reduce(it, (max: number | undefined, current: T) =>
			Math.max($default(max, -Infinity), selector(current))
		);
	},
});
Object.assign(Ninq.prototype, {
	max<T>(this: Ninq<T>, valSelector?: KeySelector<T, number>) {
		return Ninq.max(this[iterable], valSelector as any);
	},
});
