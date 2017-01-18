import { EqualityComparer, Loopable } from './core/declarations';
import { Ninq } from './core/ninq';
import ArrayLikeIterable from './core/array-like-iterable';
import { symbols } from './core/symbols';
const iterable = symbols.iterable;

class ExceptIterable<T> extends Ninq<T> {
		private readonly _left: Iterable<T>;
		private readonly _right: Iterable<T>;
		private readonly _comparer?: EqualityComparer<T>;

	constructor(
		left: Iterable<T>,
		right: Iterable<T>,
		comparer?: EqualityComparer<T>
	) {
		let that: this;
		super({
			*[Symbol.iterator]() {
				if (that._comparer) {
					let [...result] = new Set(that._left);
					for (let rightItem of that._right) {
						result = result.filter(leftItem =>
							that._comparer && !that._comparer(leftItem, rightItem)
						);
					}
					yield* result;
				}
				else {
					let lSet = new Set(that._left),
						rSet = new Set(that._right);
					for (let item of lSet) {
						if (!rSet.has(item)) {
							yield item;
						}
					}
				}
			},
		});
		that = this;
		this._left = left;
		this._right = right;
		this._comparer = comparer;
	}
}

declare module './core/ninq' {
	namespace Ninq {
		/**
		 * Produces the set difference of two sequences by using the specified IEqualityComparer<T> to compare values
		 *
		 * @static
		 * @template T - Itrable's elements' type
		 * @param {Loopable<T>} left - An Iterable<T> whose elements that are not also in second will be returned
		 * @param {Loopable<T>} right - An Iterable<T> whose elements that also occur in the first sequence
		 * 	will cause those elements to be removed from the returned sequence
		 * @param {EqualityComparer<T>} [comparer] - A comparer to compare values
		 * @returns A sequence that contains the set difference of the elements of two sequences
		 *
		 * @memberOf Ninq
		 */
		export function except<T>(
			left: Loopable<T>,
			right: Loopable<T>,
			comparer?: EqualityComparer<T>): Ninq<T>;
	}
	interface Ninq<T> {
		/**
		 * Produces the set difference of two sequences by using the specified IEqualityComparer<T> to compare values
		 *
		 * @param {Loopable<T>} other - An Iterable<T> whose elements that also occur in the first sequence
		 * 	will cause those elements to be removed from the returned sequence
		 * @param {EqualityComparer<T>} [comparer] - A comparer to compare values
		 * @returns A sequence that contains the set difference of the elements of two sequences
		 *
		 * @memberOf Ninq
		 */
		except(other: Loopable<T>, comparer?: EqualityComparer<T>): Ninq<T>;
	}
}

Object.assign(Ninq, {
	except<T>(left: Loopable<T>, right: Loopable<T>, comparer?: EqualityComparer<T>) {
		[left, right] = [left, right].map(ArrayLikeIterable.toIterable);
		return new ExceptIterable(left, right, comparer);
	},
});

Object.assign(Ninq.prototype, {
	except<T>(this: Ninq<T>, other: Loopable<T>, comparer?: EqualityComparer<T>): Ninq<T> {
		return Ninq.except(this[iterable], other, comparer);
	},
});