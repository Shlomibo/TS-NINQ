import ConcatIterable from './operators/concat';

export type ReductionFunc<T, U> = (aggregate: U | undefined, item: T, index: number) => U;
export type Predicate<T> = (item: T, index: number) => boolean;
export type Selector<T, U> = (item: T) => U;

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