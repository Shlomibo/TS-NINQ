import { Ninq } from '../core/ninq';
import { Loopable, KeySelector } from '../core/declarations';
import { iterable } from '../core/symbols';

import './reduce';

declare module '../core/ninq' {
	namespace Ninq {
		/**
		 * Computes the sum of a sequence of numbers
		 *
		 *
		 * @static
		 * @param {Loopable<number>} it - A sequence of number values to calculate the sum of
		 * @returns {number} - The sum of the values in the sequence
		 *
		 * @memberOf Ninq
		 */
		export function sum(it: Loopable<number>): number;
		/**
		 * Computes the sum of the sequence of number values that are obtained by invoking a transform function
		 * 	on each element of the input sequence
		 *
		 * @static
		 * @template T - The type of the elements of it
		 * @param {Loopable<T>} it - A sequence of values that are used to calculate a sum
		 * @param {KeySelector<T, number>} selector - A transform function to apply to each element
		 * @returns - The sum of the projected values
		 *
		 * @memberOf Ninq
		 */
		export function sum<T>(it: Loopable<T>, selector: KeySelector<T, number>): number;
	}
	interface Ninq<T> {
		/**
		 * Computes the sum of the sequence of number values that are obtained by invoking a transform function
		 * 	on each element of the input sequence
		 *
		 * @param {KeySelector<T, number>} selector - A transform function to apply to each element
		 * @returns - The sum of the projected values
		 *
		 * @memberOf Ninq
		 */
		sum(selector: KeySelector<T, number>): number;
	}
}

Object.assign(Ninq, {
	sum<T>(it: Loopable<T>, selector?: KeySelector<T, number>): number {
		const keySelector: KeySelector<T, number> = selector || ((x: any) => x as number);
		return Ninq.reduce(
			it,
			0,
			(sum: number, item: T) => sum + keySelector(item)
		);
	},
});
Object.assign(Ninq.prototype, {
	sum<T>(this: Ninq<T>, selector: KeySelector<T, number>): number {
		return Ninq.sum(this[iterable], selector);
	},
});
