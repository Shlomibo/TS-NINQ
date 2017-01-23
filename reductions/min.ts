import { Ninq } from '../core/ninq';
import { Loopable, KeySelector } from '../core/declarations';
import { $default } from '../funcs';
import { iterable } from '../core/symbols';

declare module '../core/ninq' {
	namespace Ninq {
		/**
		 * Returns the minimum value in a sequence
		 *
		 * @static
		 * @param {Loopable<number>} it - A sequence of values to determine the minimum value of
		 * @returns {(number | undefined)} - The minimum value in the sequence
		 *
		 * @memberOf Ninq
		 */
		export function min(it: Loopable<number>): number | undefined;
		/**
		 * Invokes a transform function on each element of a sequence and returns the minimum value
		 *
		 * @static
		 * @template T - The type of the elements of it
		 * @param {Loopable<T>} it - A sequence of values to determine the minimum value of
		 * @param {Mapping<T, number>} valSelector - A transform function to apply to each element
		 * @returns {(number | undefined)} - The minimum value in the sequence
		 *
		 * @memberOf Ninq
		 */
		export function min<T>(it: Loopable<T>, valSelector: KeySelector<T, number>): number | undefined;
	}
	interface Ninq<T> {
		/**
		 * Returns the minimum value
		 *
		 * @returns {(number | undefined)} - The minimum value in the sequence
		 *
		 * @memberOf Ninq
		 */
		min(): number | undefined;
		/**
		 * Invokes a transform function on each element of a sequence and returns the minimum value
		 *
		 * @param {Mapping<T, number>} valSelector - A transform function to apply to each element
		 * @returns {(number | undefined)} - The minimum value in the sequence
		 *
		 * @memberOf Ninq
		 */
		min(valSelector: KeySelector<T, number>): number | undefined;
	}
}

Object.assign(Ninq, {
	min<T>(it: Loopable<T>, valSelector?: KeySelector<T, number>) {
		const selector = valSelector || (x => x as any as number);
		return Ninq.reduce(it, (min: number | undefined, current: T) =>
			Math.min($default(min, Infinity), selector(current))
		);
	},
});
Object.assign(Ninq.prototype, {
	min<T>(this: Ninq<T>, valSelector?: KeySelector<T, number>) {
		return Ninq.min(this[iterable], valSelector as any);
	},
});
