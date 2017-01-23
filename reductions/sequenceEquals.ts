import { Ninq } from '../core/ninq';
import { Loopable, EqualityComparer } from '../core/declarations';
import './every';
import { iterable } from '../core/symbols';

declare module '../core/ninq' {
	namespace Ninq {
		/**
		 * Determines whether two sequences are equal by comparing the elements
		 *
		 * @template T - The type of the elements of the input sequences
		 * @param {Loopable<T>} left - An Iterable<T> to compare to right sequence
		 * @param {Loopable<T>} right - An Iterable<T> to compare to the left sequence
		 * @param {EqualityComparer<T>} [equalityComparer] - A comparing func to compare elements
		 * @returns {boolean} - true if the two source sequences are of equal length and their corresponding elements compare equal; otherwise, false
		 *
		 * @memberOf Ninq
		 */
		export function sequenceEqual<T>(
			left: Loopable<T>,
			right: Loopable<T>,
			equalityComparer?: EqualityComparer<T>
		): boolean;
	}
	interface Ninq<T> {
		/**
		 * Determines whether two sequences are equal by comparing the elements
		 *
		 * @param {Loopable<T>} other - An Iterable<T> to compare to the this sequence
		 * @param {EqualityComparer<T>} [equalityComparer] - A comparing func to compare elements
		 * @returns {boolean} - true if the two source sequences are of equal length and their corresponding elements compare equal; otherwise, false
		 *
		 * @memberOf Ninq
		 */
		sequenceEqual(other: Loopable<T>, equalityComparer?: EqualityComparer<T>): boolean;
	}
}

Object.assign(Ninq, {
	sequenceEqual<T>(
		left: Loopable<T>,
		right: Loopable<T>,
		equalityComparer?: EqualityComparer<T>
	): boolean {
		const comparer = equalityComparer || ((x, y) => x === y) as EqualityComparer<T>;
		return Ninq.every(
			Ninq.zip(left, right),
			([left, right]) => comparer(left, right)
		);
	},
});
Object.assign(Ninq.prototype, {
	sequenceEqual<T>(
		this: Ninq<T>,
		other: Loopable<T>,
		equalityComparer?: EqualityComparer<T>
	): boolean {
		return Ninq.sequenceEqual(this[iterable], other, equalityComparer);
	},
});
