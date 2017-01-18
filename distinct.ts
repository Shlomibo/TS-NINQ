import { EqualityComparer, Loopable } from './core/declarations';
import { Ninq, extendToNinq } from './core/ninq';
import ArrayLikeIterable from './core/array-like-iterable';
import sym from './core/symbols';

const iterable = sym.iterable;
export interface Tracker<T> {
	wasReturned(item: T): boolean;
}
class DefaultTracker<T> implements Tracker<T> {
	private readonly set = new Set<T>();
	wasReturned(item: T) {
		const result = this.set.has(item);
		this.set.add(item);
		return result;
	}
}
export class ComparerTracker<T> implements Tracker<T> {
	private readonly prevItems = [] as T[];
	constructor(
		private readonly comparer: EqualityComparer<T>,
		items?: Iterable<T>
	) {
		if (items) {
			[...this.prevItems] = items;
		}
	}
	wasReturned(item: T) {
		const result = 0 !== this.prevItems.filter(element => this.comparer(element, item)).length;
		if (!result) {
			this.prevItems.push(item);
		}
		return result;
	}
}

class DistinctIterable<T> extends Ninq<T> {
	private readonly _tracker: () => Tracker<T>;
	private readonly _it: Iterable<T>;

	constructor(
		it: Iterable<T>,
		comparer?: EqualityComparer<T>
	) {
		let that: this;
		super({
			*[Symbol.iterator]() {
				const tracker = that._tracker();
				for (let item of that._it) {
					if (!tracker.wasReturned(item)) {
						yield item;
					}
				}
			},
		});
		that = this;
		this._it = it;
		this._tracker = typeof comparer !== 'function'
			? () => new DefaultTracker<T>()
			: () => new ComparerTracker(comparer);
	}

}

declare module './core/ninq' {
	namespace Ninq {

		/**
		 * Returns distinct elements from a sequence by using the default equality comparer to compare values
		 *
		 * @static
		 * @template T - Itrable's elements' type
		 * @param {Loopable<T>} it - Iterable to calculate avg for
		 * @returns {Set<T>} A Set<T> that contains distinct elements from the source sequence
		 *
		 * @memberOf Ninq
		 */
		export function distinct<T>(it: Loopable<T>): Ninqed<T, Set<T>>;
		/**
		 * Returns distinct elements from a sequence by using a specified IEqualityComparer<T> to compare values
		 *
		 * @static
		 * @template T - Itrable's elements' type
		 * @param {Iterable<T>} it - Iterable to calculate avg for
		 * @param {EqualityComparer<T>} comparer - A comparer to compare values
		 * @returns {Iterable<T>} A sequence that contains distinct elements from the source sequence
		 *
		 * @memberOf Ninq
		 */
		export function distinct<T>(it: Loopable<T>, comparer: EqualityComparer<T>): Ninq<T>;
	}
	interface Ninq<T> {
		/**
		 * Returns distinct elements from a sequence by using a specified IEqualityComparer<T> to compare values
		 *
		 * @returns {Ninq<T> & Set<T>} - A Ninq<T> that contains distinct elements from the source sequence
		 *
		 * @memberOf Ninq
		 */
		distinct(): Ninqed<T, Set<T>>;
		/**
		 * Returns distinct elements from a sequence by using a specified IEqualityComparer<T> to compare values
		 *
		 * @param {EqualityComparer<T>} comparer - A comparer to compare values
		 * @returns A Ninq<T> that contains distinct elements from the source sequence
		 *
		 * @memberOf Ninq
		 */
		distinct(comparer: EqualityComparer<T>): Ninq<T>;
	}
}

Object.assign(Ninq, {
	distinct<T>(it: Loopable<T>, comparer?: EqualityComparer<T>) {
		it = ArrayLikeIterable.toIterable(it);
		return typeof comparer === 'function'
			? new DistinctIterable(it, comparer)
			: extendToNinq<T, Set<T>>(new Set(it));
	},
});

Object.assign(Ninq.prototype, {
	distinct<T>(this: Ninq<T>, comparer?: EqualityComparer<T>) {
		return Ninq.distinct(this[iterable], comparer as any);
	},
});
