import { Ninq } from '../core/ninq';
import { Loopable, ReductionFunc } from '../core/declarations';
import ArrayLikeIterable from '../core/array-like-iterable';
import { iterable } from '../core/symbols';

declare module '../core/ninq' {
	namespace Ninq {
		/**
		 * Applies an accumulator function over a sequence
		 *
		 * @static
		 * @template T - Iterable type
		 * @template TResult - The type of the accumulator value
		 * @param  {Loopable<T>} - Iterable to reduce
		 * @param {ReductionFunc<T, TResult>} reduction - An accumulator function to be invoked on each element.
		 * @returns {(TResult | undefined)} The final accumulator value
		 *
		 * @memberOf Ninq
		 */
		export function reduce<T, TResult>(
			it: Loopable<T>,
			reduction: ReductionFunc<T, TResult>
		): TResult | undefined;
		/**
		 * Applies an accumulator function over a sequence.
		 * The specified seed value is used as the initial accumulator value
		 *
		 * @static
		 * @template T - Iterable type
		 * @template TResult - The type of the accumulator value
		 * @param  {Loopable<T>} - Iterable to reduce
		 * @param {TResult} seed - The initial accumulator value
		 * @param {ReductionFunc<T, TResult>} reduction - An accumulator function to be invoked on each element
		 * @returns {TResult} - The final accumulator value
		 *
		 * @memberOf Ninq
		 */
		export function reduce<T, TResult>(
			it: Loopable<T>,
			seed: TResult,
			reduction: ReductionFunc<T, TResult>
		): TResult;
	}
	interface Ninq<T> {
		/**
		 * Applies an accumulator function over a sequence
		 *
		 * @template TResult - The type of the accumulator value
		 * @param {ReductionFunc<T, TResult>} reduction - An accumulator function to be invoked on each element.
		 * @returns {(TResult | undefined)} The final accumulator value
		 *
		 * @memberOf Ninq
		 */
		reduce<TResult>(reduction: ReductionFunc<T, TResult>): TResult | undefined;
		/**
		 * Applies an accumulator function over a sequence.
		 * The specified seed value is used as the initial accumulator value
		 *
		 * @template TResult - The type of the accumulator value
		 * @param {TResult} seed - The initial accumulator value
		 * @param {ReductionFunc<T, TResult>} reduction - An accumulator function to be invoked on each element
		 * @returns {TResult} - The final accumulator value
		 *
		 * @memberOf Ninq
		 */
		reduce<TResult>(seed: TResult, reduction: ReductionFunc<T, TResult>): TResult;
	}
}

Object.assign(Ninq, {
	reduce<T, TResult>(
		it: Loopable<T>,
		seedOrReduc: TResult | ReductionFunc<T, TResult>,
		reduc?: ReductionFunc<T, TResult>
	): TResult | undefined {
		const reduction = typeof reduc === 'function'
			? reduc
			: seedOrReduc as ReductionFunc<T, TResult>;
		let result = typeof reduc === 'function'
			? seedOrReduc as TResult
			: undefined;
		let i = 0;
		it = ArrayLikeIterable.toIterable(it);
		for (let item of it) {
			result = reduction(result, item, i);
			i++;
		}
		return result;
	},
});
Object.assign(Ninq.prototype, {
	reduce<T, TResult>(
		this: Ninq<T>,
		seedOrReduc: TResult | ReductionFunc<T, TResult>,
		reduc?: ReductionFunc<T, TResult>
	): TResult | undefined {
		return typeof reduc === 'function'
			? Ninq.reduce(
				this[iterable],
				seedOrReduc as TResult,
				reduc
			)
			: Ninq.reduce(
				this[iterable],
				seedOrReduc as ReductionFunc<T, TResult>
			);
	}
});
