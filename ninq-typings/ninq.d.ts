/// <reference types="node" />
import { KeySelector, Predicate, EqualityComparer, ReductionFunc, Comparer, ComparisonFunc, Mapping, Hash, Lookup, NinqLookup, Loopable, Generator } from './types';
import { Grouping } from './operators/group-by';
import { GroupJoinEntry } from './operators/group-join';
import { JoinMatch } from './operators/join';
import { SortedIterable } from './operators/sortBy';
/**
 * Provides functionality around iterables.
 *
 * @export
 * @class Ninq
 * @implements {Iterable<T>}
 * @template T
 */
export declare class Ninq<T> implements Iterable<T> {
    private readonly iterable;
    constructor(iterable: Loopable<T>);
    [Symbol.iterator](): IterableIterator<T>;
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
    static average<T>(it: Loopable<T>, selector: KeySelector<T, number>): number | undefined;
    /**
     * Computes the average of a sequence of number values that are obtained by invoking
     * a transform function on each element of the input sequence
     *
     * @param {Selector<T, number>} selector - A transform function to apply to each element
     * @returns The average of the sequence of values
     *
     * @memberOf Ninq
     */
    average(selector: KeySelector<T, number>): number | undefined;
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
    static byKey<T, TKey, TResult>(keySelector: KeySelector<T, TKey>, comparer: ComparisonFunc<TKey, TResult>): ComparisonFunc<T, TResult>;
    /**
     * Casts the elements of a sequence to the specified type
     *
     * @template TResult - The type to cast the elements of source to
     * @returns - A Ninq wrpper that contains each element of the source sequence cast to the specified type
     *
     * @memberOf Ninq
     */
    cast<TResult>(): Ninq<TResult>;
    static cast<T, TResult>(it: Iterable<T>): Iterable<TResult>;
    /**
     * Return a concatination of this sequence and the provided sequences.
     *
     * @static
     * @template T - Itrable's elements' type
     * @param {...Loopable<T>[]} iterables - Iterable to concat to this sequence.
     * @returns {Iterable<T>} A concatination of this sequence and the provided sequences
     *
     * @memberOf Ninq
     */
    static concat<T>(first: Loopable<T>, ...iterables: Loopable<T>[]): Iterable<T>;
    /**
     * Return a concatination of this sequence and the provided sequences.
     *
     * @static
     * @template T - Itrable's elements' type
     * @param {Loopable<Loopable<T>>} iterables - Iterable to concat to this sequence.
     * @returns {Iterable<T>} A concatination of this sequence and the provided sequences
     *
     * @memberOf Ninq
     */
    static concat<T>(iterables: Loopable<Loopable<T>>): Iterable<T>;
    private static isLoopableOfLoopables<T>(iterable?);
    /**
     * Return a concatination of this sequence and the provided sequences.
     *
     * @param {...Iterable<T>[]} iterables - Iterable to concat to this sequence.
     * @returns {Ninq<T>} A concatination of this sequence and the provided sequences
     *
     * @memberOf Ninq
     */
    concat(...iterables: Loopable<T>[]): Ninq<T>;
    /**
     * Return a concatination of this sequence and the provided sequences.
     *
     * @param {Iterable<Iterable<T>>} iterables - Iterable to concat to this sequence.
     * @returns {Ninq<T>} A concatination of this sequence and the provided sequences
     *
     * @memberOf Ninq
     */
    concat(iterables: Loopable<Loopable<T>>): Ninq<T>;
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
    private static $default<T>(x, defVal);
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
    static defaultIfEmpty<T>(it: Loopable<T>, defValue: T): Iterable<T>;
    /**
     * Returns the elements of the specified sequence or the specified value in a singleton collection if the sequence is empty
     *
     * @param {T} defValue - The value to return if the sequence is empty
     * @returns A sequence that contains defaultValue if source is empty; otherwise, source
     *
     * @memberOf Ninq
     */
    defaultIfEmpty(defValue: T): Ninq<T>;
    /**
     * Returns distinct elements from a sequence by using the default equality comparer to compare values
     *
     * @static
     * @template T - Itrable's elements' type
     * @param {Loopable<T>} it - Iterable to calculate avg for
     * @returns {Set<T>} A Set<T> that contains distinct elements from the source sequence
     *
     * @memberOf Ninq
     */
    static distinct<T>(it: Loopable<T>): Set<T>;
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
    static distinct<T>(it: Loopable<T>, comparer: EqualityComparer<T>): Iterable<T>;
    /**
     * Returns distinct elements from a sequence by using a specified IEqualityComparer<T> to compare values
     *
     * @param {EqualityComparer<T>} [comparer] - A comparer to compare values
     * @returns A Ninq<T> that contains distinct elements from the source sequence
     *
     * @memberOf Ninq
     */
    distinct(comparer?: EqualityComparer<T>): Ninq<T>;
    /**
     * Returns the element at a specified index in a sequence or a default value if the index is out of range
     *
     * @static
     * @template T - Itrable's elements' type
     * @param {Loopable<T>} it - Iterable to calculate avg for
     * @param {number} index The zero-based index of the element to retrieve
     * @param {T} defValue The value to return if index is out of range
     * @returns default(TSource) if the index is outside the bounds of the source sequence;
     * 	otherwise, the element at the specified position in the source sequence
     *
     * @memberOf Ninq
     */
    static elementAtOrDefault<T>(it: Loopable<T>, index: number, defValue: T): T;
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
    static elementAt<T>(it: Loopable<T>, index: number): T;
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
    elementAtOrDefault(index: number, defValue: T): T;
    /**
     * Returns the element at a specified index in a sequence
     *
     * @param {number} index The zero-based index of the element to retrieve
     * @returns The element at the specified position in the source sequence
     *
     * @memberOf Ninq
     */
    elementAt(index: number): T;
    /**
     * Returns an empty sequence that has the specified type argument
     *
     * @static
     * @template T - Itrable's elements' type
     * @returns {Iterable<T>} An empty Iterable<T> whose type argument is T
     *
     * @memberOf Ninq
     */
    static empty<T>(): Iterable<T>;
    /**
     * Converts an ES6 generator into an async function that returns a promise.
     *
     * @static
     * @param {Generator<Promise<any>>} generator - The generator to convert
     * @returns {(...args: any[]) => Promise<any>} - An async function.
     *
     * @memberOf Ninq
     */
    static esync(generator: Generator<Promise<any>>): (...args: any[]) => Promise<any>;
    /**
     * Converts an ES6 generator into an async function that returns a promise, then
     * execute it with the provided params.
     *
     * @static
     * @param {Generator<Promise<any>>} generator - The generator to convert
     * @param {...any[]} args - Arguments for the async function.
     * @returns {Promise<any>} - Returns a promise of the async function.
     *
     * @memberOf Ninq
     */
    static runEsync(generator: Generator<Promise<any>>, ...args: any[]): Promise<any>;
    /**
     * Produces the set difference of two sequences by using the specified IEqualityComparer<T> to compare values
     *
     * @static
     * @template T - Itrable's elements' type
     * @param {Loopable<T>} left - An Iterable<T> whose elements that are not also in second will be returned
     * @param {Loopable<T>} right - An Iterable<T> whose elements that also occur in the first sequence
     * 	will cause those elements to be removed from the returned sequence
     * @param {EqualityComparer<T>} [comparer] - A comparer to compare values
     * @returns A sequence that contains the set difference of the elements of two sequences
     *
     * @memberOf Ninq
     */
    static except<T>(left: Loopable<T>, right: Loopable<T>, comparer?: EqualityComparer<T>): Iterable<T>;
    /**
     * Produces the set difference of two sequences by using the specified IEqualityComparer<T> to compare values
     *
     * @param {Loopable<T>} other - An Iterable<T> whose elements that also occur in the first sequence
     * 	will cause those elements to be removed from the returned sequence
     * @param {EqualityComparer<T>} [comparer] - A comparer to compare values
     * @returns A sequence that contains the set difference of the elements of two sequences
     *
     * @memberOf Ninq
     */
    except(other: Loopable<T>, comparer?: EqualityComparer<T>): Ninq<T>;
    /**
     * Returns the first element of a sequence, or a default value if the sequence contains no elements.
     *
     * @static
     * @template T - Itrable's elements' type
     * @param {Loopable<T>} it - Iterable to calculate avg for
     * @param {T} defValue
     * @param {Predicate<T>} [predicate] - A function to test each element for a condition
     * @returns defValue if source is empty; otherwise, the first element in source
     *
     * @memberOf Ninq
     */
    static firstOrDefault<T>(it: Loopable<T>, defValue: T, predicate?: Predicate<T>): T;
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
    static first<T>(it: Loopable<T>, predicate?: Predicate<T>): T;
    /**
     * Returns the first element of a sequence, or a default value if the sequence contains no elements.
     *
     * @param {T} defValue
     * @param {Predicate<T>} [predicate] - A function to test each element for a condition
     * @returns defValue if source is empty; otherwise, the first element in source
     *
     * @memberOf Ninq
     */
    firstOrDefault(defValue: T, predicate?: Predicate<T>): T;
    /**
     * Returns the first element in a sequence that satisfies a specified condition
     *
     * @param {Predicate<T>} [predicate] - A function to test each element for a condition
     * @returns The first element in the sequence that passes the test in the specified predicate function
     *
     * @memberOf Ninq
     */
    first(predicate?: Predicate<T>): T;
    /**
     * Filters a sequence of values based on a predicate
     *
     * @static
     * @template T
     * @param {Loopable<T>} it - An Iterable<T> to filter
     * @param {Predicate<T>} predicate - A function to test each element for a condition.
     * @returns {Iterable<T>} - An Iterable<T> that contains elements from the input sequence that satisfy the condition
     *
     * @memberOf Ninq
     */
    static filter<T>(it: Loopable<T>, predicate: Predicate<T>): Iterable<T>;
    /**
     * Filters the sequence of values based on a predicate
     *
     * @param {Predicate<T>} predicate - A function to test each element for a condition.
     * @returns - - A Ninq<T> that contains elements from the input sequence that satisfy the condition
     *
     * @memberOf Ninq
     */
    filter(predicate: Predicate<T>): Ninq<T>;
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
    static every<T>(it: Loopable<T>, predicate: Predicate<T>): boolean;
    /**
     * Determines whether all elements of a sequence satisfy a condition
     *
     * @param {Predicate<T>} predicate - A function to test each element for a condition
     * @returns true if every element of the source sequence passes the test in the specified predicate,
     * or if the sequence is empty; otherwise, false
     *
     * @memberOf Ninq
     */
    every(predicate: Predicate<T>): boolean;
    /**
     * Groups the elements of a sequence according to a key selector function.
     * 	The keys are compared by using a comparer and each group's elements are projected by using a specified function
     *
     * @static
     * @template T - The type of the elements of the iterable
     * @template TKey - The type of the key returned by keySelector
     * @param {Loopable<T>} it - An Iterable<T> whose elements to group
     * @param {Selector<T, TKey>} keySelector - A function to extract the key for each element
     * @param {EqualityComparer<TKey>} [comparer] - A comparer to compare keys
     * @returns {Iterable<Grouping<T, TKey>>} - An Iterable<Grouping<T, TKey>> where each Grouping<T, TKey>
     * 	object contains a collection of objects of type T and a key
     *
     * @memberOf Ninq
     */
    static groupBy<T, TKey>(it: Loopable<T>, keySelector: KeySelector<T, TKey>, comparer?: EqualityComparer<TKey>): Iterable<Grouping<T, TKey>>;
    /**
     * Groups the elements of a sequence according to a key selector function.
     * 	The keys are compared by using a comparer and each group's elements are projected by using a specified function
     *
     * @static
     * @template T - The type of the elements of the iterable
     * @template TKey - The type of the key returned by keySelector
     * @template TResult - The type of the elements in the result
     * @param {Loopable<T>} it - An Iterable<T> whose elements to group
     * @param {Selector<T, TKey>} keySelector - A function to extract the key for each element
     * @param {Selector<T, TResult>} elementSelector - A function to map each source element to an element in the result
     * @param {EqualityComparer<TKey>} [comparer] - A comparer to compare keys
     * @returns {Iterable<Grouping<TResult, TKey>>} - An Iterable<Grouping<TResult, TKey>> where each Grouping<TResult, TKey>
     * 	object contains a collection of objects of type TResult and a key
     *
     * @memberOf Ninq
     */
    static groupBy<T, TKey, TResult>(it: Loopable<T>, keySelector: KeySelector<T, TKey>, elementSelector: KeySelector<T, TResult>, comparer?: EqualityComparer<TKey>): Iterable<Grouping<TResult, TKey>>;
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
    groupBy<TKey, TResult>(keySelector: KeySelector<T, TKey>, elementSelector: KeySelector<T, TResult>, comparer?: EqualityComparer<TKey>): Ninq<Grouping<T, TKey>>;
    /**
     * Correlates the elements of two sequences based on key equality and groups the results.
     * 	A specified comparer is used to compare keys
     *
     * @static
     * @template TOuner
     * @template TInner
     * @template TKey
     * @param {Loopable<TOuner>} outer - The first sequence to join
     * @param {Loopable<TInner>} inner - The sequence to join to the first sequence
     * @param {Selector<TOuner, TKey>} outerSelector - A function to extract the join key from each element of the first sequence
     * @param {Selector<TInner, TKey>} innerSelector - A function to extract the join key from each element of the second sequence
     * @param {EqualityComparer<TKey>} [comparer] - A comparer to compare keys
     * @returns {Iterable<GroupJoinEntry<TOuner, TInner>>} - An Iterable<T> that contains elements of the result
     * 	that are obtained by performing a grouped join on two sequences
     *
     * @memberOf Ninq
     */
    static groupJoin<TOuner, TInner, TKey>(outer: Loopable<TOuner>, inner: Loopable<TInner>, outerSelector: KeySelector<TOuner, TKey>, innerSelector: KeySelector<TInner, TKey>, comparer?: EqualityComparer<TKey>): Iterable<GroupJoinEntry<TOuner, TInner>>;
    /**
     * Correlates the elements of two sequences based on key equality and groups the results.
     * 	A specified comparer is used to compare keys
     *
     * @static
     * @template TOuner
     * @template TInner
     * @template TKey
     * @template TResult
     * @param {Loopable<TOuner>} outer - The first sequence to join
     * @param {Loopable<TInner>} inner - The sequence to join to the first sequence
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
    static groupJoin<TOuner, TInner, TKey, TResult>(outer: Loopable<TOuner>, inner: Loopable<TInner>, outerSelector: KeySelector<TOuner, TKey>, innerSelector: KeySelector<TInner, TKey>, resultSelector: KeySelector<GroupJoinEntry<TOuner, TInner>, TResult>, comparer?: EqualityComparer<TKey>): Iterable<TResult>;
    /**
     * Correlates the elements of two sequences based on key equality and groups the results.
     * 	A specified comparer is used to compare keys
     *
     * @template TInner
     * @template TKey
     * @param {Loopable<TInner>} inner - The sequence to join to this sequence
     * @param {Selector<T, TKey>} keySelector - - A function to extract the join key from each element of this sequence
     * @param {Selector<TInner, TKey>} innerKeySelector - A function to extract the join key from each element of the inner sequence
     * @param {EqualityComparer<TKey>} [comparer] - A comparer to compare keys
     * @returns {Ninq<GroupJoinEntry<T, TInner>>} - A Ninq<GroupJoinEntry<T, TInner>> that contains elements of the result
     * 	that are obtained by performing a grouped join on two sequences
     *
     * @memberOf Ninq
     */
    groupJoin<TInner, TKey>(inner: Loopable<TInner>, keySelector: KeySelector<T, TKey>, innerKeySelector: KeySelector<TInner, TKey>, comparer?: EqualityComparer<TKey>): Ninq<GroupJoinEntry<T, TInner>>;
    /**
     * Correlates the elements of two sequences based on key equality and groups the results.
     * 	A specified comparer is used to compare keys
     *
     * @template TInner
     * @template TKey
     * @template TResult
     * @param {Loopable<TInner>} inner - The sequence to join to this sequence
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
    groupJoin<TInner, TKey, TResult>(inner: Loopable<TInner>, keySelector: KeySelector<T, TKey>, innerKeySelector: KeySelector<TInner, TKey>, resultSelecor: KeySelector<GroupJoinEntry<T, TInner>, TResult>, comparer?: EqualityComparer<TKey>): Ninq<TResult>;
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
    static includes<T>(it: Loopable<T>, item: T, comparer?: EqualityComparer<T>): boolean;
    /**
     * Determines whether the sequence contains a specified element
     *
     * @param {T} item - The value to locate in the sequence
     * @param {EqualityComparer<T>} [comparer] - An optional equality comparer to compare values
     * @returns true if the source sequence contains an element that has the specified value; otherwise, false
     *
     * @memberOf Ninq
     */
    includes(item: T, comparer?: EqualityComparer<T>): boolean;
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
    static intersect<T>(left: Loopable<T>, right: Loopable<T>): Set<T>;
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
    static intersect<T>(left: Loopable<T>, right: Loopable<T>, comparer: EqualityComparer<T>): Iterable<T>;
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
    /**
     * Correlates the elements of two sequences based on matching keys
     *
     *
     * @static
     * @template TOuter - The type of the elements of the first sequence
     * @template TInner - The type of the elements of the second sequence
     * @template TKey - The type of the keys returned by the key selector functions
     * @param {Loopable<TOuter>} outer - The first sequence to join
     * @param {Loopable<TInner>} inner - The sequence to join to the first sequence
     * @param {Mapping<TOuter, TKey>} outerKeySelector - A function to extract the join key from each element of the first sequence
     * @param {Mapping<TInner, TKey>} innerKeySelector - A function to extract the join key from each element of the second sequence
     * @param {EqualityComparer<TKey>} [comparer] - An optional comparer ro compare keys
     * @returns An Iterable<Iterable<JoinMatch<TOuter, TInner>>> that has elements of type TResult
     * 	that are obtained by performing an inner join on two sequences
     *
     * @memberOf Ninq
     */
    static join<TOuter, TInner, TKey>(outer: Loopable<TOuter>, inner: Loopable<TInner>, outerKeySelector: KeySelector<TOuter, TKey>, innerKeySelector: KeySelector<TInner, TKey>, comparer?: EqualityComparer<TKey>): Iterable<JoinMatch<TOuter, TInner>>;
    /**
     * Correlates the elements of two sequences based on matching keys
     *
     * @template TOther - The type of the elements of the second sequence
     * @template TKey - The type of the keys returned by the key selector functions
     * @param {Loopable<TOther>} other - The sequence to join to the first sequence
     * @param {Mapping<T, TKey>} keySelector - A function to extract the join key from each element of this sequence
     * @param {Mapping<TOther, TKey>} otherKeySelector - A function to extract the join key from each element of the other sequence
     * @param {EqualityComparer<TKey>} [comparer] - An optional comparer ro compare keys
     * @returns An Ninq<Iterable<JoinMatch<TOuter, TInner>>> that has elements of type TResult
     * 	that are obtained by performing an inner join on two sequences
     *
     * @memberOf Ninq
     */
    join<TOther, TKey>(other: Loopable<TOther>, keySelector: KeySelector<T, TKey>, otherKeySelector: KeySelector<TOther, TKey>, comparer?: EqualityComparer<TKey>): Ninq<JoinMatch<T, TOther>>;
    /**
     * Returns the last element of a sequence, or a default value if the sequence contains no elements
     *
     * @static
     * @template T - The type of the elements of it
     * @param {Loopable<T>} it - An Iterable<T> to return the last element of
     * @param {T} defValue - Default value to return in case the sequence is empty
     * @returns {T} - defValue if the source sequence is empty;
     * 	otherwise, the last element in the IEnumerable<T>
     *
     * @memberOf Ninq
     */
    static lastOrDefault<T>(it: Loopable<T>, defValue: T): T;
    /**
     * Returns the last element of a sequence that satisfies a condition or a default value if no such element is found
     *
     * @static
     * @template T - The type of the elements of it
     * @param {Loopable<T>} it - An Iterable<T> to return the last element of
     * @param {T} defValue - Default value to return in case no element satisfies the predicate
     * @param {Predicate<T>} predicate - A function to test each element for a condition
     * @returns {T} - defValue if the sequence is empty or if no elements pass the test in the predicate function;
     * 	otherwise, the last element that passes the test in the predicate function
     *
     * @memberOf Ninq
     */
    static lastOrDefault<T>(it: Loopable<T>, defValue: T, predicate: Predicate<T>): T;
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
    readonly length: number | undefined;
    /**
     * Projects each element of a sequence into a new form by incorporating the element's index
     *
     * @static
     * @template T - The type of the elements of it
     * @template TResult - The type of the value returned by mapping
     * @param {Loopable<T>} it - A sequence of values to invoke a transform function on
     * @param {Mapping<T, TResult>} mapping - A transform function to apply to each source element;
     * 	the second parameter of the function represents the index of the source element
     * @returns {Iterable<TResult>} - An Iterable<T> whose elements are the result of invoking the transform function on each element of this
     *
     * @memberOf Ninq
     */
    static map<T, TResult>(it: Loopable<T>, mapping: Mapping<T, TResult>): Iterable<TResult>;
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
    map<TResult>(mapping: Mapping<T, TResult>): Ninq<TResult>;
    /**
     * Flattens the sequences into one sequence, and invokes a result selector function on each element therein.
     * 	The index of each source element is used in the intermediate projected form of that element
     *
     * @static
     * @template T - The type of the elements of source
     * @template TResult - The type of the elements of the resulting sequence
     * @param {Loopable<Loopable<T>>} it - A sequence of values to project
     * @param {Mapping<T, TResult>} mapping - A transform function to apply to each element of the intermediate sequence
     * @returns {Iterable<TResult>} - An Iterable<TResult> whose elements are the result of invoking the mapping each
     * 	of the sequence elements to a result element
     *
     * @memberOf Ninq
     */
    static mapMany<T, TResult>(it: Loopable<Loopable<T>>, mapping: Mapping<T, TResult>): Iterable<TResult>;
    /**
     * Projects each element of a sequence to an Iterable<TCollection>,
     * 	flattens the resulting sequences into one sequence, and invokes a result selector function on each element therein.
     * 	The index of each source element is used in the intermediate projected form of that element
     *
     * @static
     * @template T - The type of the elements of source
     * @template TCollection - The type of the intermediate elements collected by sequenceMapping
     * @template TResult - The type of the elements of the resulting sequence
     * @param {Loopable<T>} it - A sequence of values to project
     * @param {Mapping<T, Iterable<TCollection>>} sequenceMapping - A transform function to apply to each source element;
     * 	the second parameter of the function represents the index of the source element
     * @param {Mapping<TCollection, TResult>} resultMapping - A transform function to apply to each element of the intermediate sequence
     * @returns {Iterable<TResult>} - An Iterable<TResult> whose elements are the result of invoking the one-to-many transform function
     * 	collectionSelector on each element of source and then mapping each of those sequence elements and
     * 	their corresponding source element to a result element
     *
     * @memberOf Ninq
     */
    static mapMany<T, TCollection, TResult>(it: Loopable<T>, sequenceMapping: Mapping<T, Iterable<TCollection>>, resultMapping: Mapping<TCollection, TResult>): Iterable<TResult>;
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
    mapMany<TCollection, TResult>(sequenceMapping: Mapping<T, Iterable<TCollection>>, resultMapping: Mapping<TCollection, TResult>): Ninq<TResult>;
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
    static range(count: number, start?: number, step?: number): IterableIterator<number>;
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
    static repeat<T>(element: T, count: number): IterableIterator<T>;
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
    static reduce<T, TResult>(it: Loopable<T>, reduction: ReductionFunc<T, TResult>): TResult | undefined;
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
    static reduce<T, TResult>(it: Loopable<T>, seed: TResult, reduction: ReductionFunc<T, TResult>): TResult;
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
    /**
     * Inverts the order of the elements in a sequence
     *
     * @static
     * @template T - The type of the elements of it
     * @param {Loopable<T>} iterable - A sequence of values to reverse
     * @returns {Iterable<T>} - A sequence whose elements correspond to those of the input sequence in reverse order
     *
     * @memberOf Ninq
     */
    static reverse<T>(iterable: Loopable<T>): Iterable<T>;
    /**
     * Inverts the order of the elements in the sequence
     *
     * @returns - A sequence whose elements correspond to those of the input sequence in reverse order
     *
     * @memberOf Ninq
     */
    reverse(): Ninq<T>;
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
    static sequenceEqual<T>(left: Loopable<T>, right: Loopable<T>, equalityComparer?: EqualityComparer<T>): boolean;
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
    static skipWhile<T>(it: Loopable<T>, predicate: Predicate<T>): Iterable<T>;
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
    skipWhile(predicate: Predicate<T>): Ninq<T>;
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
    static skip<T>(it: Loopable<T>, count: number): Iterable<T>;
    /**
     * Bypasses a specified number of elements in a sequence and then returns the remaining elements
     *
     * @param {number} count - The number of elements to skip before returning the remaining elements
     * @returns - An Iterable<T> that contains the elements that occur after the specified index in the input sequence
     *
     * @memberOf Ninq
     */
    skip(count: number): Ninq<T>;
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
    protected thenBy(comparer: Comparer<T>, descending?: boolean): SortedIterable<T>;
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
    /**
     * Computes the sum of the sequence of number values that are obtained by invoking a transform function
     * 	on each element of the input sequence
     *
     * @param {KeySelector<T, number>} selector - A transform function to apply to each element
     * @returns - The sum of the projected values
     *
     * @memberOf Ninq
     */
    sum(selector: KeySelector<T, number>): number;
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
    static takeWhile<T>(it: Loopable<T>, predicate: Predicate<T>): Iterable<T>;
    /**
     * - Returns elements from a sequence as long as a specified condition is true
     *
     * @param {Predicate<T>} predicate - A function to test each element for a condition
     * @returns - An Iterable<T> that contains the elements from the input sequence
     * 	that occur before the element at which the test no longer passes
     *
     * @memberOf Ninq
     */
    takeWhile(predicate: Predicate<T>): Ninq<T>;
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
    static take<T>(it: Loopable<T>, count: number): Iterable<T>;
    /**
     * Returns a specified number of contiguous elements from the start of this sequence
     *
     *
     * @param {number} count - The number of elements to return
     * @returns - An Iterable<T> that contains the specified number of elements from the start of the input sequence
     *
     * @memberOf Ninq
     */
    take(count: number): Ninq<T>;
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
    static toArray<T>(it: Loopable<T>): T[];
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
    static toLookup<T, TKey, TValue>(it: Loopable<T>, keySelector: KeySelector<T, TKey>, valueSelector: KeySelector<T, TValue>): Lookup<TKey, TValue>;
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
    toLookup<TKey, TValue>(keySelector: KeySelector<T, TKey>, valueSelector: KeySelector<T, TValue>): NinqLookup<TKey, TValue>;
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
    static toLookupObject<T, TValue>(it: Loopable<T>, keySelector: KeySelector<T, string>, valueSelector: KeySelector<T, TValue>): Hash<Iterable<TValue>>;
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
    toLookupObject<TValue>(keySelector: KeySelector<T, string>, valueSelector: KeySelector<T, TValue>): Hash<Ninq<TValue>>;
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
    static toMap<T, TKey, TValue>(it: Loopable<T>, keySelector: KeySelector<T, TKey>, valueSelector: KeySelector<T, TValue>): Map<TKey, TValue>;
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
    toMap<TKey, TValue>(keySelector: KeySelector<T, TKey>, valueSelector: KeySelector<T, TValue>): Map<TKey, TValue>;
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
    static toObject<T, TValue>(it: Loopable<T>, keySelector: KeySelector<T, string>, valueSelector: KeySelector<T, TValue>): Hash<TValue>;
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
    toObject<TValue>(keySelector: KeySelector<T, string>, valueSelector: KeySelector<T, TValue>): Hash<TValue>;
    /**
     * Creates an array from a Iterable<T>
     *
     * @returns {T[]} - An array that contains the elements from the input sequence
     *
     * @memberOf Ninq
     */
    toArray(): T[];
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
    static union<T>(left: Loopable<T>, right: Loopable<T>, comparer: EqualityComparer<T>): Iterable<T>;
    /**
     * Produces the set union of two sequences by using a specified comparer
     *
     * @param {Loopable<T>} other - An Iterable<T> whose distinct elements form the second set for the union
     * @param {EqualityComparer<T>} [comparer] - The comparer to compare values
     * @returns {Ninq<T>} - An Iterable<T> that contains the elements from both input sequences, excluding duplicates
     *
     * @memberOf Ninq
     */
    union(other: Loopable<T>, comparer?: EqualityComparer<T>): Ninq<T>;
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
}
export default Ninq;
