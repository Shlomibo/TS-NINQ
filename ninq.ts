import ConcatIterable from './operators/concat';
import { KeySelector, Predicate, EqualityComparer, ReductionFunc, Comparer, Comparable, ComparisonFunc, Mapping, Hash, Lookup, NinqLookup } from './types';
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

/**
 * Provides functionality around iterables.
 *
 * @export
 * @class Ninq
 * @implements {Iterable<T>}
 * @template T
 */
export class Ninq<T> implements Iterable<T> {
	constructor(private readonly iterable: Iterable<T>) {
	}

	*[Symbol.iterator]() {
		for (let item of this.iterable) {
			yield item;
		}
	}

	/**
	 * Computes the average of a sequence of number values that are obtained by invoking
	 * a transform function on each element of the input sequence
	 *
	 * @static
	 * @template T - Itrable's elements' type
	 * @param {Iterable<T>} it - Iterable to calculate avg for
	 * @param {Selector<T, number>} selector - A transform function to apply to each element
	 * @returns
	 *
	 * @memberOf Ninq
	 */
	static average<T>(it: Iterable<T>, selector: KeySelector<T, number>) {
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
		return Ninq.average(this.iterable, selector);
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
	static cast<T, TResult>(it: Iterable<T>) {
		return (it as any) as Iterable<TResult>;
	}

	/**
	 * Return a concatination of this sequence and the provided sequences.
	 *
	 * @static
	 * @template T - Itrable's elements' type
	 * @param {...Iterable<T>[]} iterables - Iterable to concat to this sequence.
	 * @returns {Iterable<T>} A concatination of this sequence and the provided sequences
	 *
	 * @memberOf Ninq
	 */
	static concat<T>(...iterables: Iterable<T>[]): Iterable<T>;
	/**
	 * Return a concatination of this sequence and the provided sequences.
	 *
	 * @static
	 * @template T - Itrable's elements' type
	 * @param {Iterable<Iterable<T>>} iterables - Iterable to concat to this sequence.
	 * @returns {Iterable<T>} A concatination of this sequence and the provided sequences
	 *
	 * @memberOf Ninq
	 */
	static concat<T>(iterables: Iterable<Iterable<T>>): Iterable<T>;
	static concat<T>(...iterables: (Iterable<T> | Iterable<Iterable<T>>)[]) {
		const realIterables = Ninq.isIterableOfIterables<T>(iterables[0])
			? iterables[0] as Iterable<Iterable<T>>
			: iterables as Iterable<Iterable<T>>;
		return new ConcatIterable(realIterables);
	}
	private static isIterableOfIterables<T>(iterable?: Iterable<T> | Iterable<Iterable<T>>)
		: iterable is Iterable<Iterable<T>> {

		const iterator = iterable && iterable[Symbol.iterator](),
			firstIter = iterator && iterator.next();
		try {
			return !!firstIter &&
				!firstIter.done &&
				firstIter.value &&
				typeof (firstIter.value as any)[Symbol.iterator] === 'function';
		}
		finally {
			iterator &&
				iterator.return &&
				iterator.return(undefined);
		}
	}
	/**
	 * Return a concatination of this sequence and the provided sequences.
	 *
	 * @param {...Iterable<T>[]} iterables - Iterable to concat to this sequence.
	 * @returns {Ninq<T>} A concatination of this sequence and the provided sequences
	 *
	 * @memberOf Ninq
	 */
	concat(...iterables: Iterable<T>[]): Ninq<T>;
	/**
	 * Return a concatination of this sequence and the provided sequences.
	 *
	 * @param {Iterable<Iterable<T>>} iterables - Iterable to concat to this sequence.
	 * @returns {Ninq<T>} A concatination of this sequence and the provided sequences
	 *
	 * @memberOf Ninq
	 */
	concat(iterables: Iterable<Iterable<T>>): Ninq<T>;
	concat(...iterables: (Iterable<T> | Iterable<Iterable<T>>)[]) {
		const [...realIterables] = Ninq.isIterableOfIterables<T>(iterables[0])
			? iterables[0] as Iterable<Iterable<T>>
			: iterables as Iterable<Iterable<T>>;
		realIterables.unshift(this);
		return new Ninq(
			Ninq.concat<T>(realIterables)
		);
	}

	/**
	 * Returns the number of elements in a sequence
	 *
	 * @static
	 * @template T - Itrable's elements' type
	 * @param {Iterable<T>} it - Iterable to calculate avg for
	 * @returns {number} - The number of elements in the input sequence
	 *
	 * @memberOf Ninq
	 */
	static count<T>(it: Iterable<T>): number;
	/**
	 * Returns a number that represents how many elements in the specified sequence satisfy a condition
	 *
	 * @static
	 * @template T - Itrable's elements' type
	 * @param {Iterable<T>} it - Iterable to calculate avg for
	 * @param {Predicate<T>} predicate - A function to test each element for a condition
	 * @returns {number} - A number that represents how many elements in the sequence satisfy the condition in the predicate function
	 *
	 * @memberOf Ninq
	 */
	static count<T>(it: Iterable<T>, predicate: Predicate<T>): number;
	static count<T>(it: Iterable<T>, predicate?: Predicate<T>) {
		let result = 0,
			index = 0;
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
			: Ninq.count(this);
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
	 * @param {Iterable<T>} it - Iterable to calculate avg for
	 * @param {T} defValue - The value to return if the sequence is empty
	 * @returns A sequence that contains defaultValue if source is empty; otherwise, source
	 *
	 * @memberOf Ninq
	 */
	static defaultIfEmpty<T>(it: Iterable<T>, defValue: T) {
		return Ninq.some(it)
			? it
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
	 * Returns distinct elements from a sequence by using the default equality comparer to compare values
	 *
	 * @static
	 * @template T - Itrable's elements' type
	 * @param {Iterable<T>} it - Iterable to calculate avg for
	 * @returns {Set<T>} A Set<T> that contains distinct elements from the source sequence
	 *
	 * @memberOf Ninq
	 */
	static distinct<T>(it: Iterable<T>): Set<T>;
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
	static distinct<T>(it: Iterable<T>, comparer: EqualityComparer<T>): Iterable<T>;
	static distinct<T>(it: Iterable<T>, comparer?: EqualityComparer<T>) {
		return typeof comparer === 'function'
			? new DistinctIterable(it, comparer)
			: new Set(it);
	}
	/**
	 * Returns distinct elements from a sequence by using a specified IEqualityComparer<T> to compare values
	 *
	 * @param {EqualityComparer<T>} [comparer] - A comparer to compare values
	 * @returns A Ninq<T> that contains distinct elements from the source sequence
	 *
	 * @memberOf Ninq
	 */
	distinct(comparer?: EqualityComparer<T>) {
		const iterable = typeof comparer === 'function'
			? Ninq.distinct(this.iterable, comparer)
			: Ninq.distinct(this);
		return new Ninq(iterable);
	}

	/**
	 * Returns the element at a specified index in a sequence or a default value if the index is out of range
	 *
	 * @static
	 * @template T - Itrable's elements' type
	 * @param {Iterable<T>} it - Iterable to calculate avg for
	 * @param {number} index The zero-based index of the element to retrieve
	 * @param {T} defValue The value to return if index is out of range
	 * @returns default(TSource) if the index is outside the bounds of the source sequence;
	 * 	otherwise, the element at the specified position in the source sequence
	 *
	 * @memberOf Ninq
	 */
	static elementAtOrDefault<T>(it: Iterable<T>, index: number, defValue: T) {
		let i = 0;
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
	 * @param {Iterable<T>} it - Iterable to calculate avg for
	 * @param {number} index The zero-based index of the element to retrieve
	 * @returns The element at the specified position in the source sequence
	 *
	 * @memberOf Ninq
	 */
	static elementAt<T>(it: Iterable<T>, index: number) {
		const result = Ninq.elementAtOrDefault<T | '\0___ERR___\0'>(it, index, '\0___ERR___\0');
		if (result === '\0___ERR___\0') {
			throw new Error('Could not find element');
		}
		return result;
	}
	/**
	 * Returns the element at a specified index in a sequence or a default value if the index is out of range
	 *
	 *
	 * @param {number} index The zero-based index of the element to retrieve
	 * @param {T} defValue The value to return if index is out of range
	 * @returns default(TSource) if the index is outside the bounds of the source sequence;
	 * 	otherwise, the element at the specified position in the source sequence
	 *
	 * @memberOf Ninq
	 */
	elementAtOrDefault(index: number, defValue: T) {
		return Ninq.elementAtOrDefault<T>(this.iterable, index, defValue);
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
		return Ninq.elementAt<T>(this.iterable, index);
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
	 * Produces the set difference of two sequences by using the specified IEqualityComparer<T> to compare values
	 *
	 * @static
	 * @template T - Itrable's elements' type
	 * @param {Iterable<T>} left - An Iterable<T> whose elements that are not also in second will be returned
	 * @param {Iterable<T>} right - An Iterable<T> whose elements that also occur in the first sequence
	 * 	will cause those elements to be removed from the returned sequence
	 * @param {EqualityComparer<T>} [comparer] - A comparer to compare values
	 * @returns A sequence that contains the set difference of the elements of two sequences
	 *
	 * @memberOf Ninq
	 */
	static except<T>(left: Iterable<T>, right: Iterable<T>, comparer?: EqualityComparer<T>)
		: Iterable<T> {
		return new ExceptIterable(left, right, comparer);
	}
	/**
	 * Produces the set difference of two sequences by using the specified IEqualityComparer<T> to compare values
	 *
	 * @param {Iterable<T>} other - An Iterable<T> whose elements that also occur in the first sequence
	 * 	will cause those elements to be removed from the returned sequence
	 * @param {EqualityComparer<T>} [comparer] - A comparer to compare values
	 * @returns A sequence that contains the set difference of the elements of two sequences
	 *
	 * @memberOf Ninq
	 */
	except(other: Iterable<T>, comparer?: EqualityComparer<T>) {
		return new Ninq(Ninq.except(this.iterable, other, comparer));
	}

	/**
	 * Returns the first element of a sequence, or a default value if the sequence contains no elements.
	 *
	 * @static
	 * @template T - Itrable's elements' type
	 * @param {Iterable<T>} it - Iterable to calculate avg for
	 * @param {T} defValue
	 * @param {Predicate<T>} [predicate] - A function to test each element for a condition
	 * @returns defValue if source is empty; otherwise, the first element in source
	 *
	 * @memberOf Ninq
	 */
	static firstOrDefault<T>(it: Iterable<T>, defValue: T, predicate?: Predicate<T>): T {
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
	 * @param {Iterable<T>} it - Iterable to calculate avg for
	 * @param {Predicate<T>} [predicate] - A function to test each element for a condition
	 * @returns The first element in the sequence that passes the test in the specified predicate function
	 *
	 * @memberOf Ninq
	 */
	static first<T>(it: Iterable<T>, predicate?: Predicate<T>) {
		const result = Ninq.firstOrDefault<T | '\0__ERR__\0'>(it, '\0__ERR__\0', predicate);
		if (result === '\0__ERR__\0') {
			throw new RangeError('Iterable is emprty');
		}
		return result;
	}
	/**
	 * Returns the first element of a sequence, or a default value if the sequence contains no elements.
	 *
	 * @param {T} defValue
	 * @param {Predicate<T>} [predicate] - A function to test each element for a condition
	 * @returns defValue if source is empty; otherwise, the first element in source
	 *
	 * @memberOf Ninq
	 */
	firstOrDefault(defValue: T, predicate?: Predicate<T>) {
		return Ninq.firstOrDefault(this.iterable, defValue, predicate);
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

	/**
	 * Filters a sequence of values based on a predicate
	 *
	 * @static
	 * @template T
	 * @param {Iterable<T>} it - An Iterable<T> to filter
	 * @param {Predicate<T>} predicate - A function to test each element for a condition.
	 * @returns {Iterable<T>} - An Iterable<T> that contains elements from the input sequence that satisfy the condition
	 *
	 * @memberOf Ninq
	 */
	static filter<T>(it: Iterable<T>, predicate: Predicate<T>)
		: Iterable<T> {

		return new FilterIterable(it, predicate);
	}
	/**
	 * Filters the sequence of values based on a predicate
	 *
	 * @param {Predicate<T>} predicate - A function to test each element for a condition.
	 * @returns - - A Ninq<T> that contains elements from the input sequence that satisfy the condition
	 *
	 * @memberOf Ninq
	 */
	filter(predicate: Predicate<T>) {
		return new Ninq(Ninq.filter(this.iterable, predicate));
	}


	/**
	 * Determines whether all elements of a sequence satisfy a condition
	 *
	 * @static
	 * @template T - Itrable's elements' type
	 * @param {Iterable<T>} it - Iterable to calculate avg for
	 * @param {Predicate<T>} predicate - A function to test each element for a condition
	 * @returns true if every element of the source sequence passes the test in the specified predicate,
	 * or if the sequence is empty; otherwise, false
	 *
	 * @memberOf Ninq
	 */
	static every<T>(
		it: Iterable<T>,
		predicate: Predicate<T>
	) {
		let result = true;
		let i = 0;
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
	 * Groups the elements of a sequence according to a key selector function.
	 * 	The keys are compared by using a comparer and each group's elements are projected by using a specified function
	 *
	 * @static
	 * @template T - The type of the elements of the iterable
	 * @template TKey - The type of the key returned by keySelector
	 * @param {Iterable<T>} it - An Iterable<T> whose elements to group
	 * @param {Selector<T, TKey>} keySelector - A function to extract the key for each element
	 * @param {EqualityComparer<TKey>} [comparer] - A comparer to compare keys
	 * @returns {Iterable<Grouping<T, TKey>>} - An Iterable<Grouping<T, TKey>> where each Grouping<T, TKey>
	 * 	object contains a collection of objects of type T and a key
	 *
	 * @memberOf Ninq
	 */
	static groupBy<T, TKey>(
		it: Iterable<T>,
		keySelector: KeySelector<T, TKey>,
		comparer?: EqualityComparer<TKey>
	): Iterable<Grouping<T, TKey>>;
	/**
	 * Groups the elements of a sequence according to a key selector function.
	 * 	The keys are compared by using a comparer and each group's elements are projected by using a specified function
	 *
	 * @static
	 * @template T - The type of the elements of the iterable
	 * @template TKey - The type of the key returned by keySelector
	 * @template TResult - The type of the elements in the result
	 * @param {Iterable<T>} it - An Iterable<T> whose elements to group
	 * @param {Selector<T, TKey>} keySelector - A function to extract the key for each element
	 * @param {Selector<T, TResult>} elementSelector - A function to map each source element to an element in the result
	 * @param {EqualityComparer<TKey>} [comparer] - A comparer to compare keys
	 * @returns {Iterable<Grouping<TResult, TKey>>} - An Iterable<Grouping<TResult, TKey>> where each Grouping<TResult, TKey>
	 * 	object contains a collection of objects of type TResult and a key
	 *
	 * @memberOf Ninq
	 */
	static groupBy<T, TKey, TResult>(
		it: Iterable<T>,
		keySelector: KeySelector<T, TKey>,
		elementSelector: KeySelector<T, TResult>,
		comparer?: EqualityComparer<TKey>
	): Iterable<Grouping<TResult, TKey>>;
	static groupBy<T, TKey, TResult>(
		it: Iterable<T>,
		keySelector: KeySelector<T, TKey>,
		selectorOrComparer: KeySelector<T, TResult> | EqualityComparer<TKey> | undefined,
		comparer?: EqualityComparer<TKey>
	) {
		if (!comparer && (selectorOrComparer && selectorOrComparer.length === 2)) {
			comparer = selectorOrComparer as EqualityComparer<TKey>;
			selectorOrComparer = undefined;
		}
		if (!selectorOrComparer) {
			selectorOrComparer = (x => x as any) as KeySelector<T, TResult>;
		}
		return new GroupingIterable<T, TKey, TResult>(
			it,
			keySelector,
			selectorOrComparer as KeySelector<T, TResult>,
			comparer
		);
	}
	/**
	 * Groups the elements of a sequence according to a key selector function.
	 * 	The keys are compared by using a comparer and each group's elements are projected by using a specified function
	 *
	 * @template TKey - The type of the key returned by keySelector
	 * @param {Selector<T, TKey>} keySelector - A function to extract the key for each element
	 * @param {EqualityComparer<TKey>} [comparer] - A comparer to compare keys
	 * @returns {Iterable<Grouping<T, TKey>>} - An Iterable<Grouping<T, TKey>> where each Grouping<T, TKey>
	 * 	object contains a collection of objects of type T and a key
	 *
	 * @memberOf Ninq
	 */
	groupBy<TKey>(keySelector: KeySelector<T, TKey>, comparer?: EqualityComparer<TKey>): Ninq<Grouping<T, TKey>>;
	/**
	 * Groups the elements of a sequence according to a key selector function.
	 * 	The keys are compared by using a comparer and each group's elements are projected by using a specified function
	 *
	 * @template TKey - The type of the key returned by keySelector
	 * @template TResult - The type of the elements in the result
	 * @param {Selector<T, TKey>} keySelector - A function to extract the key for each element
	 * @param {Selector<T, TResult>} elementSelector - A function to map each source element to an element in the result
	 * @param {EqualityComparer<TKey>} [comparer] - A comparer to compare keys
	 * @returns {Iterable<Grouping<TResult, TKey>>} - An Iterable<Grouping<TResult, TKey>> where each Grouping<TResult, TKey>
	 * 	object contains a collection of objects of type TResult and a key
	 *
	 * @memberOf Ninq
	 */
	groupBy<TKey, TResult>(
		keySelector: KeySelector<T, TKey>,
		elementSelector: KeySelector<T, TResult>,
		comparer?: EqualityComparer<TKey>
	): Ninq<Grouping<T, TKey>>;
	groupBy<TKey, TResult>(
		keySelector: KeySelector<T, TKey>,
		selectorOrComparer: KeySelector<T, TResult> | EqualityComparer<TKey> | undefined,
		comparer?: EqualityComparer<TKey>
	) {
		if (!comparer && (selectorOrComparer && selectorOrComparer.length === 2)) {
			comparer = selectorOrComparer as EqualityComparer<TKey>;
			selectorOrComparer = undefined;
		}
		const resultIterable = selectorOrComparer
			? Ninq.groupBy(
				this.iterable,
				keySelector,
				selectorOrComparer as KeySelector<T, TResult>,
				comparer
			)
			: Ninq.groupBy(
				this.iterable,
				keySelector,
				comparer
			);
		return new Ninq<Grouping<TResult, TKey>>(resultIterable as any);
	}

	/**
	 * Correlates the elements of two sequences based on key equality and groups the results.
	 * 	A specified comparer is used to compare keys
	 *
	 * @static
	 * @template TOuner
	 * @template TInner
	 * @template TKey
	 * @param {Iterable<TOuner>} outer - The first sequence to join
	 * @param {Iterable<TInner>} inner - The sequence to join to the first sequence
	 * @param {Selector<TOuner, TKey>} outerSelector - A function to extract the join key from each element of the first sequence
	 * @param {Selector<TInner, TKey>} innerSelector - A function to extract the join key from each element of the second sequence
	 * @param {EqualityComparer<TKey>} [comparer] - A comparer to compare keys
	 * @returns {Iterable<GroupJoinEntry<TOuner, TInner>>} - An Iterable<T> that contains elements of the result
	 * 	that are obtained by performing a grouped join on two sequences
	 *
	 * @memberOf Ninq
	 */
	static groupJoin<TOuner, TInner, TKey>(
		outer: Iterable<TOuner>,
		inner: Iterable<TInner>,
		outerSelector: KeySelector<TOuner, TKey>,
		innerSelector: KeySelector<TInner, TKey>,
		comparer?: EqualityComparer<TKey>
	): Iterable<GroupJoinEntry<TOuner, TInner>>;
	/**
	 * Correlates the elements of two sequences based on key equality and groups the results.
	 * 	A specified comparer is used to compare keys
	 *
	 * @static
	 * @template TOuner
	 * @template TInner
	 * @template TKey
	 * @template TResult
	 * @param {Iterable<TOuner>} outer - The first sequence to join
	 * @param {Iterable<TInner>} inner - The sequence to join to the first sequence
	 * @param {Selector<TOuner, TKey>} outerSelector - A function to extract the join key from each element of the first sequence
	 * @param {Selector<TInner, TKey>} innerSelector - A function to extract the join key from each element of the second sequence
	 * @param {Selector<GroupJoinEntry<TOuner, TInner>, TResult>} resultSelector - A function to create a result element from an element from the first sequence
	 * 	and a collection of matching elements from the second sequence
	 * @param {EqualityComparer<TKey>} [comparer] - A comparer to compare keys
	 * @returns {Iterable<TResult>} - An Iterable<T> that contains elements of the result
	 * 	that are obtained by performing a grouped join on two sequences
	 *
	 * @memberOf Ninq
	 */
	static groupJoin<TOuner, TInner, TKey, TResult>(
		outer: Iterable<TOuner>,
		inner: Iterable<TInner>,
		outerSelector: KeySelector<TOuner, TKey>,
		innerSelector: KeySelector<TInner, TKey>,
		resultSelector: KeySelector<GroupJoinEntry<TOuner, TInner>, TResult>,
		comparer?: EqualityComparer<TKey>
	): Iterable<TResult>;
	static groupJoin<TOuner, TInner, TKey, TResult>(
		outer: Iterable<TOuner>,
		inner: Iterable<TInner>,
		outerSelector: KeySelector<TOuner, TKey>,
		innerSelector: KeySelector<TInner, TKey>,
		resultSelectorOrComparer?: KeySelector<GroupJoinEntry<TOuner, TInner>, TResult> | EqualityComparer<TKey>,
		comparer?: EqualityComparer<TKey>
	) {
		if (!resultSelectorOrComparer || resultSelectorOrComparer.length === 2) {
			return new GroupJoinIterable(
				outer,
				inner,
				outerSelector,
				innerSelector,
				entry => entry,
				resultSelectorOrComparer as (EqualityComparer<TKey> | undefined)
			) as any as Iterable<TResult>;
		}
		else {
			return new GroupJoinIterable(
				outer,
				inner,
				outerSelector,
				innerSelector,
				resultSelectorOrComparer as KeySelector<GroupJoinEntry<TOuner, TInner>, TResult>,
				comparer
			);
		}
	}
	/**
	 * Correlates the elements of two sequences based on key equality and groups the results.
	 * 	A specified comparer is used to compare keys
	 *
	 * @template TInner
	 * @template TKey
	 * @param {Iterable<TInner>} inner - The sequence to join to this sequence
	 * @param {Selector<T, TKey>} keySelector - - A function to extract the join key from each element of this sequence
	 * @param {Selector<TInner, TKey>} innerKeySelector - A function to extract the join key from each element of the inner sequence
	 * @param {EqualityComparer<TKey>} [comparer] - A comparer to compare keys
	 * @returns {Ninq<GroupJoinEntry<T, TInner>>} - A Ninq<GroupJoinEntry<T, TInner>> that contains elements of the result
	 * 	that are obtained by performing a grouped join on two sequences
	 *
	 * @memberOf Ninq
	 */
	groupJoin<TInner, TKey>(
		inner: Iterable<TInner>,
		keySelector: KeySelector<T, TKey>,
		innerKeySelector: KeySelector<TInner, TKey>,
		comparer?: EqualityComparer<TKey>
	): Ninq<GroupJoinEntry<T, TInner>>;
	/**
	 * Correlates the elements of two sequences based on key equality and groups the results.
	 * 	A specified comparer is used to compare keys
	 *
	 * @template TInner
	 * @template TKey
	 * @template TResult
	 * @param {Iterable<TInner>} inner - The sequence to join to this sequence
	 * @param {Selector<T, TKey>} keySelector - - A function to extract the join key from each element of this sequence
	 * @param {Selector<TInner, TKey>} innerKeySelector - A function to extract the join key from each element of the inner sequence
	 * @param {Selector<GroupJoinEntry<TOuner, TInner>, TResult>} resultSelector - A function to create a result element from an element from the first sequence
	 * 	and a collection of matching elements from the second sequence
	 * @param {EqualityComparer<TKey>} [comparer] - A comparer to compare keys
	 * @returns {Ninq<TResult>} - A Ninq<TResult> that contains elements of the result
	 * 	that are obtained by performing a grouped join on two sequences
	 *
	 * @memberOf Ninq
	 */
	groupJoin<TInner, TKey, TResult>(
		inner: Iterable<TInner>,
		keySelector: KeySelector<T, TKey>,
		innerKeySelector: KeySelector<TInner, TKey>,
		resultSelecor: KeySelector<GroupJoinEntry<T, TInner>, TResult>,
		comparer?: EqualityComparer<TKey>
	): Ninq<TResult>;
	groupJoin<TInner, TKey, TResult>(
		inner: Iterable<TInner>,
		keySelector: KeySelector<T, TKey>,
		innerKeySelector: KeySelector<TInner, TKey>,
		resultSelecorOrComparer?: KeySelector<GroupJoinEntry<T, TInner>, TResult> | EqualityComparer<TKey>,
		comparer?: EqualityComparer<TKey>
	) {
		let resultIterable: Iterable<TResult>;
		if (!resultSelecorOrComparer || resultSelecorOrComparer.length === 2) {
			resultIterable = Ninq.groupJoin(
				this.iterable,
				inner,
				keySelector,
				innerKeySelector,
				resultSelecorOrComparer as (EqualityComparer<TKey> | undefined)
			) as any as Iterable<TResult>;
		}
		else {
			resultIterable = Ninq.groupJoin(
				this.iterable,
				inner,
				keySelector,
				innerKeySelector,
				resultSelecorOrComparer as KeySelector<GroupJoinEntry<T, TInner>, TResult>,
				comparer
			);
		}
		return new Ninq(resultIterable);
	}

	/**
	 * Determines whether a sequence contains a specified element
	 *
	 * @static
	 * @template T - Itrable's elements' type
	 * @param {Iterable<T>} it - Iterable to calculate avg for
	 * @param {T} item - The value to locate in the sequence
	 * @param {EqualityComparer<T>} [comparer] - An optional equality comparer to compare values
	 * @returns true if the source sequence contains an element that has the specified value; otherwise, false
	 *
	 * @memberOf Ninq
	 */
	static includes<T>(it: Iterable<T>, item: T, comparer?: EqualityComparer<T>) {
		comparer = comparer || ((x, y) => x === y);
		for (let element of it) {
			if (comparer(item, element)) {
				return true;
			}
		}
		return false;
	}
	includes(item: T, comparer?: EqualityComparer<T>) {
		return Ninq.includes(this.iterable, item, comparer);
	}

	/**
	 * Produces the set intersection of two sequences.
	 *
	 * @static
	 * @template T - The type of the elements of the input sequences
	 * @param {Iterable<T>} left - An Iterable<T> whose distinct elements that also appear in right will be returned
	 * @param {Iterable<T>} right - An Iterable<T> whose distinct elements that also appear in the left sequence will be returned
	 * @returns - A sequence that contains the elements that form the set intersection of two sequences
	 *
	 * @memberOf Ninq
	 */
	static intersect<T>(left: Iterable<T>, right: Iterable<T>): Set<T>;
	/**
	 * Produces the set intersection of two sequences.
	 *
	 * @static
	 * @template T - The type of the elements of the input sequences
	 * @param {Iterable<T>} left - An Iterable<T> whose distinct elements that also appear in right will be returned
	 * @param {Iterable<T>} right - An Iterable<T> whose distinct elements that also appear in the left sequence will be returned
	 * @param {EqualityComparer<T>} comparer - A comparer to compare values
	 * @returns - A sequence that contains the elements that form the set intersection of two sequences
	 *
	 * @memberOf Ninq
	 */
	static intersect<T>(left: Iterable<T>, right: Iterable<T>, comparer: EqualityComparer<T>): Iterable<T>;
	static intersect<T>(left: Iterable<T>, right: Iterable<T>, comparer?: EqualityComparer<T>): Iterable<T> {
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
		return result;
	}
	/**
	 * Produces the set intersection of two sequences.
	 *
	 * @param {Iterable<T>} other - An Iterable<T> whose distinct elements that also appear in the left sequence will be returned
	 * @param {EqualityComparer<T>} [comparer] - An optional comparer to compare values
	 * @returns - A sequence that contains the elements that form the set intersection of two sequences
	 *
	 * @memberOf Ninq
	 */
	intersect(other: Iterable<T>, comparer?: EqualityComparer<T>) {
		const resultIterable = comparer
			? Ninq.intersect(this.iterable, other, comparer)
			: Ninq.intersect(this.iterable, other);
		return new Ninq(resultIterable);
	}

	/**
	 * Correlates the elements of two sequences based on matching keys
	 *
	 *
	 * @static
	 * @template TOuter - The type of the elements of the first sequence
	 * @template TInner - The type of the elements of the second sequence
	 * @template TKey - The type of the keys returned by the key selector functions
	 * @param {Iterable<TOuter>} outer - The first sequence to join
	 * @param {Iterable<TInner>} inner - The sequence to join to the first sequence
	 * @param {Mapping<TOuter, TKey>} outerKeySelector - A function to extract the join key from each element of the first sequence
	 * @param {Mapping<TInner, TKey>} innerKeySelector - A function to extract the join key from each element of the second sequence
	 * @param {EqualityComparer<TKey>} [comparer] - An optional comparer ro compare keys
	 * @returns An Iterable<Iterable<JoinMatch<TOuter, TInner>>> that has elements of type TResult
	 * 	that are obtained by performing an inner join on two sequences
	 *
	 * @memberOf Ninq
	 */
	static join<TOuter, TInner, TKey>(
		outer: Iterable<TOuter>,
		inner: Iterable<TInner>,
		outerKeySelector: KeySelector<TOuter, TKey>,
		innerKeySelector: KeySelector<TInner, TKey>,
		comparer?: EqualityComparer<TKey>
	): Iterable<JoinMatch<TOuter, TInner>> {
		return new JoinIterable(
			outer,
			inner,
			outerKeySelector,
			innerKeySelector,
			comparer
		);
	}
	/**
	 * Correlates the elements of two sequences based on matching keys
	 *
	 * @template TOther - The type of the elements of the second sequence
	 * @template TKey - The type of the keys returned by the key selector functions
	 * @param {Iterable<TOther>} other - The sequence to join to the first sequence
	 * @param {Mapping<T, TKey>} keySelector - A function to extract the join key from each element of this sequence
	 * @param {Mapping<TOther, TKey>} otherKeySelector - A function to extract the join key from each element of the other sequence
	 * @param {EqualityComparer<TKey>} [comparer] - An optional comparer ro compare keys
	 * @returns An Ninq<Iterable<JoinMatch<TOuter, TInner>>> that has elements of type TResult
	 * 	that are obtained by performing an inner join on two sequences
	 *
	 * @memberOf Ninq
	 */
	join<TOther, TKey>(
		other: Iterable<TOther>,
		keySelector: KeySelector<T, TKey>,
		otherKeySelector: KeySelector<TOther, TKey>,
		comparer?: EqualityComparer<TKey>
	) {
		return new Ninq(Ninq.join(
			this.iterable,
			other,
			keySelector,
			otherKeySelector,
			comparer
		));
	}

	/**
	 * Returns the last element of a sequence, or a default value if the sequence contains no elements
	 *
	 * @static
	 * @template T - The type of the elements of it
	 * @param {Iterable<T>} it - An Iterable<T> to return the last element of
	 * @param {T} defValue - Default value to return in case the sequence is empty
	 * @returns {T} - defValue if the source sequence is empty;
	 * 	otherwise, the last element in the IEnumerable<T>
	 *
	 * @memberOf Ninq
	 */
	static lastOrDefault<T>(it: Iterable<T>, defValue: T): T;
	/**
	 * Returns the last element of a sequence that satisfies a condition or a default value if no such element is found
	 *
	 * @static
	 * @template T - The type of the elements of it
	 * @param {Iterable<T>} it - An Iterable<T> to return the last element of
	 * @param {T} defValue - Default value to return in case no element satisfies the predicate
	 * @param {Predicate<T>} predicate - A function to test each element for a condition
	 * @returns {T} - defValue if the sequence is empty or if no elements pass the test in the predicate function;
	 * 	otherwise, the last element that passes the test in the predicate function
	 *
	 * @memberOf Ninq
	 */
	static lastOrDefault<T>(it: Iterable<T>, defValue: T, predicate: Predicate<T>): T;
	static lastOrDefault<T>(it: Iterable<T>, defValue: T, predicate?: Predicate<T>) {
		if (predicate) {
			it = Ninq.filter(it, predicate);
		}
		let result = defValue;
		for (result of it) {
			;
		}
		return result;
	}

	/**
	 * Returns the last element of a sequence, or a default value if the sequence contains no elements
	 *
	 * @param {T} defValue - Default value to return in case the sequence is empty
	 * @returns {T} - defValue if the source sequence is empty;
	 * 	otherwise, the last element in the IEnumerable<T>
	 *
	 * @memberOf Ninq
	 */
	lastOrDefault(defValue: T): T;
	/**
	 * Returns the last element of a sequence that satisfies a condition or a default value if no such element is found
	 *
	 * @param {T} defValue - Default value to return in case no element satisfies the predicate
	 * @param {Predicate<T>} predicate - A function to test each element for a condition
	 * @returns {T} - defValue if the sequence is empty or if no elements pass the test in the predicate function;
	 * 	otherwise, the last element that passes the test in the predicate function
	 *
	 * @memberOf Ninq
	 */
	lastOrDefault(defValue: T, predicate: Predicate<T>): T;
	lastOrDefault(defValue: T, predicate?: Predicate<T>) {
		return predicate
			? Ninq.lastOrDefault(this.iterable, defValue, predicate)
			: Ninq.lastOrDefault(this.iterable, defValue);
	}

	/**
	 * Returns the last element of a sequence
	 *
	 * @static
	 * @template T - The type of the elements of it
	 * @param {Iterable<T>} it - An Iterable<T> to return the last element of
	 * @returns {T} - The value at the last position in the source sequence
	 *
	 * @memberOf Ninq
	 */
	static last<T>(it: Iterable<T>): T;
	/**
	 * Returns the last element of a sequence that satisfies a specified condition
	 *
	 * @static
	 * @template T - The type of the elements of it
	 * @param {Iterable<T>} it - An Iterable<T> to return the last element of
	 * @param {Predicate<T>} predicate - A function to test each element for a condition
	 * @returns {T} - The last element in the sequence that passes the test in the specified predicate function
	 *
	 * @memberOf Ninq
	 */
	static last<T>(it: Iterable<T>, predicate: Predicate<T>): T;
	static last<T>(it: Iterable<T>, predicate?: Predicate<T>) {
		const result = predicate
			? Ninq.lastOrDefault<T | '\0__ERROR__\0'>(it, '\0__ERROR__\0', predicate)
			: Ninq.lastOrDefault<T | '\0__ERROR__\0'>(it, '\0__ERROR__\0');
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

	/**
	 * Projects each element of a sequence into a new form by incorporating the element's index
	 *
	 * @static
	 * @template T - The type of the elements of it
	 * @template TResult - The type of the value returned by mapping
	 * @param {Iterable<T>} it - A sequence of values to invoke a transform function on
	 * @param {Mapping<T, TResult>} mapping - A transform function to apply to each source element;
	 * 	the second parameter of the function represents the index of the source element
	 * @returns {Iterable<TResult>} - An Iterable<T> whose elements are the result of invoking the transform function on each element of this
	 *
	 * @memberOf Ninq
	 */
	static map<T, TResult>(it: Iterable<T>, mapping: Mapping<T, TResult>)
		: Iterable<TResult> {

		return new MappingIterable<T, TResult>(it, mapping);
	}

	/**
	 * Projects each element of a sequence into a new form by incorporating the element's index
	 *
	 * @template TResult - The type of the value returned by mapping
	 * @param {Mapping<T, TResult>} mapping - A transform function to apply to each source element;
	 * 	the second parameter of the function represents the index of the source element
	 * @returns - An Iterable<T> whose elements are the result of invoking the transform function on each element of this
	 *
	 * @memberOf Ninq
	 */
	map<TResult>(mapping: Mapping<T, TResult>) {
		const it = Ninq.map(this.iterable, mapping);
		return new Ninq<TResult>(it);
	}

	/**
	 * Flattens the sequences into one sequence, and invokes a result selector function on each element therein.
	 * 	The index of each source element is used in the intermediate projected form of that element
	 *
	 * @static
	 * @template T - The type of the elements of source
	 * @template TResult - The type of the elements of the resulting sequence
	 * @param {Iterable<Iterable<T>>} it - A sequence of values to project
	 * @param {Mapping<T, TResult>} mapping - A transform function to apply to each element of the intermediate sequence
	 * @returns {Iterable<TResult>} - An Iterable<TResult> whose elements are the result of invoking the mapping each
	 * 	of the sequence elements to a result element
	 *
	 * @memberOf Ninq
	 */
	static mapMany<T, TResult>(it: Iterable<Iterable<T>>, mapping: Mapping<T, TResult>): Iterable<TResult>;
	/**
	 * Projects each element of a sequence to an Iterable<TCollection>,
	 * 	flattens the resulting sequences into one sequence, and invokes a result selector function on each element therein.
	 * 	The index of each source element is used in the intermediate projected form of that element
	 *
	 * @static
	 * @template T - The type of the elements of source
	 * @template TCollection - The type of the intermediate elements collected by sequenceMapping
	 * @template TResult - The type of the elements of the resulting sequence
	 * @param {Iterable<T>} it - A sequence of values to project
	 * @param {Mapping<T, Iterable<TCollection>>} sequenceMapping - A transform function to apply to each source element;
	 * 	the second parameter of the function represents the index of the source element
	 * @param {Mapping<TCollection, TResult>} resultMapping - A transform function to apply to each element of the intermediate sequence
	 * @returns {Iterable<TResult>} - An Iterable<TResult> whose elements are the result of invoking the one-to-many transform function
	 * 	collectionSelector on each element of source and then mapping each of those sequence elements and
	 * 	their corresponding source element to a result element
	 *
	 * @memberOf Ninq
	 */
	static mapMany<T, TCollection, TResult>(
		it: Iterable<T>,
		sequenceMapping: Mapping<T, Iterable<TCollection>>,
		resultMapping: Mapping<TCollection, TResult>
	): Iterable<TResult>;
	static mapMany<T, TCollection, TResult>(
		it: Iterable<T>,
		seqOrResMapping: Mapping<T, Iterable<TCollection>> | Mapping<T, TResult>,
		resultMapping?: Mapping<TCollection, TResult>
	): Iterable<TResult> {
		if (!resultMapping) {
			resultMapping = seqOrResMapping as any;
			seqOrResMapping = x => x as any;
		}
		return new MapManyIterable<T, TCollection, TResult>(
			it,
			seqOrResMapping as any,
			resultMapping as any
		);
	}

	/**
	 * Flattens the sequences into one sequence, and invokes a result selector function on each element therein.
	 * 	The index of each source element is used in the intermediate projected form of that element
	 *
	 * @template TResult - The type of the elements of the resulting sequence
	 * @param {Mapping<any, TResult>} mapping - A transform function to apply to each element of the intermediate sequence
	 * @returns {Ninq<TResult>} - An Iterable<TResult> whose elements are the result of invoking the mapping each
	 * 	of the sequence elements to a result element
	 *
	 * @memberOf Ninq
	 */
	mapMany<TResult>(mapping: Mapping<any, TResult>): Ninq<TResult>;
	/**
	 * Projects each element of a sequence to an Iterable<TCollection>,
	 * 	flattens the resulting sequences into one sequence, and invokes a result selector function on each element therein.
	 * 	The index of each source element is used in the intermediate projected form of that element
	 *
	 * @template TCollection - The type of the intermediate elements collected by sequenceMapping
	 * @template TResult - The type of the elements of the resulting sequence
	 * @param {Mapping<T, Iterable<TCollection>>} sequenceMapping - A transform function to apply to each source element;
	 * 	the second parameter of the function represents the index of the source element
	 * @param {Mapping<TCollection, TResult>} resultMapping - A transform function to apply to each element of the intermediate sequence
	 * @returns {Ninq<TResult>}
	 * @returns {Ninq<TResult>} - An Iterable<TResult> whose elements are the result of invoking the one-to-many transform function
	 * 	collectionSelector on each element of source and then mapping each of those sequence elements and
	 * 	their corresponding source element to a result element
	 *
	 * @memberOf Ninq
	 */
	mapMany<TCollection, TResult>(
		sequenceMapping: Mapping<T, Iterable<TCollection>>,
		resultMapping: Mapping<TCollection, TResult>
		): Ninq<TResult>;
	mapMany(
		seqOrResMapping: Mapping<any, any>,
		resultMapping?: Mapping<any, any>
	) {
		if (!resultMapping) {
			resultMapping = seqOrResMapping;
			seqOrResMapping = x => x;
		}
		const it = Ninq.mapMany(this.iterable, seqOrResMapping, resultMapping);
		return new Ninq(it);
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
	static max(it: Iterable<number>): number | undefined;
	/**
	 * Invokes a transform function on each element of a sequence and returns the maximum value
	 *
	 * @static
	 * @template T - The type of the elements of it
	 * @param {Iterable<T>} it - A sequence of values to determine the maximum value of
	 * @param {Mapping<T, number>} valSelector - A transform function to apply to each element
	 * @returns {(number | undefined)} - The maximum value in the sequence or undefined
	 *
	 * @memberOf Ninq
	 */
	static max<T>(it: Iterable<T>, valSelector: KeySelector<T, number>): number | undefined;
	static max<T>(it: Iterable<T>, valSelector?: KeySelector<T, number>) {
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
	 * @param {Iterable<number>} it - A sequence of values to determine the minimum value of
	 * @returns {(number | undefined)} - The minimum value in the sequence
	 *
	 * @memberOf Ninq
	 */
	static min(it: Iterable<number>): number | undefined;
	/**
	 * Invokes a transform function on each element of a sequence and returns the minimum value
	 *
	 * @static
	 * @template T - The type of the elements of it
	 * @param {Iterable<T>} it - A sequence of values to determine the minimum value of
	 * @param {Mapping<T, number>} valSelector - A transform function to apply to each element
	 * @returns {(number | undefined)} - The minimum value in the sequence
	 *
	 * @memberOf Ninq
	 */
	static min<T>(it: Iterable<T>, valSelector: KeySelector<T, number>): number | undefined;
	static min<T>(it: Iterable<T>, valSelector?: KeySelector<T, number>) {
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
	 * @returns {Iterable<T>} - An Iterable<T> that contains a repeated value
	 *
	 * @memberOf Ninq
	 */
	static * repeat<T>(element: T, count: number) {
		if (count < 0) {
			throw new Error('count must be greater or equal to zero');
		}
		for (let i = 0; i < count; i++) {
			yield element;
		}
	}

	/**
	 * Applies an accumulator function over a sequence
	 *
	 * @static
	 * @template T - Iterable type
	 * @template TResult - The type of the accumulator value
	 * @param  {Iterable<T>} - Iterable to reduce
	 * @param {ReductionFunc<T, TResult>} reduction - An accumulator function to be invoked on each element.
	 * @returns {(TResult | undefined)} The final accumulator value
	 *
	 * @memberOf Ninq
	 */
	static reduce<T, TResult>(
		it: Iterable<T>,
		reduction: ReductionFunc<T, TResult>
	): TResult | undefined;
	/**
	 * Applies an accumulator function over a sequence.
	 * The specified seed value is used as the initial accumulator value
	 *
	 * @static
	 * @template T - Iterable type
	 * @template TResult - The type of the accumulator value
	 * @param  {Iterable<T>} - Iterable to reduce
	 * @param {TResult} seed - The initial accumulator value
	 * @param {ReductionFunc<T, TResult>} reduction - An accumulator function to be invoked on each element
	 * @returns {TResult} - The final accumulator value
	 *
	 * @memberOf Ninq
	 */
	static reduce<T, TResult>(
		it: Iterable<T>,
		seed: TResult,
		reduction: ReductionFunc<T, TResult>
	): TResult;
	static reduce<T, TResult>(
		it: Iterable<T>,
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
	 * Inverts the order of the elements in a sequence
	 *
	 * @static
	 * @template T - The type of the elements of it
	 * @param {Iterable<T>} iterable - A sequence of values to reverse
	 * @returns {Iterable<T>} - A sequence whose elements correspond to those of the input sequence in reverse order
	 *
	 * @memberOf Ninq
	 */
	static reverse<T>(iterable: Iterable<T>): Iterable<T> {
		return new ReverseIterable<T>(iterable);
	}

	/**
	 * Inverts the order of the elements in the sequence
	 *
	 * @returns - A sequence whose elements correspond to those of the input sequence in reverse order
	 *
	 * @memberOf Ninq
	 */
	reverse() {
		const iterable = Ninq.reverse(this.iterable);
		return new Ninq<T>(iterable);
	}

	/**
	 * Determines whether two sequences are equal by comparing the elements
	 *
	 * @template T - The type of the elements of the input sequences
	 * @param {Iterable<T>} left - An Iterable<T> to compare to right sequence
	 * @param {Iterable<T>} right - An Iterable<T> to compare to the left sequence
	 * @param {EqualityComparer<T>} [equalityComparer] - A comparing func to compare elements
	 * @returns {boolean} - true if the two source sequences are of equal length and their corresponding elements compare equal; otherwise, false
	 *
	 * @memberOf Ninq
	 */
	static sequenceEqual<T>(left: Iterable<T>, right: Iterable<T>, equalityComparer?: EqualityComparer<T>): boolean {
		const comparer = equalityComparer || ((x, y) => x === y) as EqualityComparer<T>;
		return Ninq.every(
			Ninq.zip(left, right),
			([left, right]) => comparer(left, right)
		);
	}

	/**
	 * Determines whether two sequences are equal by comparing the elements
	 *
	 * @param {Iterable<T>} other - An Iterable<T> to compare to the this sequence
	 * @param {EqualityComparer<T>} [equalityComparer] - A comparing func to compare elements
	 * @returns {boolean} - true if the two source sequences are of equal length and their corresponding elements compare equal; otherwise, false
	 *
	 * @memberOf Ninq
	 */
	sequenceEqual(other: Iterable<T>, equalityComparer?: EqualityComparer<T>): boolean {
		return Ninq.sequenceEqual(this.iterable, other, equalityComparer);
	}

	/**
	 * Returns the only element of a sequence, or a default value if the sequence is empty;
	 * 	this method throws an exception if there is more than one element in the sequence
	 *
	 * @static
	 * @template T - The type of the elements of it
	 * @param {Iterable<T>} it - An Iterable<T> to return the single element of
	 * @param {T} defVal - An element to return if the sequence contains no elements
	 * @returns {T} - The single element of the input sequence, or defValue if the sequence contains no elements
	 *
	 * @memberOf Ninq
	 */
	static singleOrDefault<T>(it: Iterable<T>, defVal: T): T;
	/**
	 * Returns the only element of a sequence that satisfies a specified condition or a default value if no such element exists;
	 * 	this method throws an exception if more than one element satisfies the condition
	 *
	 * @static
	 * @template T - The type of the elements of it
	 * @param {Iterable<T>} it
	 * @param {T} defVal - An element to return if the sequence contains no elements
	 * @param {Predicate<T>} predicate - A function to test an element for a condition
	 * @returns {T} - The single element of the input sequence that satisfies the condition, or defVal if no such element is found
	 *
	 * @memberOf Ninq
	 */
	static singleOrDefault<T>(it: Iterable<T>, defVal: T, predicate: Predicate<T>): T;
	static singleOrDefault<T>(it: Iterable<T>, defVal: T, predicate?: Predicate<T>) {
		if (predicate) {
			it = Ninq.filter(it, predicate);
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
	 * @param {Iterable<T>} it - An Iterable<T> to return the single element of
	 * @returns {T} - The single element of the input sequence
	 *
	 * @memberOf Ninq
	 */
	static single<T>(it: Iterable<T>): T;
	/**
	 * Returns the only element of a sequence that satisfies a specified condition,
	 * 	and throws an exception if more than one such element exists
	 *
	 * @static
	 * @template T - The type of the elements of it
	 * @param {Iterable<T>} it - An Iterable<T> to return the single element of
	 * @param {Predicate<T>} predicate - A function to test an element for a condition
	 * @returns {T} - The single element of the input sequence that satisfies a condition
	 *
	 * @memberOf Ninq
	 */
	static single<T>(it: Iterable<T>, predicate: Predicate<T>): T;
	static single<T>(it: Iterable<T>, predicate?: Predicate<T>) {
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
	 * @param {Iterable<T>} it - An Iterable<T> to return elements from
	 * @param {Predicate<T>} predicate - A function to test each source element for a condition;
	 * 	the second parameter of the function represents the index of the source element
	 * @returns - An Iterable<T> that contains the elements from the input sequence starting
	 * 	at the first element in the linear series that does not pass the test specified by predicate
	 *
	 * @memberOf Ninq
	 */
	static skipWhile<T>(it: Iterable<T>, predicate: Predicate<T>): Iterable<T> {
		return new SkippingIterable(it, predicate);
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
	 * @param {Iterable<T>} it - An Iterable<T> to return elements from
	 * @param {number} count - The number of elements to skip before returning the remaining elements
	 * @returns - An Iterable<T> that contains the elements that occur after the specified index in the input sequence
	 *
	 * @memberOf Ninq
	 */
	static skip<T>(it: Iterable<T>, count: number) {
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
	 * @param  {Iterable<T>} - Iterable to reduce
	 * @returns {boolean} true if the source sequence contains any elements; otherwise, false
	 *
	 * @memberOf Ninq
	 */
	static some<T>(it: Iterable<T>): boolean;
	/**
	 * Determines whether any element of a sequence satisfies a condition
	 *
	 * @static
	 * @template T - Iterable type
	 * @param  {Iterable<T>} - Iterable to reduce
	 * @param {Predicate<T>} prediacte - A function to test each element for a condition
	 * @returns {boolean} - true if any elements in the source sequence pass the test in the specified predicate;
	 * 	otherwise, false
	 *
	 * @memberOf Ninq
	 */
	static some<T>(it: Iterable<T>, prediacte: Predicate<T>): boolean;
	static some<T>(it: Iterable<T>, prediacte?: Predicate<T>) {
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
	 * @param {Iterable<number>} iterable - A sequence of values to order
	 * @param {boolean} [descending] - true for descending order; otherwise ascending order would be used
	 * @returns {SortedIterable<number>} - A SortedInterable<T> whose elements are sorted
	 *
	 * @memberOf Ninq
	 */
	static sortBy(iterable: Iterable<number>, descending?: boolean): SortedIterable<number>;
	/**
	 * Sorts the elements of a sequence in the specified order (default: ascending)
	 *
	 * @static
	 * @param {Iterable<string>} iterable - A sequence of values to order
	 * @param {boolean} [descending] - true for descending order; otherwise ascending order would be used
	 * @returns {SortedIterable<string>} - A SortedInterable<T> whose elements are sorted
	 *
	 * @memberOf Ninq
	 */
	static sortBy(iterable: Iterable<string>, descending?: boolean): SortedIterable<string>;
	/**
	 * Sorts the elements of a sequence in the specified order (default: ascending) by using a specified comparer
	 *
	 * @static
	 * @template T - The type of the elements of it
	 * @param {Iterable<T>} iterable - A sequence of values to order
	 * @param {Comparer<T>} comparer - A comparer to compare keys
	 * @param {boolean} [descending] - true for descending order; otherwise ascending order would be used
	 * @returns {SortedIterable<T>} - A SortedInterable<T> whose elements are sorted
	 *
	 * @memberOf Ninq
	 */
	static sortBy<T>(iterable: Iterable<T>, comparer: Comparer<T>, descending?: boolean): SortedIterable<T>;
	static sortBy<T>(iterable: Iterable<T>, comparerOrDesc?: Comparer<T> | boolean, descending?: boolean) {
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
	private thenBy(comparer: Comparer<T>, descending?: boolean) {
		const iterable = this.iterable;
		if (!isSortedIterable(iterable)) {
			throw new TypeError('Can only be called with sorted iterables');
		}
		return iterable.thenBy(comparer, descending);
	}

	/**
	 * Computes the sum of a sequence of numbers
	 *
	 *
	 * @static
	 * @param {Iterable<number>} it - A sequence of number values to calculate the sum of
	 * @returns {number} - The sum of the values in the sequence
	 *
	 * @memberOf Ninq
	 */
	static sum(it: Iterable<number>): number;
	/**
	 * Computes the sum of the sequence of number values that are obtained by invoking a transform function
	 * 	on each element of the input sequence
	 *
	 * @static
	 * @template T - The type of the elements of it
	 * @param {Iterable<T>} it - A sequence of values that are used to calculate a sum
	 * @param {KeySelector<T, number>} selector - A transform function to apply to each element
	 * @returns - The sum of the projected values
	 *
	 * @memberOf Ninq
	 */
	static sum<T>(it: Iterable<T>, selector: KeySelector<T, number>): number;
	static sum<T>(it: Iterable<T>, selector?: KeySelector<T, number>) {
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
	 * @param {Iterable<T>} it - A sequence to return elements from
	 * @param {Predicate<T>} predicate - A function to test each element for a condition
	 * @returns - An Iterable<T> that contains the elements from the input sequence
	 * 	that occur before the element at which the test no longer passes
	 *
	 * @memberOf Ninq
	 */
	static takeWhile<T>(it: Iterable<T>, predicate: Predicate<T>): Iterable<T> {
		return new TakeWhileIterable(it, predicate);
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
	 * @param {Iterable<T>} it - The sequence to return elements from
	 * @param {number} count - The number of elements to return
	 * @returns - An Iterable<T> that contains the specified number of elements from the start of the input sequence
	 *
	 * @memberOf Ninq
	 */
	static take<T>(it: Iterable<T>, count: number) {
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
	 * @param {Iterable<T>} it - An Iterable<T> to create an array from
	 * @returns {T[]} - An array that contains the elements from the input sequence
	 *
	 * @memberOf Ninq
	 */
	static toArray<T>(it: Iterable<T>): T[] {
		const [...result] = it;
		return result;
	}

	/**
	 * Creates a Lookup<TKey,T> from an Iterable<T> according to a specified key selector function
	 *
	 * @static
	 * @template T - The type of the elements of it
	 * @template TKey - The type of the key returned by keySelector
	 * @param {Iterable<T>} it - The Iterable<T> to create a Lookup<TKey, T> from
	 * @param {KeySelector<T, TKey>} keySelector - A function to extract a key from each element
	 * @returns {Lookup<TKey, T>} - A Lookup<TKey, T> that contains keys and values
	 *
	 * @memberOf Ninq
	 */
	static toLookup<T, TKey>(it: Iterable<T>, keySelector: KeySelector<T, TKey>): Lookup<TKey, T>;
	/**
	 * Creates a Lookup<TKey, TValue> from an Iterable<T> according to specified key selector and element selector functions
	 *
	 * @static
	 * @template T - The type of the elements of it
	 * @template TKey - The type of the key returned by keySelector
	 * @template TValue
	 * @param {Iterable<T>} it - The Iterable<T> to create a Lookup<TKey, T> from
	 * @param {KeySelector<T, TKey>} keySelector - A function to extract a key from each element
	 * @param {KeySelector<T, TValue>} valueSelector - A transform function to produce a result element value from each element
	 * @returns {Lookup<TKey, TValue>} - A Lookup<TKey, TV> that contains keys and values
	 *
	 * @memberOf Ninq
	 */
	static toLookup<T, TKey, TValue>(
		it: Iterable<T>,
		keySelector: KeySelector<T, TKey>,
		valueSelector: KeySelector<T, TValue>
	): Lookup<TKey, TValue>;
	static toLookup<T, TKey>(
		it: Iterable<T>,
		keySelector: KeySelector<T, TKey>,
		vs?: KeySelector<T, any>
	): Lookup<TKey, any> {
		const valueSelector = vs || (x => x);
		const result = new Map<TKey, Iterable<any>>();
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
		return  result as any;
	}

	/**
	 * Creates a Hash<Iterable<T>> from an Iterable<T> according to a specified key selector function
	 *
	 * @static
	 * @template T - The type of the elements of it
	 * @param {Iterable<T>} it - The Iterable<T> to create a Hash<Iterable<T>> from
	 * @param {KeySelector<T, string>} keySelector - A function to extract a key from each element
	 * @returns {Hash<Iterable<T>>} - A Hash<Iterable<T>> that contains keys and values
	 *
	 * @memberOf Ninq
	 */
	static toLookupObject<T>(it: Iterable<T>, keySelector: KeySelector<T, string>): Hash<Iterable<T>>;
	/**
	 * Creates a Hash<Iterable<TValue>> from an Iterable<T> according to specified key selector and element selector functions
	 *
	 * @static
	 * @template T - The type of the elements of it
	 * @template TValue - The type of the value returned by valueSelector
	 * @param {Iterable<T>} it - The Iterable<T> to create a Hash<Iterable<T>> from
	 * @param {KeySelector<T, string>} keySelector - A function to extract a key from each element
	 * @param {KeySelector<T, TValue>} valueSelector - A transform function to produce a result element value from each element
	 * @returns {Hash<Iterable<TValue>>} - A Hash<Iterable<TValue>> that contains keys and values
	 *
	 * @memberOf Ninq
	 */
	static toLookupObject<T, TValue>(
		it: Iterable<T>,
		keySelector: KeySelector<T, string>,
		valueSelector: KeySelector<T, TValue>
	): Hash<Iterable<TValue>>;
	static toLookupObject<T>(
		it: Iterable<T>,
		keySelector: KeySelector<T, string>,
		vs?: KeySelector<T, any>
	): Hash<Iterable<any>> {
		const valueSelector = vs || (x => x);
		const result: Hash<Iterable<any>> = {};
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
	 * @param {Iterable<T>} it - An Iterable<T> to create a Map<TKey, T> from
	 * @param {KeySelector<T, TKey>} keySelector - A function to extract a key from each element
	 * @returns {Map<TKey, T>} - A Map<TKey, T> that contains keys and values
	 *
	 * @memberOf Ninq
	 */
	static toMap<T, TKey>(it: Iterable<T>, keySelector: KeySelector<T, TKey>): Map<TKey, T>;
	/**
	 * Creates a Map<TKey, TValue> from an Iterable<T> according to specified key selector and element selector functions
	 *
	 * @static
	 * @template T - The type of the elements of it
	 * @template TKey - The type of the key returned by keySelector
	 * @template TValue - The type of the value returned by valueSelector
	 * @param {Iterable<T>} it - An Iterable<T> to create a Map<TKey, TValue> from
	 * @param {KeySelector<T, TKey>} keySelector - A function to extract a key from each element
	 * @param {KeySelector<T, TValue>} valueSelector - A transform function to produce a result element value from each element
	 * @returns {Map<TKey, TValue>} - A Map<TKey, TValue> that contains values of type TValue selected from the input sequence
	 *
	 * @memberOf Ninq
	 */
	static toMap<T, TKey, TValue>(
		it: Iterable<T>,
		keySelector: KeySelector<T, TKey>,
		valueSelector: KeySelector<T, TValue>
	): Map<TKey, TValue>;
	static toMap<T, TK>(
		it: Iterable<T>,
		keySelector: KeySelector<T, TK>,
		vs?: KeySelector<T, any>
	): Map<TK, any> {
		const valueSelector: KeySelector<T, any> = vs || (x => x);
		const result = new Map<TK, any>();
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
	): Map<TK, any> {
		return Ninq.toMap(this.iterable, keySelector, vs as any);
	}

	/**
	 * Creates a Hash<T> from an Iterable<T>
	 *
	 * @static
	 * @template T - The type of the elements of it
	 * @param {Iterable<T>} it - An Iterable<T> to create a Hash<T> from
	 * @param {KeySelector<T, string>} keySelector - A function to extract a key from each element
	 * @returns {Hash<T>} - A Hash<T> that contains keys and values
	 *
	 * @memberOf Ninq
	 */
	static toObject<T>(it: Iterable<T>, keySelector: KeySelector<T, string>): Hash<T>;
	/**
	 * Creates a Hash<TValue> from an Iterable<T> according to specified element selector function
	 *
	 * @static
	 * @template T - The type of the elements of it
	 * @template TValue - The type of the value returned by valueSelector
	 * @param {Iterable<T>} it - An Iterable<T> to create a Hash<TValue> from
	 * @param {KeySelector<T, string>} keySelector - A function to extract a key from each element
	 * @param {KeySelector<T, TValue>} valueSelector - A transform function to produce a result element value from each element
	 * @returns {Hash<TValue>} - A Hash<TValue> that contains values of type TValue selected from the input sequence
	 *
	 * @memberOf Ninq
	 */
	static toObject<T, TValue>(
		it: Iterable<T>,
		keySelector: KeySelector<T, string>,
		valueSelector: KeySelector<T, TValue>
	): Hash<TValue>;
	static toObject<T>(
		it: Iterable<T>,
		keySelector: KeySelector<T, string>,
		vs?: KeySelector<T, any>
	): Hash<any> {
		const valueSelector: KeySelector<T, any> = vs || (x => x);
		const result: Hash<any> = {};
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
	 * Return an array with the corresponding elements of two sequences, producing a sequence of the results
	 *
	 * @static
	 * @template L - The type of the elements of the input sequences
	 * @template R - The type of the elements of the input sequences
	 * @param {Iterable<L>} left - The first sequence to merge
	 * @param {Iterable<R>} right - The second sequence to merge
	 * @returns {Iterable<[T, T]>} - An Iterable<T> that contains merged elements of two input sequences
	 *
	 * @memberOf Ninq
	 */
	static zip<L, R>(left: Iterable<L>, right: Iterable<R>): Iterable<[L, R]>;
	/**
	 * Return an array with the corresponding elements of two sequences, producing a sequence of the results
	 *
	 * @static
	 * @template T - The type of the elements of the input sequences
	 * @param {Iterable<T>} left - The first sequence to merge
	 * @param {Iterable<T>} right - The second sequence to merge
	 * @param {boolean} [throughAll] - true to return all elements from both sequences; otherwise, iteration stops with
	 *	the first exhausted sequence
	 * @returns {(Iterable<[T | undefined, T | undefined]>)} - An Iterable<T> that contains merged elements of two input sequences
	 *
	 * @memberOf Ninq
	 */
	static zip<L, R>(left: Iterable<L>, right: Iterable<R>, throughAll?: boolean): Iterable<[L | undefined, R | undefined]>;
	static zip<L, R>(left: Iterable<L>, right: Iterable<R>, throughAll?: boolean) {
		return new ZipIterable(left, right, throughAll);
	}

	/**
	 * Return an array with the corresponding elements of two sequences, producing a sequence of the results
	 *
	 * @param {Iterable<T>} other - The other sequence to merge
	 * @returns {(Ninq<[T, T]>)} - An Iterable<T> that contains merged elements of two input sequences
	 *
	 * @memberOf Ninq
	 */
	zip<U>(other: Iterable<U>): Ninq<[T, U]>;
	/**
	 * Return an array with the corresponding elements of two sequences, producing a sequence of the results
	 *
	 * @param {Iterable<T>} other - The other sequence to merge
	 * @param {boolean} [throughAll] - true to return all elements from both sequences; otherwise, iteration stops with
	 *	the first exhausted sequence
	 * @returns {(Ninq<[T | undefined, T | undefined]>)} - An Iterable<T> that contains merged elements of two input sequences
	 *
	 * @memberOf Ninq
	 */
	zip<U>(other: Iterable<U>, throughAll?: boolean): Ninq<[T | undefined, U | undefined]>;
	zip<U>(other: Iterable<U>, throughAll?: boolean) {
		const it = Ninq.zip(this.iterable, other);
		return new Ninq(it);
	}
}

export default Ninq;