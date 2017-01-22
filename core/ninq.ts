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
	 * Computes the average of a sequence of number values that are obtained by invoking
	 * a transform function on each element of the input sequence
	 *
	 * @static
	 * @template T - Itrable's elements' type
	 * @param {(Iterable<T> | ArrayLike<T>)} it - Iterable to calculate avg for
	 * @param {KeySelector<T, number>} selector - A transform function to apply to each element
	 * @returns {(number | undefined)}
	 *
	 * @memberOf Ninq
	 */
	static average<T>(it: Loopable<T>, selector: KeySelector<T, number>)
		: number | undefined {

		it = ArrayLikeIterable.toIterable(it);
		return Ninq.reduce<T, number>(
			it,
			(prev, item, index) => {
				const num = selector(item);
				if (index === 0) {
					return num;
				}
				else {
					prev *= index;
					return (num + prev) / (index + 1);
				}
			}
		);
	}
	/**
	 * Computes the average of a sequence of number values that are obtained by invoking
	 * a transform function on each element of the input sequence
	 *
	 * @param {Selector<T, number>} selector - A transform function to apply to each element
	 * @returns The average of the sequence of values
	 *
	 * @memberOf Ninq
	 */
	average(selector: KeySelector<T, number>) {
		return Ninq.average(this[iterable], selector);
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
	 * Returns the number of elements in a sequence
	 *
	 * @static
	 * @template T - Itrable's elements' type
	 * @param {Loopable<T>} it - Iterable to calculate avg for
	 * @returns {number} - The number of elements in the input sequence
	 *
	 * @memberOf Ninq
	 */
	static count<T>(it: Loopable<T>): number;
	/**
	 * Returns a number that represents how many elements in the specified sequence satisfy a condition
	 *
	 * @static
	 * @template T - Itrable's elements' type
	 * @param {Loopable<T>} it - Iterable to calculate avg for
	 * @param {Predicate<T>} predicate - A function to test each element for a condition
	 * @returns {number} - A number that represents how many elements in the sequence satisfy the condition in the predicate function
	 *
	 * @memberOf Ninq
	 */
	static count<T>(it: Loopable<T>, predicate: Predicate<T>): number;
	static count<T>(it: Loopable<T>, predicate?: Predicate<T>) {
		let result = 0,
			index = 0;
		if (isArrayLike(it)) {
			if (!predicate) {
				return it.length;
			}
			it = ArrayLikeIterable.toIterable(it);
		}
		predicate = predicate || (x => true);
		for (let item of it) {
			if (predicate(item, index)) {
				result++;
			}
			index++;
		}
		return result;
	}
	/**
	 * Returns a number that represents how many elements in the specified sequence satisfy a condition
	 *
	 * @returns {number} - The number of elements in the input sequence
	 *
	 * @memberOf Ninq
	 */
	count(): number;
	/**
	 * Returns a number that represents how many elements in the specified sequence satisfy a condition
	 *
	 * @param {Predicate<T>} predicate - A function to test each element for a condition
	 * @returns {number} - A number that represents how many elements in the sequence satisfy the condition in the predicate function
	 *
	 * @memberOf Ninq
	 */
	count(predicate: Predicate<T>): number;
	count(predicate?: Predicate<T>) {
		return typeof predicate === 'function'
			? Ninq.count(this.iterable, predicate)
			: Ninq.count(this.iterable);
	}

	private static $default<T>(x: T | undefined, defVal: T) {
		return x === undefined
			? defVal
			: x;
	}

	/**
	 * Returns the elements of the specified sequence or the specified value in a singleton collection if the sequence is empty
	 *
	 * @static
	 * @template T - Itrable's elements' type
	 * @param {Loopable<T>} it - Iterable to calculate avg for
	 * @param {T} defValue - The value to return if the sequence is empty
	 * @returns A sequence that contains defaultValue if source is empty; otherwise, source
	 *
	 * @memberOf Ninq
	 */
	static defaultIfEmpty<T>(it: Loopable<T>, defValue: T): Iterable<T> {
		return Ninq.some(it)
			? ArrayLikeIterable.toIterable(it)
			: [defValue];
	}
	/**
	 * Returns the elements of the specified sequence or the specified value in a singleton collection if the sequence is empty
	 *
	 * @param {T} defValue - The value to return if the sequence is empty
	 * @returns A sequence that contains defaultValue if source is empty; otherwise, source
	 *
	 * @memberOf Ninq
	 */
	defaultIfEmpty(defValue: T) {
		return this.some()
			? this
			: new Ninq(Ninq.defaultIfEmpty(this.iterable, defValue));
	}

	/**
	 * Returns the element at a specified index in a sequence or undefined
	 *
	 * @static
	 * @template T - Itrable's elements' type
	 * @param {Loopable<T>} it - Iterable to calculate avg for
	 * @param {number} index The zero-based index of the element to retrieve
	 * @returns undefined if the index is outside the bounds of the source sequence;
	 * 	otherwise, the element at the specified position in the source sequence
	 *
	 * @memberOf Ninq
	 */
	static elementAtOrDefault<T>(it: Loopable<T>, index: number): T | undefined;
	/**
	 * Returns the element at a specified index in a sequence or a default value if the index is out of range
	 *
	 * @static
	 * @template T - Itrable's elements' type
	 * @template U - Default value's type
	 * @param {Loopable<T>} it - Iterable to calculate avg for
	 * @param {number} index The zero-based index of the element to retrieve
	 * @param {T} defValue The value to return if index is out of range
	 * @returns default(TSource) if the index is outside the bounds of the source sequence;
	 * 	otherwise, the element at the specified position in the source sequence
	 *
	 * @memberOf Ninq
	 */
	static elementAtOrDefault<T, U>(it: Loopable<T>, index: number, defValue: U): T | U;
	static elementAtOrDefault<T, U>(it: Loopable<T>, index: number, defValue?: U): T | U | undefined {
		let i = 0;
		if (isArrayLike(it)) {
			return it.length <= index
				? defValue
				: it[index];
		}

		for (let item of it) {
			if (i++ === index) {
				return item;
			}
		}
		return defValue;
	}
	/**
	 * Returns the element at a specified index in a sequence
	 *
	 * @static
	 * @template T - Itrable's elements' type
	 * @param {Loopable<T>} it - Iterable to calculate avg for
	 * @param {number} index The zero-based index of the element to retrieve
	 * @returns The element at the specified position in the source sequence
	 *
	 * @memberOf Ninq
	 */
	static elementAt<T>(it: Loopable<T>, index: number) {
		const result = Ninq.elementAtOrDefault(it, index, '\0___ERR___\0');
		if (result === '\0___ERR___\0') {
			throw new Error('Could not find element');
		}
		return result;
	}

	/**
	 * Returns the element at a specified index in a sequence or undefined if the index is out of range
	 *
	 * @param {number} index The zero-based index of the element to retrieve
	 * @returns undefindef if the index is outside the bounds of the source sequence;
	 * 	otherwise, the element at the specified position in the source sequence
	 *
	 * @memberOf Ninq
	 */
	elementAtOrDefault(index: number): T | undefined;
	/**
	 * Returns the element at a specified index in a sequence or a default value if the index is out of range
	 *
	 *
	 * @template U - Default value's type
	 * @param {number} index The zero-based index of the element to retrieve
	 * @param {U} defValue The value to return if index is out of range
	 * @returns default(TSource) if the index is outside the bounds of the source sequence;
	 * 	otherwise, the element at the specified position in the source sequence
	 *
	 * @memberOf Ninq
	 */
	elementAtOrDefault<U>(index: number, defValue: U): T | U;
	elementAtOrDefault<U>(index: number, defValue?: U): T | U | undefined {
		return Ninq.elementAtOrDefault(this.iterable, index, defValue);
	}
	/**
	 * Returns the element at a specified index in a sequence
	 *
	 * @param {number} index The zero-based index of the element to retrieve
	 * @returns The element at the specified position in the source sequence
	 *
	 * @memberOf Ninq
	 */
	elementAt(index: number) {
		return Ninq.elementAt(this.iterable, index);
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
	static *empty<T>(): Iterable<T> {
		;
	}

	/**
	 * Returns the first element of a sequence, or undefined if the sequence contains no elements.
	 *
	 *
	 * @static
	 * @template T - Itrable's elements' type
	 * @param {Loopable<T>} it - Iterable to calculate avg for
	 * @param {Predicate<T>} [predicate] - A function to test each element for a condition
	 * @returns undefined if source is empty; otherwise, the first element in source
	 *
	 * @memberOf Ninq
	 */
	static firstOrDefault<T>(it: Loopable<T>, predicate?: Predicate<T>): T | undefined;
	/**
	 * Returns the first element of a sequence, or a default value if the sequence contains no elements.
	 *
	 * @static
	 * @template T - Itrable's elements' type
	 * @template U - Default value's type
	 * @param {Loopable<T>} it - Iterable to calculate avg for
	 * @param {T} defValue
	 * @param {Predicate<T>} [predicate] - A function to test each element for a condition
	 * @returns defValue if source is empty; otherwise, the first element in source
	 *
	 * @memberOf Ninq
	 */
	static firstOrDefault<T, U>(it: Loopable<T>, defValue: U, predicate?: Predicate<T>): T | U;
	static firstOrDefault<T, U>(
		it: Loopable<T>,
		defValueOrPredicate?: U | Predicate<T>,
		predicate?: Predicate<T>
	): T | U | undefined {
		let defValue: any;
		if ((typeof defValueOrPredicate === 'function') && !predicate) {
			predicate = defValueOrPredicate;
		}
		else {
			defValue = defValueOrPredicate;
		}

		if (typeof predicate === 'function') {
			return Ninq.firstOrDefault(Ninq.filter(it, predicate), defValue);
		}
		return Ninq.elementAtOrDefault(it, 0, defValue);
	}
	/**
	 * Returns the first element in a sequence that satisfies a specified condition
	 *
	 * @static
	 * @template T - Itrable's elements' type
	 * @param {Loopable<T>} it - Iterable to calculate avg for
	 * @param {Predicate<T>} [predicate] - A function to test each element for a condition
	 * @returns The first element in the sequence that passes the test in the specified predicate function
	 *
	 * @memberOf Ninq
	 */
	static first<T>(it: Loopable<T>, predicate?: Predicate<T>) {
		const result = Ninq.firstOrDefault(it, '\0__ERR__\0', predicate);
		if (result === '\0__ERR__\0') {
			throw new RangeError('Iterable is emprty');
		}
		return result;
	}

	/**
	 * Returns the first element of a sequence, or undefined if the sequence contains no elements.
	 *
	 * @param {Predicate<T>} [predicate] - A function to test each element for a condition
	 * @returns undefined if source is empty; otherwise, the first element in source
	 *
	 * @memberOf Ninq
	 */
	firstOrDefault(predicate?: Predicate<T>): T | undefined;
	/**
	 * Returns the first element of a sequence, or a default value if the sequence contains no elements.
	 *
	 * @template U - Default value's type
	 * @param {U} defValue
	 * @param {Predicate<T>} [predicate] - A function to test each element for a condition
	 * @returns defValue if source is empty; otherwise, the first element in source
	 *
	 * @memberOf Ninq
	 */
	firstOrDefault<U>(defValue: U, predicate?: Predicate<T>): T | U;
	firstOrDefault<U>(defValueOrPredicate?: U | Predicate<T>, predicate?: Predicate<T>): T | U {
		return Ninq.firstOrDefault(this.iterable, defValueOrPredicate as any, predicate);
	}
	/**
	 * Returns the first element in a sequence that satisfies a specified condition
	 *
	 * @param {Predicate<T>} [predicate] - A function to test each element for a condition
	 * @returns The first element in the sequence that passes the test in the specified predicate function
	 *
	 * @memberOf Ninq
	 */
	first(predicate?: Predicate<T>) {
		return Ninq.first(this.iterable, predicate);
	}

	forEach(action: Action3<T, number, Action>): void {
		Ninq.forEach(this.iterable, action);
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

	/**
	 * Determines whether all elements of a sequence satisfy a condition
	 *
	 * @static
	 * @template T - Itrable's elements' type
	 * @param {Loopable<T>} it - Iterable to calculate avg for
	 * @param {Predicate<T>} predicate - A function to test each element for a condition
	 * @returns true if every element of the source sequence passes the test in the specified predicate,
	 * or if the sequence is empty; otherwise, false
	 *
	 * @memberOf Ninq
	 */
	static every<T>(
		it: Loopable<T>,
		predicate: Predicate<T>
	) {
		let result = true;
		let i = 0;
		it = ArrayLikeIterable.toIterable(it);
		for (let item of it) {
			result = predicate(item, i);
			if (!result) {
				break;
			}
			i++;
		}
		return result;
	}
	/**
	 * Determines whether all elements of a sequence satisfy a condition
	 *
	 * @param {Predicate<T>} predicate - A function to test each element for a condition
	 * @returns true if every element of the source sequence passes the test in the specified predicate,
	 * or if the sequence is empty; otherwise, false
	 *
	 * @memberOf Ninq
	 */
	every(predicate: Predicate<T>) {
		return Ninq.every(this.iterable, predicate);
	}

	/**
	 * Determines whether a sequence contains a specified element
	 *
	 * @static
	 * @template T - Itrable's elements' type
	 * @param {Loopable<T>} it - Iterable to calculate avg for
	 * @param {T} item - The value to locate in the sequence
	 * @param {EqualityComparer<T>} [comparer] - An optional equality comparer to compare values
	 * @returns true if the source sequence contains an element that has the specified value; otherwise, false
	 *
	 * @memberOf Ninq
	 */
	static includes<T>(it: Loopable<T>, item: T, comparer?: EqualityComparer<T>) {
		it = ArrayLikeIterable.toIterable(it);
		comparer = comparer || ((x, y) => x === y);
		for (let element of it) {
			if (comparer(item, element)) {
				return true;
			}
		}
		return false;
	}

	/**
	 * Determines whether the sequence contains a specified element
	 *
	 * @param {T} item - The value to locate in the sequence
	 * @param {EqualityComparer<T>} [comparer] - An optional equality comparer to compare values
	 * @returns true if the source sequence contains an element that has the specified value; otherwise, false
	 *
	 * @memberOf Ninq
	 */
	includes(item: T, comparer?: EqualityComparer<T>) {
		return Ninq.includes(this.iterable, item, comparer);
	}

	/**
	 * Returns the last element of a sequence that satisfies a condition or undefined if no such element is found
	 *
	 * @static
	 * @template T - The type of the elements of it
	 * @param {Loopable<T>} it - An Iterable<T> to return the last element of
	 * @param {Predicate<T>} [predicate] - A function to test each element for a condition
	 * @returns - undefined if the sequence is empty or if no elements pass the test in the predicate function;
	 * 	otherwise, the last element that passes the test in the predicate function
	 *
	 * @memberOf Ninq
	 */
	static lastOrDefault<T>(it: Loopable<T>, predicate?: Predicate<T>): T | undefined;
	/**
	 * Returns the last element of a sequence that satisfies a condition or a default value if no such element is found
	 *
	 * @static
	 * @template T - The type of the elements of it
	 * @template U - Default value's type
	 * @param {Loopable<T>} it - An Iterable<T> to return the last element of
	 * @param {T} defValue - Default value to return in case no element satisfies the predicate
	 * @param {Predicate<T>} [predicate] - A function to test each element for a condition
	 * @returns - defValue if the sequence is empty or if no elements pass the test in the predicate function;
	 * 	otherwise, the last element that passes the test in the predicate function
	 *
	 * @memberOf Ninq
	 */
	static lastOrDefault<T, U>(it: Loopable<T>, defValue: U, predicate?: Predicate<T>): T | U;
	static lastOrDefault<T, U>(
		it: Loopable<T>,
		defValueOrPredicate?: U | Predicate<T>,
		predicate?: Predicate<T>
	): T | U | undefined {
		let defValue: any;
		if ((typeof defValueOrPredicate === 'function') && !predicate) {
			predicate = defValueOrPredicate;
		}
		else {
			defValue = defValueOrPredicate;
		}
		if (isArrayLike(it)) {
			if (!predicate) {
				return it.length > 0
					? it[it.length - 1]
					: defValue;
			}
			it = ArrayLikeIterable.toIterable(it);
		}

		if (predicate) {
			it = Ninq.filter(it, predicate);
		}
		let result: T | U = defValue;
		for (result of it) {
			;
		}
		return result;
	}

	lastOrDefault(predicate?: Predicate<T>): T | undefined;
	/**
	 * Returns the last element of a sequence that satisfies a condition or a default value if no such element is found
	 *
	 * @param {T} defValue - Default value to return in case no element satisfies the predicate
	 * @param {Predicate<T>} [predicate] - A function to test each element for a condition
	 * @returns {T} - defValue if the sequence is empty or if no elements pass the test in the predicate function;
	 * 	otherwise, the last element that passes the test in the predicate function
	 *
	 * @memberOf Ninq
	 */
	lastOrDefault<U>(defValue: U, predicate?: Predicate<T>): T | U;
	lastOrDefault<U>(defValueOrPredicate?: U | Predicate<T>, predicate?: Predicate<T>): T | U | undefined {
		return Ninq.lastOrDefault(this.iterable, defValueOrPredicate as any, predicate);
	}

	/**
	 * Returns the last element of a sequence
	 *
	 * @static
	 * @template T - The type of the elements of it
	 * @param {Loopable<T>} it - An Iterable<T> to return the last element of
	 * @returns {T} - The value at the last position in the source sequence
	 *
	 * @memberOf Ninq
	 */
	static last<T>(it: Loopable<T>): T;
	/**
	 * Returns the last element of a sequence that satisfies a specified condition
	 *
	 * @static
	 * @template T - The type of the elements of it
	 * @param {Loopable<T>} it - An Iterable<T> to return the last element of
	 * @param {Predicate<T>} predicate - A function to test each element for a condition
	 * @returns {T} - The last element in the sequence that passes the test in the specified predicate function
	 *
	 * @memberOf Ninq
	 */
	static last<T>(it: Loopable<T>, predicate: Predicate<T>): T;
	static last<T>(it: Loopable<T>, predicate?: Predicate<T>) {
		const result = Ninq.lastOrDefault(it, '\0__ERROR__\0', predicate as any);
		if (result === '\0__ERROR__\0') {
			throw new Error('No values returned from iterable');
		}
		return result;
	}

	/**
	 * Returns the last element of a sequence
	 *
	 * @returns {T} - The value at the last position in the source sequence
	 *
	 * @memberOf Ninq
	 */
	last(): T;
	/**
	 * Returns the last element of a sequence that satisfies a specified condition
	 *
	 * @param {Predicate<T>} predicate - A function to test each element for a condition
	 * @returns {T} - The last element in the sequence that passes the test in the specified predicate function
	 *
	 * @memberOf Ninq
	 */
	last(predicate: Predicate<T>): T;
	last(predicate?: Predicate<T>) {
		return predicate
			? Ninq.last(this.iterable, predicate)
			: Ninq.last(this.iterable);
	}

	get length(): number | undefined {
		if (!isArrayLike(this.iterable)) {
			return undefined;
		}
		return this.iterable.length;
	}

	/**
	 * Returns the maximum value in a sequence
	 *
	 * @static
	 * @param {Iterable<number>} it - A sequence of values to determine the maximum value of
	 * @returns {(number | undefined)} - The maximum value in the sequence or undefined
	 *
	 * @memberOf Ninq
	 */
	static max(it: Loopable<number>): number | undefined;
	/**
	 * Invokes a transform function on each element of a sequence and returns the maximum value
	 *
	 * @static
	 * @template T - The type of the elements of it
	 * @param {Loopable<T>} it - A sequence of values to determine the maximum value of
	 * @param {Mapping<T, number>} valSelector - A transform function to apply to each element
	 * @returns {(number | undefined)} - The maximum value in the sequence or undefined
	 *
	 * @memberOf Ninq
	 */
	static max<T>(it: Loopable<T>, valSelector: KeySelector<T, number>): number | undefined;
	static max<T>(it: Loopable<T>, valSelector?: KeySelector<T, number>) {
		it = ArrayLikeIterable.toIterable(it);
		const selector = valSelector || (x => x as any as number);
		return Ninq.reduce(it, (max: number | undefined, current: T) =>
			Math.max(Ninq.$default(max, -Infinity), selector(current))
		);
	}

	/**
	 * Returns the maximum value
	 *
	 * @returns {(number | undefined)} - The maximum value in the sequence or undefined
	 *
	 * @memberOf Ninq
	 */
	max(): number | undefined;
	/**
	 * Invokes a transform function on each element of the sequence and returns the maximum value
	 *
	 * @param {Mapping<T, number>} valSelector - A transform function to apply to each element
	 * @returns {(number | undefined)} - The maximum value in the sequence or undefined
	 *
	 * @memberOf Ninq
	 */
	max(valSelector: KeySelector<T, number>): number | undefined;
	max(valSelector?: KeySelector<T, number>) {
		return valSelector
			? Ninq.max(this.iterable, valSelector)
			: Ninq.max(this.iterable as any);
	}

	/**
	 * Returns the minimum value in a sequence
	 *
	 * @static
	 * @param {Loopable<number>} it - A sequence of values to determine the minimum value of
	 * @returns {(number | undefined)} - The minimum value in the sequence
	 *
	 * @memberOf Ninq
	 */
	static min(it: Loopable<number>): number | undefined;
	/**
	 * Invokes a transform function on each element of a sequence and returns the minimum value
	 *
	 * @static
	 * @template T - The type of the elements of it
	 * @param {Loopable<T>} it - A sequence of values to determine the minimum value of
	 * @param {Mapping<T, number>} valSelector - A transform function to apply to each element
	 * @returns {(number | undefined)} - The minimum value in the sequence
	 *
	 * @memberOf Ninq
	 */
	static min<T>(it: Loopable<T>, valSelector: KeySelector<T, number>): number | undefined;
	static min<T>(it: Loopable<T>, valSelector?: KeySelector<T, number>) {
		const selector = valSelector || (x => x as any as number);
		return Ninq.reduce(it, (min: number | undefined, current: T) =>
			Math.min(Ninq.$default(min, Infinity), selector(current))
		);
	}

	/**
	 * Returns the minimum value
	 *
	 * @returns {(number | undefined)} - The minimum value in the sequence
	 *
	 * @memberOf Ninq
	 */
	min(): number | undefined;
	/**
	 * Invokes a transform function on each element of a sequence and returns the minimum value
	 *
	 * @param {Mapping<T, number>} valSelector - A transform function to apply to each element
	 * @returns {(number | undefined)} - The minimum value in the sequence
	 *
	 * @memberOf Ninq
	 */
	min(valSelector: KeySelector<T, number>): number | undefined;
	min(valSelector?: KeySelector<T, number>) {
		return valSelector
			? Ninq.min(this.iterable, valSelector)
			: Ninq.min(this.iterable as any);
	}

	/**
	 * Generates a sequence of integral numbers within a specified range
	 *
	 * @static
	 * @param {number} count - The number of sequential integers to generate
	 * @param {number} [start=0] - The value of the first integer in the sequence
	 * @param {number} [step=1] - The step between each iteration result.
	 * @returns {Iterable<number>} - An Iterable<number> that contains a range of sequential integral numbers
	 *
	 * @memberOf Ninq
	 */
	static * range(count: number, start = 0, step = 1) {

		for (let i = start; shouldIterate(i); i += step) {
			yield i;
		}

		function shouldIterate(i: number) {
			return step < 0
				? i > start - count
				: i < start + count;
		}
	}

	/**
	 * Generates a sequence that contains one repeated value
	 *
	 * @static
	 * @template T - The type of the value to be repeated in the result sequence
	 * @param {T} element - The value to be repeated
	 * @param {number} count - The number of times to repeat the value in the generated sequence
	 * @returns {Ninq<T>} - An Iterable<T> that contains a repeated value
	 *
	 * @memberOf Ninq
	 */
	static repeat<T>(element: T, count: number): Ninq<T> {
		if (count < 0) {
			throw new Error('count must be greater or equal to zero');
		}

		return new Ninq(generator());
		function* generator() {
			for (let i = 0; i < count; i++) {
				yield element;
			}
		}
	}

	/**
	 * Applies an accumulator function over a sequence
	 *
	 * @static
	 * @template T - Iterable type
	 * @template TResult - The type of the accumulator value
	 * @param  {Loopable<T>} - Iterable to reduce
	 * @param {ReductionFunc<T, TResult>} reduction - An accumulator function to be invoked on each element.
	 * @returns {(TResult | undefined)} The final accumulator value
	 *
	 * @memberOf Ninq
	 */
	static reduce<T, TResult>(
		it: Loopable<T>,
		reduction: ReductionFunc<T, TResult>
	): TResult | undefined;
	/**
	 * Applies an accumulator function over a sequence.
	 * The specified seed value is used as the initial accumulator value
	 *
	 * @static
	 * @template T - Iterable type
	 * @template TResult - The type of the accumulator value
	 * @param  {Loopable<T>} - Iterable to reduce
	 * @param {TResult} seed - The initial accumulator value
	 * @param {ReductionFunc<T, TResult>} reduction - An accumulator function to be invoked on each element
	 * @returns {TResult} - The final accumulator value
	 *
	 * @memberOf Ninq
	 */
	static reduce<T, TResult>(
		it: Loopable<T>,
		seed: TResult,
		reduction: ReductionFunc<T, TResult>
	): TResult;
	static reduce<T, TResult>(
		it: Loopable<T>,
		seedOrReduc: TResult | ReductionFunc<T, TResult>,
		reduc?: ReductionFunc<T, TResult>
	): TResult | undefined {
		const reduction = typeof reduc === 'function'
			? reduc
			: seedOrReduc as ReductionFunc<T, TResult>;
		let result = typeof reduc === 'function'
			? seedOrReduc as TResult
			: undefined;
		let i = 0;
		it = ArrayLikeIterable.toIterable(it);
		for (let item of it) {
			result = reduction(result, item, i);
			i++;
		}
		return result;
	}
	/**
	 * Applies an accumulator function over a sequence
	 *
	 * @template TResult - The type of the accumulator value
	 * @param {ReductionFunc<T, TResult>} reduction - An accumulator function to be invoked on each element.
	 * @returns {(TResult | undefined)} The final accumulator value
	 *
	 * @memberOf Ninq
	 */
	reduce<TResult>(reduction: ReductionFunc<T, TResult>): TResult | undefined;
	/**
	 * Applies an accumulator function over a sequence.
	 * The specified seed value is used as the initial accumulator value
	 *
	 * @template TResult - The type of the accumulator value
	 * @param {TResult} seed - The initial accumulator value
	 * @param {ReductionFunc<T, TResult>} reduction - An accumulator function to be invoked on each element
	 * @returns {TResult} - The final accumulator value
	 *
	 * @memberOf Ninq
	 */
	reduce<TResult>(seed: TResult, reduction: ReductionFunc<T, TResult>): TResult;
	reduce<TResult>(
		seedOrReduc: TResult | ReductionFunc<T, TResult>,
		reduc?: ReductionFunc<T, TResult>
	): TResult | undefined {
		return typeof reduc === 'function'
			? Ninq.reduce(
				this.iterable,
				seedOrReduc as TResult,
				reduc
			)
			: Ninq.reduce(
				this.iterable,
				seedOrReduc as ReductionFunc<T, TResult>
			);
	}

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
	static sequenceEqual<T>(left: Loopable<T>, right: Loopable<T>, equalityComparer?: EqualityComparer<T>): boolean {
		const comparer = equalityComparer || ((x, y) => x === y) as EqualityComparer<T>;
		return Ninq.every(
			Ninq.zip(left, right),
			([left, right]) => comparer(left, right)
		);
	}

	/**
	 * Determines whether two sequences are equal by comparing the elements
	 *
	 * @param {Loopable<T>} other - An Iterable<T> to compare to the this sequence
	 * @param {EqualityComparer<T>} [equalityComparer] - A comparing func to compare elements
	 * @returns {boolean} - true if the two source sequences are of equal length and their corresponding elements compare equal; otherwise, false
	 *
	 * @memberOf Ninq
	 */
	sequenceEqual(other: Loopable<T>, equalityComparer?: EqualityComparer<T>): boolean {
		return Ninq.sequenceEqual(this.iterable, other, equalityComparer);
	}

	/**
	 * Returns the only element of a sequence, or a default value if the sequence is empty;
	 * 	this method throws an exception if there is more than one element in the sequence
	 *
	 * @static
	 * @template T - The type of the elements of it
	 * @param {Loopable<T>} it - An Iterable<T> to return the single element of
	 * @param {T} defVal - An element to return if the sequence contains no elements
	 * @returns {T} - The single element of the input sequence, or defValue if the sequence contains no elements
	 *
	 * @memberOf Ninq
	 */
	static singleOrDefault<T>(it: Loopable<T>, defVal: T): T;
	/**
	 * Returns the only element of a sequence that satisfies a specified condition or a default value if no such element exists;
	 * 	this method throws an exception if more than one element satisfies the condition
	 *
	 * @static
	 * @template T - The type of the elements of it
	 * @param {Loopable<T>} it
	 * @param {T} defVal - An element to return if the sequence contains no elements
	 * @param {Predicate<T>} predicate - A function to test an element for a condition
	 * @returns {T} - The single element of the input sequence that satisfies the condition, or defVal if no such element is found
	 *
	 * @memberOf Ninq
	 */
	static singleOrDefault<T>(it: Loopable<T>, defVal: T, predicate: Predicate<T>): T;
	static singleOrDefault<T>(it: Loopable<T>, defVal: T, predicate?: Predicate<T>) {
		if (predicate) {
			it = Ninq.filter(it, predicate);
		}
		else {
			it = ArrayLikeIterable.toIterable(it);
		}
		let isFirstIteration = true;
		for (let item of it) {
			if (!isFirstIteration) {
				throw new Error('Expected single value');
			}
			defVal = item;
			isFirstIteration = false;
		}
		return defVal;
	}

	/**
	 * Returns the only element of a sequence, or a default value if the sequence is empty;
	 * 	this method throws an exception if there is more than one element in the sequence
	 *
	 * @param {T} defVal - An element to return if the sequence contains no elements
	 * @returns {T} - The single element of the input sequence, or defValue if the sequence contains no elements
	 *
	 * @memberOf Ninq
	 */
	singleOrDefault(defVal: T): T;
	/**
	 * Returns the only element of a sequence that satisfies a specified condition or a default value if no such element exists;
	 * 	this method throws an exception if more than one element satisfies the condition
	 *
	 * @param {T} defVal - An element to return if the sequence contains no elements
	 * @param {Predicate<T>} predicate - A function to test an element for a condition
	 * @returns {T} - The single element of the input sequence that satisfies the condition, or defVal if no such element is found
	 *
	 * @memberOf Ninq
	 */
	singleOrDefault(defVal: T, predicate: Predicate<T>): T;
	singleOrDefault(defVal: T, predicate?: Predicate<T>) {
		return Ninq.singleOrDefault(this.iterable, predicate as any);
	}

	/**
	 * Returns the only element of a sequence, and throws an exception if there is not exactly one element in the sequence
	 *
	 * @static
	 * @template T - The type of the elements of it
	 * @param {Loopable<T>} it - An Iterable<T> to return the single element of
	 * @returns {T} - The single element of the input sequence
	 *
	 * @memberOf Ninq
	 */
	static single<T>(it: Loopable<T>): T;
	/**
	 * Returns the only element of a sequence that satisfies a specified condition,
	 * 	and throws an exception if more than one such element exists
	 *
	 * @static
	 * @template T - The type of the elements of it
	 * @param {Loopable<T>} it - An Iterable<T> to return the single element of
	 * @param {Predicate<T>} predicate - A function to test an element for a condition
	 * @returns {T} - The single element of the input sequence that satisfies a condition
	 *
	 * @memberOf Ninq
	 */
	static single<T>(it: Loopable<T>, predicate: Predicate<T>): T;
	static single<T>(it: Loopable<T>, predicate?: Predicate<T>) {
		const result = Ninq.singleOrDefault<T | '\0__ERROR__\0'>(it, '\0__ERROR__\0', predicate as any);
		if (result === '\0__ERROR__\0') {
			throw new Error('Empty sequence');
		}
		return result;
	}

	/**
	 * Returns the only element of a sequence, and throws an exception if there is not exactly one element in the sequence
	 *
	 * @returns {T} - The single element of the input sequence
	 *
	 * @memberOf Ninq
	 */
	single(): T;
	/**
	 * Returns the only element of a sequence that satisfies a specified condition,
	 * 	and throws an exception if more than one such element exists
	 *
	 * @param {Predicate<T>} predicate - A function to test an element for a condition
	 * @returns {T} - The single element of the input sequence that satisfies a condition
	 *
	 * @memberOf Ninq
	 */
	single(predicate: Predicate<T>): T;
	single(predicate?: Predicate<T>) {
		return Ninq.single(this.iterable);
	}

	/**
	 * Bypasses elements in a sequence as long as a specified condition is true and then returns the remaining elements.
	 * 	The element's index is used in the logic of the predicate function
	 *
	 * @static
	 * @template T - The type of the elements of it
	 * @param {Loopable<T>} it - An Iterable<T> to return elements from
	 * @param {Predicate<T>} predicate - A function to test each source element for a condition;
	 * 	the second parameter of the function represents the index of the source element
	 * @returns - An Iterable<T> that contains the elements from the input sequence starting
	 * 	at the first element in the linear series that does not pass the test specified by predicate
	 *
	 * @memberOf Ninq
	 */
	static skipWhile<T>(it: Loopable<T>, predicate: Predicate<T>): Iterable<T> {
		return new SkippingIterable(
			ArrayLikeIterable.toIterable(it),
			predicate
		);
	}

	/**
	 * Bypasses elements in a sequence as long as a specified condition is true and then returns the remaining elements.
	 * 	The element's index is used in the logic of the predicate function
	 *
	 * @param {Predicate<T>} predicate - A function to test each source element for a condition;
	 * 	the second parameter of the function represents the index of the source element
	 * @returns - An Iterable<T> that contains the elements from the input sequence starting
	 * 	at the first element in the linear series that does not pass the test specified by predicate
	 *
	 * @memberOf Ninq
	 */
	skipWhile(predicate: Predicate<T>) {
		const iterable = Ninq.skipWhile(this.iterable, predicate);
		return new Ninq(iterable);
	}

	/**
	 * Bypasses a specified number of elements in a sequence and then returns the remaining elements
	 *
	 * @static
	 * @template T - The type of the elements of it
	 * @param {Loopable<T>} it - An Iterable<T> to return elements from
	 * @param {number} count - The number of elements to skip before returning the remaining elements
	 * @returns - An Iterable<T> that contains the elements that occur after the specified index in the input sequence
	 *
	 * @memberOf Ninq
	 */
	static skip<T>(it: Loopable<T>, count: number) {
		if (count < 0) {
			throw new Error('count must be greater or equal to zero');
		}
		return Ninq.skipWhile(it, (_, index) => index < count);
	}

	/**
	 * Bypasses a specified number of elements in a sequence and then returns the remaining elements
	 *
	 * @param {number} count - The number of elements to skip before returning the remaining elements
	 * @returns - An Iterable<T> that contains the elements that occur after the specified index in the input sequence
	 *
	 * @memberOf Ninq
	 */
	skip(count: number) {
		const iterable = Ninq.skip(this.iterable, count);
		return new Ninq(iterable);
	}

	/**
	 * Determines whether a sequence contains any elements
	 *
	 * @static
	 * @template T - Iterable type
	 * @param  {Loopable<T>} - Iterable to reduce
	 * @returns {boolean} true if the source sequence contains any elements; otherwise, false
	 *
	 * @memberOf Ninq
	 */
	static some<T>(it: Loopable<T>): boolean;
	/**
	 * Determines whether any element of a sequence satisfies a condition
	 *
	 * @static
	 * @template T - Iterable type
	 * @param  {Loopable<T>} - Iterable to reduce
	 * @param {Predicate<T>} prediacte - A function to test each element for a condition
	 * @returns {boolean} - true if any elements in the source sequence pass the test in the specified predicate;
	 * 	otherwise, false
	 *
	 * @memberOf Ninq
	 */
	static some<T>(it: Loopable<T>, prediacte: Predicate<T>): boolean;
	static some<T>(it: Loopable<T>, prediacte?: Predicate<T>) {
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
	}
	/**
	 * Determines whether a sequence contains any elements
	 *
	 * @returns {boolean} true if the source sequence contains any elements; otherwise, false
	 *
	 * @memberOf Ninq
	 */
	some(): boolean;
	/**
	 * Determines whether any element of a sequence satisfies a condition
	 *
	 * @param {Predicate<T>} prediacte - A function to test each element for a condition
	 * @returns {boolean} - true if any elements in the source sequence pass the test in the specified predicate;
	 * 	otherwise, false
	 *
	 * @memberOf Ninq
	 */
	some(prediacte: Predicate<T>): boolean;
	some(prediacte?: Predicate<T>) {
		return typeof prediacte === 'function'
			? Ninq.some(this.iterable, prediacte)
			: Ninq.some(this);
	}

	/**
	 * Sorts the elements of a sequence in the specified order (default: ascending)
	 *
	 * @static
	 * @param {Loopable<number>} iterable - A sequence of values to order
	 * @param {boolean} [descending] - true for descending order; otherwise ascending order would be used
	 * @returns {SortedIterable<number>} - A SortedInterable<T> whose elements are sorted
	 *
	 * @memberOf Ninq
	 */
	static sortBy(iterable: Loopable<number>, descending?: boolean): SortedIterable<number>;
	/**
	 * Sorts the elements of a sequence in the specified order (default: ascending)
	 *
	 * @static
	 * @param {Loopable<string>} iterable - A sequence of values to order
	 * @param {boolean} [descending] - true for descending order; otherwise ascending order would be used
	 * @returns {SortedIterable<string>} - A SortedInterable<T> whose elements are sorted
	 *
	 * @memberOf Ninq
	 */
	static sortBy(iterable: Loopable<string>, descending?: boolean): SortedIterable<string>;
	/**
	 * Sorts the elements of a sequence in the specified order (default: ascending) by using a specified comparer
	 *
	 * @static
	 * @template T - The type of the elements of it
	 * @param {Loopable<T>} iterable - A sequence of values to order
	 * @param {Comparer<T>} comparer - A comparer to compare keys
	 * @param {boolean} [descending] - true for descending order; otherwise ascending order would be used
	 * @returns {SortedIterable<T>} - A SortedInterable<T> whose elements are sorted
	 *
	 * @memberOf Ninq
	 */
	static sortBy<T>(iterable: Loopable<T>, comparer: Comparer<T>, descending?: boolean): SortedIterable<T>;
	static sortBy<T>(iterable: Loopable<T>, comparerOrDesc?: Comparer<T> | boolean, descending?: boolean) {
		let comparer: Comparer<T | Comparable>;
		[comparer, descending] = !comparerOrDesc || typeof comparerOrDesc === 'boolean'
			? [
				(x: Comparable, y: Comparable) =>
					x < y ? -1 :
						x === y ? 0 :
							1,
				comparerOrDesc || descending
			]
			: [comparerOrDesc, descending];
		iterable = ArrayLikeIterable.toIterable(iterable);

		return new SortingIterable(iterable, comparer, descending);
	}

	/**
	 * Sorts the elements of the sequence in the specified order (default: ascending)
	 *
	 * @param {boolean} [descending] - true for descending order; otherwise ascending order would be used
	 * @returns {SortedIterable<T>} - A SortedInterable<T> whose elements are sorted
	 *
	 * @memberOf Ninq
	 */
	sortBy(descending?: boolean): SortedIterable<T>;
	/**
	 * Sorts the elements of the sequence in the specified order (default: ascending) by using a specified comparer
	 *
	 * @param {Comparer<T>} comparer - A comparer to compare keys
	 * @param {boolean} [descending] - true for descending order; otherwise ascending order would be used
	 * @returns {SortedIterable<T>} - A SortedInterable<T> whose elements are sorted
	 *
	 * @memberOf Ninq
	 */
	sortBy(comparer?: Comparer<T>, descending?: boolean): SortedIterable<T>;
	sortBy(compOrDesc?: Comparer<T> | boolean, descending?: boolean): SortedIterable<T> & Ninq<T> {
		let comparer: Comparer<T>;
		[comparer, descending] = !compOrDesc || (typeof compOrDesc === 'boolean')
			? [defaultComparer, !!(compOrDesc || descending)]
			: [compOrDesc, !!descending];

		const resultIterable = Ninq.sortBy(this.iterable, comparer, descending);
		return new Ninq<T>(resultIterable) as any;

		function defaultComparer(x: any, y: any) {
			return x < y ? -1 :
				x === y ? 0 :
					1;
		}
	}

	// Used for sorted ninq objects.
	// tslint:disable-next-line
	protected thenBy(comparer: Comparer<T>, descending?: boolean) {
		const iterable = this.iterable;
		if (!isSortedIterable(iterable)) {
			throw new TypeError('Can only be called with sorted iterables');
		}
		return iterable.thenBy(comparer, descending);
	}

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
	static split<T>(it: Loopable<T>, predicate: Predicate<T>): [Iterable<T>, Iterable<T>] {
		return [
			Ninq.filter(it, predicate),
			Ninq.filter(it, (item, index) => !predicate(item, index)),
		];
	}

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
	split(predicate: Predicate<T>): [Ninq<T>, Ninq<T>] {
		return Ninq.split(this.iterable, predicate)
			.map(it => new Ninq(it));
	}

	/**
	 * Computes the sum of a sequence of numbers
	 *
	 *
	 * @static
	 * @param {Loopable<number>} it - A sequence of number values to calculate the sum of
	 * @returns {number} - The sum of the values in the sequence
	 *
	 * @memberOf Ninq
	 */
	static sum(it: Loopable<number>): number;
	/**
	 * Computes the sum of the sequence of number values that are obtained by invoking a transform function
	 * 	on each element of the input sequence
	 *
	 * @static
	 * @template T - The type of the elements of it
	 * @param {Loopable<T>} it - A sequence of values that are used to calculate a sum
	 * @param {KeySelector<T, number>} selector - A transform function to apply to each element
	 * @returns - The sum of the projected values
	 *
	 * @memberOf Ninq
	 */
	static sum<T>(it: Loopable<T>, selector: KeySelector<T, number>): number;
	static sum<T>(it: Loopable<T>, selector?: KeySelector<T, number>) {
		const keySelector: KeySelector<T, number> = selector || ((x: any) => x) as any;
		return Ninq.reduce(
			it,
			0,
			(sum: number, item: T) => sum + keySelector(item)
		);
	}

	/**
	 * Computes the sum of the sequence of number values that are obtained by invoking a transform function
	 * 	on each element of the input sequence
	 *
	 * @param {KeySelector<T, number>} selector - A transform function to apply to each element
	 * @returns - The sum of the projected values
	 *
	 * @memberOf Ninq
	 */
	sum(selector: KeySelector<T, number>) {
		return Ninq.sum(this.iterable, selector);
	}

	/**
	 * - Returns elements from a sequence as long as a specified condition is true
	 *
	 * @static
	 * @template T - The type of the elements of it
	 * @param {Loopable<T>} it - A sequence to return elements from
	 * @param {Predicate<T>} predicate - A function to test each element for a condition
	 * @returns - An Iterable<T> that contains the elements from the input sequence
	 * 	that occur before the element at which the test no longer passes
	 *
	 * @memberOf Ninq
	 */
	static takeWhile<T>(it: Loopable<T>, predicate: Predicate<T>): Iterable<T> {
		return new TakeWhileIterable(
			ArrayLikeIterable.toIterable(it),
			predicate
		);
	}

	/**
	 * - Returns elements from a sequence as long as a specified condition is true
	 *
	 * @param {Predicate<T>} predicate - A function to test each element for a condition
	 * @returns - An Iterable<T> that contains the elements from the input sequence
	 * 	that occur before the element at which the test no longer passes
	 *
	 * @memberOf Ninq
	 */
	takeWhile(predicate: Predicate<T>) {
		const iterable = Ninq.takeWhile(this.iterable, predicate);
		return new Ninq(iterable);
	}

	/**
	 * Returns a specified number of contiguous elements from the start of a sequence
	 *
	 * @static
	 * @template T - The type of the elements of it
	 * @param {Loopable<T>} it - The sequence to return elements from
	 * @param {number} count - The number of elements to return
	 * @returns - An Iterable<T> that contains the specified number of elements from the start of the input sequence
	 *
	 * @memberOf Ninq
	 */
	static take<T>(it: Loopable<T>, count: number) {
		if (count < 0) {
			throw new Error('count must be greater or equal to zero');
		}
		return Ninq.takeWhile(it, (_, index) => index < count);
	}

	/**
	 * Returns a specified number of contiguous elements from the start of this sequence
	 *
	 *
	 * @param {number} count - The number of elements to return
	 * @returns - An Iterable<T> that contains the specified number of elements from the start of the input sequence
	 *
	 * @memberOf Ninq
	 */
	take(count: number) {
		const iterable = Ninq.take(this.iterable, count);
		return new Ninq(iterable);
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

	/**
	 * Produces the set union of two sequences
	 *
	 * @static
	 * @template T - The type of the elements of the input sequences
	 * @param {Loopable<T>} left - An Iterable<T> whose distinct elements form the first set for the union
	 * @param {Loopable<T>} right - An Iterable<T> whose distinct elements form the second set for the union
	 * @returns {Set<T>} - A Set<T> that contains the elements from both input sequences, excluding duplicates
	 *
	 * @memberOf Ninq
	 */
	static union<T>(left: Loopable<T>, right: Loopable<T>): Set<T>;
	/**
	 * Produces the set union of two sequences by using a specified comparer
	 *
	 * @static
	 * @template T - The type of the elements of the input sequences
	 * @param {Loopable<T>} left - An Iterable<T> whose distinct elements form the first set for the union
	 * @param {Loopable<T>} right - An Iterable<T> whose distinct elements form the second set for the union
	 * @param {EqualityComparer<T>} [comparer] - The comparer to compare values
	 * @returns {Iterable<T>} - An Iterable<T> that contains the elements from both input sequences, excluding duplicates
	 *
	 * @memberOf Ninq
	 */
	static union<T>(
		left: Loopable<T>,
		right: Loopable<T>,
		comparer: EqualityComparer<T>
	): Iterable<T>;
	static union<T>(
		left: Loopable<T>,
		right: Loopable<T>,
		comparer?: EqualityComparer<T>
	): Iterable<T> {
		[left, right] = [left, right].map(ArrayLikeIterable.toIterable);
		if (comparer) {
			return new UnionIterable(left, right, comparer);
		}
		else {
			const result = new Set(left);
			for (const item of right) {
				result.add(item);
			}
			return result;
		}
	}

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
	static traverse<T>(it: Loopable<T>): Iterable<TraverseMapping<T>> {
		it = ArrayLikeIterable.toIterable(it);
		return new TraversingIterable(it);
	}

	/**
	 * Traverses consequencing element of the iterable
	 *
	 * @returns {Ninq<TraverseMapping<T>>} - A Ninq iterable that provides each two consequencing elements
	 *
	 * @memberOf Ninq
	 */
	traverse(): Ninq<TraverseMapping<T>> {
		return new Ninq(
			Ninq.traverse(this.iterable)
		);
	}

	/**
	 * Produces the set union of two sequences by using a specified comparer
	 *
	 * @param {Loopable<T>} other - An Iterable<T> whose distinct elements form the second set for the union
	 * @param {EqualityComparer<T>} [comparer] - The comparer to compare values
	 * @returns {Ninq<T>} - An Iterable<T> that contains the elements from both input sequences, excluding duplicates
	 *
	 * @memberOf Ninq
	 */
	union(
		other: Loopable<T>,
		comparer?: EqualityComparer<T>
	): Ninq<T> {
		return new Ninq(Ninq.union(this.iterable, other, comparer as any));
	}

	/**
	 * Return an array with the corresponding elements of two sequences, producing a sequence of the results
	 *
	 * @static
	 * @template L - The type of the elements of the input sequences
	 * @template R - The type of the elements of the input sequences
	 * @param {Loopable<L>} left - The first sequence to merge
	 * @param {Loopable<R>} right - The second sequence to merge
	 * @returns {Iterable<[T, T]>} - An Iterable<T> that contains merged elements of two input sequences
	 *
	 * @memberOf Ninq
	 */
	static zip<L, R>(left: Loopable<L>, right: Loopable<R>): Iterable<[L, R]>;
	/**
	 * Return an array with the corresponding elements of two sequences, producing a sequence of the results
	 *
	 * @static
	 * @template T - The type of the elements of the input sequences
	 * @param {Loopable<T>} left - The first sequence to merge
	 * @param {Loopable<T>} right - The second sequence to merge
	 * @param {boolean} [throughAll] - true to return all elements from both sequences; otherwise, iteration stops with
	 *	the first exhausted sequence
	 * @returns {(Iterable<[T | undefined, T | undefined]>)} - An Iterable<T> that contains merged elements of two input sequences
	 *
	 * @memberOf Ninq
	 */
	static zip<L, R>(left: Loopable<L>, right: Loopable<R>, throughAll?: boolean): Iterable<[L | undefined, R | undefined]>;
	static zip<L, R>(left: Loopable<L>, right: Loopable<R>, throughAll?: boolean) {
		[left, right] = [left, right].map(ArrayLikeIterable.toIterable) as [Iterable<L>, Iterable<R>];
		return new ZipIterable(left, right, throughAll);
	}

	/**
	 * Return an array with the corresponding elements of two sequences, producing a sequence of the results
	 *
	 * @param {Loopable<T>} other - The other sequence to merge
	 * @returns {(Ninq<[T, T]>)} - An Iterable<T> that contains merged elements of two input sequences
	 *
	 * @memberOf Ninq
	 */
	zip<U>(other: Loopable<U>): Ninq<[T, U]>;
	/**
	 * Return an array with the corresponding elements of two sequences, producing a sequence of the results
	 *
	 * @param {Loopable<T>} other - The other sequence to merge
	 * @param {boolean} [throughAll] - true to return all elements from both sequences; otherwise, iteration stops with
	 *	the first exhausted sequence
	 * @returns {(Ninq<[T | undefined, T | undefined]>)} - An Iterable<T> that contains merged elements of two input sequences
	 *
	 * @memberOf Ninq
	 */
	zip<U>(other: Loopable<U>, throughAll?: boolean): Ninq<[T | undefined, U | undefined]>;
	zip<U>(other: Loopable<U>, throughAll?: boolean) {
		const it = Ninq.zip(this.iterable, other);
		return new Ninq(it);
	}

	static stringify<T>(it: Loopable<T>, separator = ','): string {
		const decomposed = it instanceof Array
			? it
			: [...ArrayLikeIterable.toIterable(it)];

		return decomposed.join(separator);
	}

	stringify(separator?: string): string {
		return Ninq.stringify(this.iterable, separator);
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
