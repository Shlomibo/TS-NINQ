import { EqualityComparer, Loopable } from './core/declarations';
import { ComparerTracker } from './distinct';
import { Ninq, extendToNinq } from './core/ninq';
import ArrayLikeIterable from './core/array-like-iterable';
import { symbols } from './core/symbols';
const iterable = symbols.iterable;

export default class IntersectionIterator<T> extends Ninq<T> {

	constructor(
		left: Iterable<T>,
		right: Iterable<T>,
		comparer: EqualityComparer<T>
	) {
		super({
			*[Symbol.iterator]() {
				left = [...left];
				const tracker = new ComparerTracker(comparer);
		for (let rightItem of right) {
			if (Ninq.some(left, leftItem => comparer(leftItem, rightItem)) &&
				!tracker.wasReturned(rightItem)) {

				yield rightItem;
			}
		}
	}

		});
	}

}

declare module './core/ninq' {
	namespace Ninq {
/**
	 * Produces the set intersection of two sequences.
	 *
	 * @static
	 * @template T - The type of the elements of the input sequences
	 * @param {Loopable<T>} left - An Iterable<T> whose distinct elements that also appear in right will be returned
	 * @param {Loopable<T>} right - An Iterable<T> whose distinct elements that also appear in the left sequence will be returned
	 * @returns - A sequence that contains the elements that form the set intersection of two sequences
	 *
	 * @memberOf Ninq
	 */
	export function intersect<T>(left: Loopable<T>, right: Loopable<T>): Ninqed<T, Set<T>>;
	/**
	 * Produces the set intersection of two sequences.
	 *
	 * @static
	 * @template T - The type of the elements of the input sequences
	 * @param {Loopable<T>} left - An Iterable<T> whose distinct elements that also appear in right will be returned
	 * @param {Loopable<T>} right - An Iterable<T> whose distinct elements that also appear in the left sequence will be returned
	 * @param {EqualityComparer<T>} comparer - A comparer to compare values
	 * @returns - A sequence that contains the elements that form the set intersection of two sequences
	 *
	 * @memberOf Ninq
	 */
	export function intersect<T>(left: Loopable<T>, right: Loopable<T>, comparer: EqualityComparer<T>): Ninq<T>;
	}
	interface Ninq<T> {
/**
	 * Produces the set intersection of two sequences.
	 *
	 * @param {Loopable<T>} other - An Iterable<T> whose distinct elements that also appear in the left sequence will be returned
	 * @param {EqualityComparer<T>} [comparer] - An optional comparer to compare values
	 * @returns - A sequence that contains the elements that form the set intersection of two sequences
	 *
	 * @memberOf Ninq
	 */
		intersect(other: Loopable<T>, comparer?: EqualityComparer<T>): Ninq<T>;
	}
}

Object.assign(Ninq, {
	intersect<T>(left: Loopable<T>, right: Loopable<T>, comparer?: EqualityComparer<T>) {
		[left, right] = [left, right].map(ArrayLikeIterable.toIterable);
		if (comparer) {
			return new IntersectionIterator(left, right, comparer);
		}
		const leftSet = left instanceof Set
			? left as Set<T>
			: new Set(left);
		const result = new Set<T>();
		for (let item of right) {
			if (leftSet.has(item)) {
				result.add(item);
			}
		}
		return extendToNinq(result);
	}
});
Object.assign(Ninq.prototype, {
	intersect<T>(this: Ninq<T>, other: Loopable<T>, comparer?: EqualityComparer<T>) {
		return Ninq.intersect(this[iterable], other, comparer as any);
	}
});
