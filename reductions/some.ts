import { Ninq } from '../core/ninq';
import { Loopable, Predicate } from '../core/declarations';
import { isArrayLike } from '../core/array-like-iterable';
import ArrayLikeIterable from '../core/array-like-iterable';
import { iterable } from '../core/symbols';

import './some';

declare module '../core/ninq' {
	namespace Ninq {
		/**
	 * Determines whether any element of a sequence satisfies a condition
	 *
	 * @static
	 * @template T - Iterable type
	 * @param  {Loopable<T>} - Iterable to reduce
	 * @param {Predicate<T>} [prediacte] - A function to test each element for a condition
	 * @returns {boolean} - true if any elements in the source sequence pass the test in the specified predicate;
	 * 	otherwise, false
	 *
	 * @memberOf Ninq
	 */
		export function some<T>(it: Loopable<T>, prediacte?: Predicate<T>): boolean;
	}
	interface Ninq<T> {
		/**
		 * Determines whether any element of a sequence satisfies a condition
		 *
		 * @param {Predicate<T>} [prediacte] - A function to test each element for a condition
		 * @returns {boolean} - true if any elements in the source sequence pass the test in the specified predicate;
		 * 	otherwise, false
		 *
		 * @memberOf Ninq
		 */
		some(prediacte?: Predicate<T>): boolean;
	}
}

Object.assign(Ninq, {
	some<T>(it: Loopable<T>, prediacte?: Predicate<T>): boolean {
		if (isArrayLike(it)) {
			if (!prediacte) {
				return it.length > 0;
			}
			it = ArrayLikeIterable.toIterable(it);
		}
		return typeof prediacte === 'function'
			? !Ninq.every(it, (item, i) => !prediacte(item, i))
			: !it[Symbol.iterator]()
				.next()
				.done;
	},
});
Object.assign(Ninq.prototype, {
	some<T>(this: Ninq<T>, prediacte?: Predicate<T>) {
		return Ninq.some(this[iterable], prediacte);
	}
});
