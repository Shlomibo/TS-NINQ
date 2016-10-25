import ConcatIterable from './operators/concat';
import { Selector, Predicate, EqualityComparer, ReductionFunc } from './types';
import DistinctIterable from './operators/distinct';
import ExceptIterable from './operators/except';

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
	static average<T>(it: Iterable<T>, selector: Selector<T, number>) {
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
	average(selector: Selector<T, number>) {
		return Ninq.average(this, selector);
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
			? Ninq.count(this, predicate)
			: Ninq.count(this);
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
			: new Ninq(Ninq.defaultIfEmpty(this, defValue));
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
			? Ninq.distinct(this, comparer)
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
		return Ninq.elementAtOrDefault<T>(this, index, defValue);
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
		return Ninq.elementAt<T>(this, index);
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
		return new Ninq(Ninq.except(this, other, comparer));
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
		return Ninq.every(this, predicate);
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
		return Ninq.includes(this, item, comparer);
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
				this,
				seedOrReduc as TResult,
				reduc
			)
			: Ninq.reduce(
				this,
				seedOrReduc as ReductionFunc<T, TResult>
			);
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
			? Ninq.some(this, prediacte)
			: Ninq.some(this);
	}
}

export default Ninq;