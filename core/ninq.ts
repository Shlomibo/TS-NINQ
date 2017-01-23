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

	/**
	 * Creates an array from a Iterable<T>
	 *
	 * @static
	 * @template T - The type of the elements of it
	 * @param {Loopable<T>} it - An Iterable<T> to create an array from
	 * @returns {T[]} - An array that contains the elements from the input sequence
	 *
	 * @memberOf Ninq
	 */
	static toArray<T>(it: Loopable<T>): T[] {
		if (it instanceof Array) {
			return it;
		}
		const [...result] = ArrayLikeIterable.toIterable(it);
		return result;
	}

	/**
	 * Creates a Lookup<TKey,T> from an Iterable<T> according to a specified key selector function
	 *
	 * @static
	 * @template T - The type of the elements of it
	 * @template TKey - The type of the key returned by keySelector
	 * @param {Loopable<T>} it - The Iterable<T> to create a Lookup<TKey, T> from
	 * @param {KeySelector<T, TKey>} keySelector - A function to extract a key from each element
	 * @returns {Lookup<TKey, T>} - A Lookup<TKey, T> that contains keys and values
	 *
	 * @memberOf Ninq
	 */
	static toLookup<T, TKey>(it: Loopable<T>, keySelector: KeySelector<T, TKey>): Lookup<TKey, T>;
	/**
	 * Creates a Lookup<TKey, TValue> from an Iterable<T> according to specified key selector and element selector functions
	 *
	 * @static
	 * @template T - The type of the elements of it
	 * @template TKey - The type of the key returned by keySelector
	 * @template TValue
	 * @param {Loopable<T>} it - The Iterable<T> to create a Lookup<TKey, T> from
	 * @param {KeySelector<T, TKey>} keySelector - A function to extract a key from each element
	 * @param {KeySelector<T, TValue>} valueSelector - A transform function to produce a result element value from each element
	 * @returns {Lookup<TKey, TValue>} - A Lookup<TKey, TV> that contains keys and values
	 *
	 * @memberOf Ninq
	 */
	static toLookup<T, TKey, TValue>(
		it: Loopable<T>,
		keySelector: KeySelector<T, TKey>,
		valueSelector: KeySelector<T, TValue>
	): Lookup<TKey, TValue>;
	static toLookup<T, TKey>(
		it: Loopable<T>,
		keySelector: KeySelector<T, TKey>,
		vs?: KeySelector<T, any>
	): Lookup<TKey, any> {
		const valueSelector = vs || (x => x);
		const result = new Map<TKey, Iterable<any>>();

		it = ArrayLikeIterable.toIterable(it);
		for (const item of it) {
			const key = keySelector(item),
				value = valueSelector(item),
				list = result.get(key);
			if (!list) {
				result.set(key, [value]);
			}
			else {
				(list as any[]).push(value);
			}
		}
		return result;
	}

	/**
	 * Creates a Lookup<TKey,T> from an Iterable<T> according to a specified key selector function
	 *
	 * @template TKey - The type of the key returned by keySelector
	 * @param {KeySelector<T, TKey>} keySelector - A function to extract a key from each element
	 * @returns {NinqLookup<TKey, T>} - A NinqLookup<TKey, T> that contains keys and values
	 *
	 * @memberOf Ninq
	 */
	toLookup<TKey>(keySelector: KeySelector<T, TKey>): NinqLookup<TKey, T>;
	/**
	 * Creates a Lookup<TKey, TValue> from an Iterable<T> according to specified key selector and element selector functions
	 *
	 * @template TKey - The type of the key returned by keySelector
	 * @template TValue - The type of the value returned by valueSelector
	 * @param {KeySelector<T, TKey>} keySelector - A function to extract a key from each element
	 * @param {KeySelector<T, TValue>} valueSelector - A transform function to produce a result element value from each element
	 * @returns {NinqLookup<TKey, TValue>} - A NinqLookup<TKey, TValue> that contains keys and values
	 *
	 * @memberOf Ninq
	 */
	toLookup<TKey, TValue>(
		keySelector: KeySelector<T, TKey>,
		valueSelector: KeySelector<T, TValue>
	): NinqLookup<TKey, TValue>;
	toLookup<TKey>(
		keySelector: KeySelector<T, TKey>,
		vs?: KeySelector<T, any>
	): NinqLookup<TKey, any> {
		const result = Ninq.toLookup(this.iterable, keySelector, vs as any);
		for (const [key, value] of result.entries()) {
			result.set(key, new Ninq(value));
		}
		return result as any;
	}

	/**
	 * Creates a Hash<Iterable<T>> from an Iterable<T> according to a specified key selector function
	 *
	 * @static
	 * @template T - The type of the elements of it
	 * @param {Loopable<T>} it - The Iterable<T> to create a Hash<Iterable<T>> from
	 * @param {KeySelector<T, string>} keySelector - A function to extract a key from each element
	 * @returns {Hash<Iterable<T>>} - A Hash<Iterable<T>> that contains keys and values
	 *
	 * @memberOf Ninq
	 */
	static toLookupObject<T>(it: Loopable<T>, keySelector: KeySelector<T, string>): Hash<Iterable<T>>;
	/**
	 * Creates a Hash<Iterable<TValue>> from an Iterable<T> according to specified key selector and element selector functions
	 *
	 * @static
	 * @template T - The type of the elements of it
	 * @template TValue - The type of the value returned by valueSelector
	 * @param {Loopable<T>} it - The Iterable<T> to create a Hash<Iterable<T>> from
	 * @param {KeySelector<T, string>} keySelector - A function to extract a key from each element
	 * @param {KeySelector<T, TValue>} valueSelector - A transform function to produce a result element value from each element
	 * @returns {Hash<Iterable<TValue>>} - A Hash<Iterable<TValue>> that contains keys and values
	 *
	 * @memberOf Ninq
	 */
	static toLookupObject<T, TValue>(
		it: Loopable<T>,
		keySelector: KeySelector<T, string>,
		valueSelector: KeySelector<T, TValue>
	): Hash<Iterable<TValue>>;
	static toLookupObject<T>(
		it: Loopable<T>,
		keySelector: KeySelector<T, string>,
		vs?: KeySelector<T, any>
	): Hash<Iterable<any>> {
		const valueSelector = vs || (x => x);
		const result: Hash<Iterable<any>> = {};

		it = ArrayLikeIterable.toIterable(it);
		for (const item of it) {
			const key = keySelector(item),
				value = valueSelector(item),
				list = (result[key] as any[]) || [];
			list.push(value);
			result[key] = list;
		}
		return result;
	}

	/**
	 * Creates a Hash<Iterable<T>> from an Iterable<T> according to a specified key selector function
	 *
	 * @param {KeySelector<T, string>} keySelector - A function to extract a key from each element
	 * @returns {Hash<Iterable<T>>} - A Hash<Iterable<T>> that contains keys and values
	 *
	 * @memberOf Ninq
	 */
	toLookupObject(keySelector: KeySelector<T, string>): Hash<Iterable<T>>;
	/**
	 * Creates a Hash<Iterable<TValue>> from an Iterable<T> according to specified key selector and element selector functions
	 *
	 * @template TValue - The type of the value returned by valueSelector
	 * @param {KeySelector<T, string>} keySelector - A function to extract a key from each element
	 * @param {KeySelector<T, TValue>} valueSelector - A transform function to produce a result element value from each element
	 * @returns {Hash<Ninq<TValue>>} - A Hash<Ninq<TValue>> that contains keys and values
	 *
	 * @memberOf Ninq
	 */
	toLookupObject<TValue>(
		keySelector: KeySelector<T, string>,
		valueSelector: KeySelector<T, TValue>
	): Hash<Ninq<TValue>>;
	toLookupObject(
		keySelector: KeySelector<T, string>,
		vs?: KeySelector<T, any>
	): Hash<Ninq<any>> {
		const obj = Ninq.toLookupObject(this.iterable, keySelector, vs as any);
		Object.keys(obj)
			.forEach(key => obj[key] = new Ninq(obj[key]));
		return obj as any;
	}

	/**
	 * Creates a Map<TKey, T> from an Iterable<T> according to a specified key selector function
	 *
	 * @static
	 * @template T - The type of the elements of it
	 * @template TKey - The type of the key returned by keySelector
	 * @param {Loopable<T>} it - An Iterable<T> to create a Map<TKey, T> from
	 * @param {KeySelector<T, TKey>} keySelector - A function to extract a key from each element
	 * @returns {Map<TKey, T>} - A Map<TKey, T> that contains keys and values
	 *
	 * @memberOf Ninq
	 */
	static toMap<T, TKey>(it: Loopable<T>, keySelector: KeySelector<T, TKey>): Map<TKey, T>;
	/**
	 * Creates a Map<TKey, TValue> from an Iterable<T> according to specified key selector and element selector functions
	 *
	 * @static
	 * @template T - The type of the elements of it
	 * @template TKey - The type of the key returned by keySelector
	 * @template TValue - The type of the value returned by valueSelector
	 * @param {Loopable<T>} it - An Iterable<T> to create a Map<TKey, TValue> from
	 * @param {KeySelector<T, TKey>} keySelector - A function to extract a key from each element
	 * @param {KeySelector<T, TValue>} valueSelector - A transform function to produce a result element value from each element
	 * @returns {Map<TKey, TValue>} - A Map<TKey, TValue> that contains values of type TValue selected from the input sequence
	 *
	 * @memberOf Ninq
	 */
	static toMap<T, TKey, TValue>(
		it: Loopable<T>,
		keySelector: KeySelector<T, TKey>,
		valueSelector: KeySelector<T, TValue>
	): Map<TKey, TValue>;
	static toMap<T, TK>(
		it: Loopable<T>,
		keySelector: KeySelector<T, TK>,
		vs?: KeySelector<T, any>
	): Map<TK, any> {
		const valueSelector: KeySelector<T, any> = vs || (x => x);
		const result = new Map<TK, any>();

		it = ArrayLikeIterable.toIterable(it);
		for (const item of it) {
			const key = keySelector(item),
				value = valueSelector(item);
			result.set(key, value);
		}
		return result;
	}

	/**
	 * Creates a Map<TKey, T> from an Iterable<T> according to a specified key selector function
	 *
	 * @template TKey - The type of the key returned by keySelector
	 * @param {KeySelector<T, TKey>} keySelector - A function to extract a key from each element
	 * @returns {Map<TKey, T>} - A Map<TKey, T> that contains keys and values
	 *
	 * @memberOf Ninq
	 */
	toMap<TKey>(keySelector: KeySelector<T, TKey>): Map<TKey, T>;
	/**
	 * Creates a Map<TKey, TValue> from an Iterable<T> according to specified key selector and element selector functions
	 *
	 * @template TKey - The type of the key returned by keySelector
	 * @template TValue - The type of the value returned by valueSelector
	 * @param {KeySelector<T, TKey>} keySelector - A function to extract a key from each element
	 * @param {KeySelector<T, TValue>} valueSelector - A transform function to produce a result element value from each element
	 * @returns {Map<TKey, TValue>} - A Map<TKey, TValue> that contains values of type TValue selected from the input sequence
	 *
	 * @memberOf Ninq
	 */
	toMap<TKey, TValue>(
		keySelector: KeySelector<T, TKey>,
		valueSelector: KeySelector<T, TValue>
	): Map<TKey, TValue>;
	toMap<TK>(
		keySelector: KeySelector<T, TK>,
		vs?: KeySelector<T, any>
	): Ninq<any> & Map<TK, any> {
		const map = Ninq.toMap(this.iterable, keySelector, vs as any);
		return adaptTo(new Ninq(map), map);
	}

	/**
	 * Creates a Hash<T> from an Iterable<T>
	 *
	 * @static
	 * @template T - The type of the elements of it
	 * @param {Loopable<T>} it - An Iterable<T> to create a Hash<T> from
	 * @param {KeySelector<T, string>} keySelector - A function to extract a key from each element
	 * @returns {Hash<T>} - A Hash<T> that contains keys and values
	 *
	 * @memberOf Ninq
	 */
	static toObject<T>(it: Loopable<T>, keySelector: KeySelector<T, string>): Hash<T>;
	/**
	 * Creates a Hash<TValue> from an Iterable<T> according to specified element selector function
	 *
	 * @static
	 * @template T - The type of the elements of it
	 * @template TValue - The type of the value returned by valueSelector
	 * @param {Loopable<T>} it - An Iterable<T> to create a Hash<TValue> from
	 * @param {KeySelector<T, string>} keySelector - A function to extract a key from each element
	 * @param {KeySelector<T, TValue>} valueSelector - A transform function to produce a result element value from each element
	 * @returns {Hash<TValue>} - A Hash<TValue> that contains values of type TValue selected from the input sequence
	 *
	 * @memberOf Ninq
	 */
	static toObject<T, TValue>(
		it: Loopable<T>,
		keySelector: KeySelector<T, string>,
		valueSelector: KeySelector<T, TValue>
	): Hash<TValue>;
	static toObject<T>(
		it: Loopable<T>,
		keySelector: KeySelector<T, string>,
		vs?: KeySelector<T, any>
	): Hash<any> {
		const valueSelector: KeySelector<T, any> = vs || (x => x);
		const result: Hash<any> = {};

		it = ArrayLikeIterable.toIterable(it);
		for (const item of it) {
			const key = keySelector(item),
				value = valueSelector(item);
			result[key] = value;
		}
		return result;
	}

	/**
	 * Creates a Hash<T> from an Iterable<T>
	 *
	 * @param {KeySelector<T, string>} keySelector - A function to extract a key from each element
	 * @returns {Hash<T>} - A Hash<T> that contains keys and values
	 *
	 * @memberOf Ninq
	 */
	toObject(keySelector: KeySelector<T, string>): Hash<T>;
	/**
	 * Creates a Hash<TValue> from an Iterable<T> according to specified element selector function
	 *
	 * @template TValue - The type of the value returned by valueSelector
	 * @param {KeySelector<T, string>} keySelector - A function to extract a key from each element
	 * @param {KeySelector<T, TValue>} valueSelector - A transform function to produce a result element value from each element
	 * @returns {Hash<TValue>} - A Hash<TValue> that contains values of type TValue selected from the input sequence
	 *
	 * @memberOf Ninq
	 */
	toObject<TValue>(
		keySelector: KeySelector<T, string>,
		valueSelector: KeySelector<T, TValue>
	): Hash<TValue>;
	toObject(
		keySelector: KeySelector<T, string>,
		vs?: KeySelector<T, any>
	): Hash<any> {
		return Ninq.toObject(this.iterable, keySelector, vs as any);
	}

	/**
	 * Creates an array from a Iterable<T>
	 *
	 * @returns {T[]} - An array that contains the elements from the input sequence
	 *
	 * @memberOf Ninq
	 */
	toArray(): T[] {
		return Ninq.toArray(this.iterable);
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
