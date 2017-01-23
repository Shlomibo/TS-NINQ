import { Ninq } from '../core/ninq';
import { Predicate, Loopable } from '../core/declarations';
import { iterable } from '../core/symbols';
import '../filter';

declare module '../core/ninq' {
	namespace Ninq {
		/**
		 * Splits an iterable into 2 iterables based on a predicate.
		 *
		 * @static
		 * @template T - Iterable's items' type.
		 * @param {Loopable<T>} it - The iterable to split.
		 * @param {Predicate<T>} predicate - A predicate to split the iterable by.
		 * @returns {[Iterable<T>, Iterable<T>]} - A pair of iterables.
		 * 		The first iterables returns all items that passes the predicate;
		 *		And the second returns all items that didn't pass the predicate.
		*
		* @memberOf Ninq
		*/
		export function split<T>(it: Loopable<T>, predicate: Predicate<T>): [Ninq<T>, Ninq<T>];
	}
	interface Ninq<T> {
		/**
		 * Splits this iterable into 2 iterables based on a predicate.
		 *
		 * @param {Predicate<T>} predicate - A predicate to split the iterable by.
		 * @returns {[Ninq<T>, Ninq<T>]} - A pair of iterables.
		 * 		The first iterables returns all items that passes the predicate;
		 *		And the second returns all items that didn't pass the predicate.
		*
		* @memberOf Ninq
		*/
		(predicate: Predicate<T>): [Ninq<T>, Ninq<T>];
	}
}

Object.assign(Ninq, {
	split<T>(it: Loopable<T>, predicate: Predicate<T>): [Ninq<T>, Ninq<T>] {
		return [
			Ninq.filter(it, predicate),
			Ninq.filter(it, (item, index) => !predicate(item, index)),
		];
	},
});
Object.assign(Ninq.prototype, {
	split<T>(this: Ninq<T>, predicate: Predicate<T>): [Ninq<T>, Ninq<T>] {
		return Ninq.split(this[iterable], predicate);
	}
});
