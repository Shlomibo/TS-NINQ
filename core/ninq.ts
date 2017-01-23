import ConcatIterable from './operators/concat';
import {
	KeySelector,
	Predicate,
	EqualityComparer,
	ReductionFunc,
	Comparer,
	Comparable,
	ComparisonFunc,
	Mapping,
	Hash,
	Lookup,
	NinqLookup,
	Loopable,
	Action3,
	Action,
	NotNull,
	IndexedHash,
} from './declarations';
import DistinctIterable from './operators/distinct';
import ExceptIterable from './operators/except';
import FilterIterable from './operators/filter';
import { Grouping } from './operators/group-by';
import GroupingIterable from './operators/group-by';
import { GroupJoinEntry } from './operators/group-join';
import GroupJoinIterable from './operators/group-join';
import IntersectionIterator from './operators/intersect';
import { JoinMatch } from './operators/join';
import JoinIterable from './operators/join';
import { SortedIterable, SortingIterable, isSortedIterable } from './operators/sortBy';
import { ReverseIterable } from './operators/reverse';
import { MappingIterable, MapManyIterable } from './operators/map';
import { ZipIterable } from './operators/zip';
import { SkippingIterable } from './operators/skip';
import { TakeWhileIterable } from './operators/take';
import { UnionIterable } from './operators/union';
import { adaptTo } from './modules/object-adapter';
import ArrayLikeIterable from './modules/array-like-iterable';
import { isIterable, isArrayLike, ReverseArrayLikeIterable } from './modules/array-like-iterable';
import * as funcs from './funcs';
import { TraverseMapping, FirstTraverseMapping, LaterTraverseMapping } from './operators/traverse';
import TraversingIterable from './operators/traverse';
import { Entry, ObjectIterationOptions } from './operators/object';
import ObjectIterable from './operators/object';
import symbols from './symbols';
import { isLoopable } from './array-like-iterable';

const {
	iterable,
} = symbols;


/**
 * Provides functionality around iterables.
 *
 * @export
 * @class Ninq
 * @implements {Iterable<T>}
 * @template T
 */
export class Ninq<T> implements Iterable<T> {
	constructor(it: Loopable<T>) {
		if (!isLoopable(it)) {
			throw new TypeError('Not an iterable');
		}
		this[iterable] = it;
	}

	*[Symbol.iterator]() {
		const it = ArrayLikeIterable.toIterable(this[iterable]);
		yield* it;
	}

	/**
	 * Returns a comparing function for comparing a selected key by the specified comparer.
	 *
	 * @static
	 * @template T - The element's type
	 * @template TKey - The selected key's type
	 * @template TResult - The comparison result
	 * @param {Mapping<T, TKey>} keySelector - A mapping between an element to a ket for comparison
	 * @param {ComparisonFunc<TKey, TResult>} comparer - A comparing function to compare keys
	 * @returns {ComparisonFunc<T, TResult>} - A comparing function to compare an element by the selected key
	 *
	 * @memberOf Ninq
	 */
	static byKey<T, TKey, TResult>(
		keySelector: KeySelector<T, TKey>,
		comparer: ComparisonFunc<TKey, TResult>
	): ComparisonFunc<T, TResult> {

		return (x, y) => {
			const xKey = keySelector(x),
				yKey = keySelector(y);
			return comparer(xKey, yKey);
		};
	}

	/**
	 * Casts the elements of a sequence to the specified type
	 *
	 * @template TResult - The type to cast the elements of source to
	 * @returns - A Ninq wrpper that contains each element of the source sequence cast to the specified type
	 *
	 * @memberOf Ninq
	 */
	cast<TResult>() {
		return (this as any) as Ninq<TResult>;
	}

	static cast<T, TResult>(it: Iterable<T>): Iterable<TResult>;
	static cast<T, TResult>(it: ArrayLike<T>): ArrayLike<TResult>;
	static cast<T, TResult>(it: Loopable<T>): Loopable<TResult> {
		return it as any;
	}

	/**
	 * Returns an empty sequence that has the specified type argument
	 *
	 * @static
	 * @template T - Itrable's elements' type
	 * @returns {Iterable<T>} An empty Iterable<T> whose type argument is T
	 *
	 * @memberOf Ninq
	 */
	static empty<T>(): Ninq<T> {
		return new Ninq({
			*[Symbol.iterator]() {
				;
			}
		});
	}

	static forEach<T>(it: Loopable<T>, action: Action3<T, number, Action>): void {
		let i = 0,
			cancelled = false,
			cancel = () => cancelled = true;

		for (let item of ArrayLikeIterable.toIterable(it)) {
			action(item, i++, cancel);

			if (cancelled) {
				break;
			}
		}
	}

	forEach(action: Action3<T, number, Action>): void {
		Ninq.forEach(this[iterable], action);
	}

	get length(): number | undefined {
		if (!isArrayLike(this[iterable])) {
			return undefined;
		}
		return this[iterable].length;
	}
}
export namespace Ninq {
	export const {
		identity,
		fromCallback,
	} = funcs;
}

export function isNinq<T>(obj: any): obj is Ninq<T> {
	return !!obj && !!obj[iterable] &&
		typeof obj[iterable][Symbol.iterator] === 'function';
}

export {
	isIterable,
	isArrayLike,
	ArrayLikeIterable,
	ReverseArrayLikeIterable,
	NotNull,
	TraverseMapping,
	FirstTraverseMapping,
	LaterTraverseMapping,
	Hash,
	IndexedHash,
};

export type Ninqed<T, U> = Ninq<T> & U;

export function extendToNinq<T, U>(obj: U): Ninqed<T, U> {
	obj = Object(obj);
	Object.getOwnPropertyNames(Ninq.prototype)
		.map(key => [key, Object.getOwnPropertyDescriptor(Ninq.prototype, key)])
		.forEach(([key, prop]: [string, PropertyDescriptor]) =>
			void Object.defineProperty(obj, key, prop)
		);

	obj[iterable] = obj;

	return obj as any;
}
