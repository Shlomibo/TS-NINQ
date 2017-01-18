import { Ninq } from './core/ninq';
import { Loopable } from './core/declarations';

import { isLoopable } from './core/array-like-iterable';
import ArrayLikeIterable from './core/array-like-iterable';
import sym from './core/symbols';

const iterable = sym.iterable;

class ConcatIterable<T> extends Ninq<T> {
	private readonly _iterables: Iterable<Iterable<T>>;

	constructor(
		iterables: Iterable<Iterable<T>>
	) {
		let that: this;
		super({
			*[Symbol.iterator]() {
				for (let iterable of that._iterables) {
					yield* iterable;
				}
			},
		});
		that = this;
		for (let iterable of iterables) {
			if (!iterable || (typeof iterable[Symbol.iterator] !== 'function')) {
				throw new Error("Iterable is't iterable");
			}
		}
		this._iterables = iterables;
	}
}

declare module './core/ninq' {
	namespace Ninq {
		/**
		 * Return a concatination of this sequence and the provided sequences.
		 *
		 * @static
		 * @template T - Itrable's elements' type
		 * @param {...Loopable<T>[]} iterables - Iterable to concat to this sequence.
		 * @returns {Iterable<T>} A concatination of this sequence and the provided sequences
		 *
		 * @memberOf Ninq
		 */
		export function concat<T>(first: Loopable<T>, ...iterables: Loopable<T>[]): Ninq<T>;
	}
	interface Ninq<T> {
		/**
		 * Return a concatination of this sequence and the provided sequences.
		 *
		 * @param {...Iterable<T>[]} iterables - Iterable to concat to this sequence.
		 * @returns {Ninq<T>} A concatination of this sequence and the provided sequences
		 *
		 * @memberOf Ninq
		 */
		concat<T>(this: Ninq<T>, other: Loopable<T>, ...rest: Loopable<T>[]): Ninq<T>;
		/**
		 * Return a concatination of this sequence and the provided sequences.
		 *
		 * @param {...Iterable<T>[]} iterables - Iterable to concat to this sequence.
		 * @returns {Ninq<T>} A concatination of this sequence and the provided sequences
		 *
		 * @memberOf Ninq
		 */
		concatTo<T>(this: Ninq<T>, it: Loopable<T>): Ninq<T>;
	}
}

Object.assign(Ninq, {
	concat<T>(first: Loopable<T>, ...iterables: Loopable<T>[]): Ninq<T> {
		iterables.unshift(first);
		if (iterables.some(it => !isLoopable(it))) {
			throw new TypeError('Not an iterable');
		}
		return new ConcatIterable(iterables.map(ArrayLikeIterable.toIterable));
	},
});

Object.assign(Ninq.prototype, {

	concat<T>(this: Ninq<T>, other: Loopable<T>, ...rest: Loopable<T>[]): Ninq<T> {
		const it = this[iterable] as Loopable<T>;
		return Ninq.concat<T>(it, ...[other, ...rest], );
	},

	concatTo<T>(this: Ninq<T>, it: Loopable<T>): Ninq<T> {
		return Ninq.concat(it, this[iterable]);
	},
});
