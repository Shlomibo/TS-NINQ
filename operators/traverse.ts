import { Ninq } from '../core/ninq';
import { Loopable } from '../core/declarations';
import ArrayLikeIterable from '../core/array-like-iterable';
import { iterable } from '../core/symbols';

export interface TraverseMappingBase<T> {
	current: T;
	index: number;
	last: boolean;
}
export interface FirstTraverseMapping<T> extends TraverseMappingBase<T> {
	previous: undefined;
	first: true;
}
export interface LaterTraverseMapping<T> extends TraverseMappingBase<T> {
	previous: T;
	first: false;
}
export type TraverseMapping<T> = FirstTraverseMapping<T> | LaterTraverseMapping<T>;

export class TraversingIterable<T> extends Ninq<TraverseMapping<T>> {
	constructor(it: Iterable<T>) {
		super({
			*[Symbol.iterator](): Iterator<TraverseMapping<T>> {
				let previous: T | undefined,
					first = true,
					index = 0,
					iterator = it[Symbol.iterator](),
					current = iterator.next(),
					next = !current.done && iterator.next();
				try {
					for (; !current.done
						; current = next as any, next = iterator.next()) {

						try {
							const item = current.value;

							yield {
								current: item,
								index,
								first,
								previous,
								last: !next || next.done
							} as TraverseMapping<T>;

							first = false;
							previous = item;
						}
						catch (e) {
							if (iterator.throw) {
								current = next as any;
								next = iterator.throw(e);
							}
							else {
								throw e;
							}
						}
					}
				}
				finally {
					iterator && iterator.return && iterator.return();
				}
			}
		});
	}

}

declare module '../core/ninq' {
	namespace Ninq {
		/**
		 * Traverses consequencing element of an iterable
		 *
		 * @static
		 * @template T - The type of the elements of the input sequences
		 * @param {Loopable<T>} it - The iterable to traverse on
		 * @returns {Iterable<TraverseMapping<T>>} - An iterable that provides each two consequencing elements
		 *
		 * @memberOf Ninq
		 */
		export function traverse<T>(it: Loopable<T>): Ninq<TraverseMapping<T>>;
	}
	interface Ninq<T> {
		/**
		 * Traverses consequencing element of the iterable
		 *
		 * @returns {Ninq<TraverseMapping<T>>} - A Ninq iterable that provides each two consequencing elements
		 *
		 * @memberOf Ninq
		 */
		traverse(): Ninq<TraverseMapping<T>>;
	}
}

Object.assign(Ninq, {
	traverse<T>(it: Loopable<T>): Ninq<TraverseMapping<T>> {
		it = ArrayLikeIterable.toIterable(it);
		return new TraversingIterable(it);
	},
});
Object.assign(Ninq.prototype, {
	traverse<T>(this: Ninq<T>): Ninq<TraverseMapping<T>> {
		return Ninq.traverse(<Iterable<T>>this[iterable]);
	}
});
