"use strict";
const concat_1 = require('./operators/concat');
const distinct_1 = require('./operators/distinct');
const except_1 = require('./operators/except');
const filter_1 = require('./operators/filter');
const group_by_1 = require('./operators/group-by');
const group_join_1 = require('./operators/group-join');
const intersect_1 = require('./operators/intersect');
const join_1 = require('./operators/join');
const sortBy_1 = require('./operators/sortBy');
const reverse_1 = require('./operators/reverse');
const map_1 = require('./operators/map');
const zip_1 = require('./operators/zip');
const skip_1 = require('./operators/skip');
const take_1 = require('./operators/take');
const union_1 = require('./operators/union');
const object_adapter_1 = require('./modules/object-adapter');
const array_like_iterable_1 = require('./modules/array-like-iterable');
const array_like_iterable_2 = require('./modules/array-like-iterable');
/**
 * Provides functionality around iterables.
 *
 * @export
 * @class Ninq
 * @implements {Iterable<T>}
 * @template T
 */
class Ninq {
    constructor(iterable) {
        this.iterable = iterable;
    }
    *[Symbol.iterator]() {
        const it = array_like_iterable_1.default.toIterable(this.iterable);
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
    static average(it, selector) {
        it = array_like_iterable_1.default.toIterable(it);
        return Ninq.reduce(it, (prev, item, index) => {
            const num = selector(item);
            if (index === 0) {
                return num;
            }
            else {
                prev *= index;
                return (num + prev) / (index + 1);
            }
        });
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
    average(selector) {
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
    static byKey(keySelector, comparer) {
        return (x, y) => {
            const xKey = keySelector(x), yKey = keySelector(y);
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
    cast() {
        return this;
    }
    static cast(it) {
        return it;
    }
    static concat(firstOrIterables, ...others) {
        let realIterables;
        if (Ninq.isLoopableOfLoopables(firstOrIterables)) {
            realIterables = firstOrIterables;
        }
        else {
            others.unshift(firstOrIterables);
            realIterables = others;
        }
        return new concat_1.default(Ninq.map(realIterables, array_like_iterable_1.default.toIterable));
    }
    static isLoopableOfLoopables(iterable) {
        if (iterable && !array_like_iterable_2.isIterable(iterable)) {
            return !!iterable[0] &&
                isLoopable(iterable[0]);
        }
        else if (iterable) {
            const iterator = iterable[Symbol.iterator](), { value, done } = iterator.next();
            try {
                return !done &&
                    isLoopable(value);
            }
            finally {
                iterator &&
                    iterator.return &&
                    iterator.return(undefined);
            }
        }
        return false;
        function isLoopable(value) {
            return value &&
                (typeof value[Symbol.iterator] === 'function' ||
                    value.length >= 0);
        }
    }
    concat(...iterables) {
        const realLoopables = Ninq.isLoopableOfLoopables(iterables[0])
            ? iterables[0]
            : iterables;
        return new Ninq(Ninq.concat(this.iterable, ...array_like_iterable_1.default.toIterable(realLoopables)));
    }
    static count(it, predicate) {
        let result = 0, index = 0;
        if (array_like_iterable_2.isArrayLike(it)) {
            if (!predicate) {
                return this.length;
            }
            it = array_like_iterable_1.default.toIterable(it);
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
    count(predicate) {
        return typeof predicate === 'function'
            ? Ninq.count(this.iterable, predicate)
            : Ninq.count(this.iterable);
    }
    static $default(x, defVal) {
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
    static defaultIfEmpty(it, defValue) {
        return Ninq.some(it)
            ? array_like_iterable_1.default.toIterable(it)
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
    defaultIfEmpty(defValue) {
        return this.some()
            ? this
            : new Ninq(Ninq.defaultIfEmpty(this.iterable, defValue));
    }
    static distinct(it, comparer) {
        it = array_like_iterable_1.default.toIterable(it);
        return typeof comparer === 'function'
            ? new distinct_1.default(it, comparer)
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
    distinct(comparer) {
        const iterable = typeof comparer === 'function'
            ? Ninq.distinct(this.iterable, comparer)
            : Ninq.distinct(this.iterable);
        return new Ninq(iterable);
    }
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
    static elementAtOrDefault(it, index, defValue) {
        let i = 0;
        if (array_like_iterable_2.isArrayLike(it)) {
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
    static elementAt(it, index) {
        const result = Ninq.elementAtOrDefault(it, index, '\0___ERR___\0');
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
    elementAtOrDefault(index, defValue) {
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
    elementAt(index) {
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
    static *empty() {
        ;
    }
    /**
     * Converts an ES6 generator into an async function that returns a promise.
     *
     * @static
     * @param {Generator<Promise<any>>} generator - The generator to convert
     * @returns {(...args: any[]) => Promise<any>} - An async function.
     *
     * @memberOf Ninq
     */
    static esync(generator) {
        return (...args) => {
            const it = generator(...args)[Symbol.iterator]();
            return Promise.resolve()
                .then(() => iterate(it.next()));
            function iterate(iterationResult) {
                const { done, value: resultOrPromise } = iterationResult;
                if (done) {
                    return resultOrPromise;
                }
                else {
                    return resultOrPromise.then(result => iterate(it.next(result)), err => iterate(it.throw(err)));
                }
            }
        };
    }
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
    static runEsync(generator, ...args) {
        return Ninq.esync(generator)(...args);
    }
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
    static except(left, right, comparer) {
        [left, right] = [left, right].map(array_like_iterable_1.default.toIterable);
        return new except_1.default(left, right, comparer);
    }
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
    except(other, comparer) {
        return new Ninq(Ninq.except(this.iterable, other, comparer));
    }
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
    static firstOrDefault(it, defValue, predicate) {
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
    static first(it, predicate) {
        const result = Ninq.firstOrDefault(it, '\0__ERR__\0', predicate);
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
    firstOrDefault(defValue, predicate) {
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
    first(predicate) {
        return Ninq.first(this.iterable, predicate);
    }
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
    static filter(it, predicate) {
        return new filter_1.default(array_like_iterable_1.default.toIterable(it), predicate);
    }
    /**
     * Filters the sequence of values based on a predicate
     *
     * @param {Predicate<T>} predicate - A function to test each element for a condition.
     * @returns - - A Ninq<T> that contains elements from the input sequence that satisfy the condition
     *
     * @memberOf Ninq
     */
    filter(predicate) {
        return new Ninq(Ninq.filter(this.iterable, predicate));
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
    static every(it, predicate) {
        let result = true;
        let i = 0;
        it = array_like_iterable_1.default.toIterable(it);
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
    every(predicate) {
        return Ninq.every(this.iterable, predicate);
    }
    static groupBy(it, keySelector, selectorOrComparer, comparer) {
        if (!comparer && (selectorOrComparer && selectorOrComparer.length === 2)) {
            comparer = selectorOrComparer;
            selectorOrComparer = undefined;
        }
        if (!selectorOrComparer) {
            selectorOrComparer = (x => x);
        }
        it = array_like_iterable_1.default.toIterable(it);
        return new group_by_1.default(it, keySelector, selectorOrComparer, comparer);
    }
    groupBy(keySelector, selectorOrComparer, comparer) {
        if (!comparer && (selectorOrComparer && selectorOrComparer.length === 2)) {
            comparer = selectorOrComparer;
            selectorOrComparer = undefined;
        }
        const resultIterable = selectorOrComparer
            ? Ninq.groupBy(this.iterable, keySelector, selectorOrComparer, comparer)
            : Ninq.groupBy(this.iterable, keySelector, comparer);
        return new Ninq(resultIterable);
    }
    static groupJoin(outer, inner, outerSelector, innerSelector, resultSelectorOrComparer, comparer) {
        [outer, inner] = [outer, inner].map(array_like_iterable_1.default.toIterable);
        if (!resultSelectorOrComparer || resultSelectorOrComparer.length === 2) {
            return new group_join_1.default(outer, inner, outerSelector, innerSelector, entry => entry, resultSelectorOrComparer);
        }
        else {
            return new group_join_1.default(outer, inner, outerSelector, innerSelector, resultSelectorOrComparer, comparer);
        }
    }
    groupJoin(inner, keySelector, innerKeySelector, resultSelecorOrComparer, comparer) {
        let resultIterable;
        if (!resultSelecorOrComparer || resultSelecorOrComparer.length === 2) {
            resultIterable = Ninq.groupJoin(this.iterable, inner, keySelector, innerKeySelector, resultSelecorOrComparer);
        }
        else {
            resultIterable = Ninq.groupJoin(this.iterable, inner, keySelector, innerKeySelector, resultSelecorOrComparer, comparer);
        }
        return new Ninq(resultIterable);
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
    static includes(it, item, comparer) {
        it = array_like_iterable_1.default.toIterable(it);
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
    includes(item, comparer) {
        return Ninq.includes(this.iterable, item, comparer);
    }
    static intersect(left, right, comparer) {
        [left, right] = [left, right].map(array_like_iterable_1.default.toIterable);
        if (comparer) {
            return new intersect_1.default(left, right, comparer);
        }
        const leftSet = left instanceof Set
            ? left
            : new Set(left);
        const result = new Set();
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
     * @param {Loopable<T>} other - An Iterable<T> whose distinct elements that also appear in the left sequence will be returned
     * @param {EqualityComparer<T>} [comparer] - An optional comparer to compare values
     * @returns - A sequence that contains the elements that form the set intersection of two sequences
     *
     * @memberOf Ninq
     */
    intersect(other, comparer) {
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
    static join(outer, inner, outerKeySelector, innerKeySelector, comparer) {
        [outer, inner] = [outer, inner].map(array_like_iterable_1.default.toIterable);
        return new join_1.default(outer, inner, outerKeySelector, innerKeySelector, comparer);
    }
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
    join(other, keySelector, otherKeySelector, comparer) {
        return new Ninq(Ninq.join(this.iterable, other, keySelector, otherKeySelector, comparer));
    }
    static lastOrDefault(it, defValue, predicate) {
        if (array_like_iterable_2.isArrayLike(it)) {
            if (!predicate) {
                return it[it.length - 1];
            }
            it = array_like_iterable_1.default.toIterable(it);
        }
        if (predicate) {
            it = Ninq.filter(it, predicate);
        }
        let result = defValue;
        for (result of it) {
            ;
        }
        return result;
    }
    lastOrDefault(defValue, predicate) {
        return predicate
            ? Ninq.lastOrDefault(this.iterable, defValue, predicate)
            : Ninq.lastOrDefault(this.iterable, defValue);
    }
    static last(it, predicate) {
        const result = predicate
            ? Ninq.lastOrDefault(it, '\0__ERROR__\0', predicate)
            : Ninq.lastOrDefault(it, '\0__ERROR__\0');
        if (result === '\0__ERROR__\0') {
            throw new Error('No values returned from iterable');
        }
        return result;
    }
    last(predicate) {
        return predicate
            ? Ninq.last(this.iterable, predicate)
            : Ninq.last(this.iterable);
    }
    get length() {
        if (!array_like_iterable_2.isArrayLike(this.iterable)) {
            return undefined;
        }
        return this.iterable.length;
    }
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
    static map(it, mapping) {
        it = array_like_iterable_1.default.toIterable(it);
        return new map_1.MappingIterable(it, mapping);
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
    map(mapping) {
        const it = Ninq.map(this.iterable, mapping);
        return new Ninq(it);
    }
    static mapMany(it, seqOrResMapping, resultMapping) {
        it = array_like_iterable_1.default.toIterable(it);
        if (!resultMapping) {
            resultMapping = seqOrResMapping;
            seqOrResMapping = x => x;
        }
        return new map_1.MapManyIterable(it, seqOrResMapping, resultMapping);
    }
    mapMany(seqOrResMapping, resultMapping) {
        if (!resultMapping) {
            resultMapping = seqOrResMapping;
            seqOrResMapping = x => x;
        }
        const it = Ninq.mapMany(this.iterable, seqOrResMapping, resultMapping);
        return new Ninq(it);
    }
    static max(it, valSelector) {
        it = array_like_iterable_1.default.toIterable(it);
        const selector = valSelector || (x => x);
        return Ninq.reduce(it, (max, current) => Math.max(Ninq.$default(max, -Infinity), selector(current)));
    }
    max(valSelector) {
        return valSelector
            ? Ninq.max(this.iterable, valSelector)
            : Ninq.max(this.iterable);
    }
    static min(it, valSelector) {
        const selector = valSelector || (x => x);
        return Ninq.reduce(it, (min, current) => Math.min(Ninq.$default(min, Infinity), selector(current)));
    }
    min(valSelector) {
        return valSelector
            ? Ninq.min(this.iterable, valSelector)
            : Ninq.min(this.iterable);
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
    static *range(count, start = 0, step = 1) {
        for (let i = start; shouldIterate(i); i += step) {
            yield i;
        }
        function shouldIterate(i) {
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
    static *repeat(element, count) {
        if (count < 0) {
            throw new Error('count must be greater or equal to zero');
        }
        for (let i = 0; i < count; i++) {
            yield element;
        }
    }
    static reduce(it, seedOrReduc, reduc) {
        const reduction = typeof reduc === 'function'
            ? reduc
            : seedOrReduc;
        let result = typeof reduc === 'function'
            ? seedOrReduc
            : undefined;
        let i = 0;
        it = array_like_iterable_1.default.toIterable(it);
        for (let item of it) {
            result = reduction(result, item, i);
            i++;
        }
        return result;
    }
    reduce(seedOrReduc, reduc) {
        return typeof reduc === 'function'
            ? Ninq.reduce(this.iterable, seedOrReduc, reduc)
            : Ninq.reduce(this.iterable, seedOrReduc);
    }
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
    static reverse(iterable) {
        return new reverse_1.ReverseIterable(array_like_iterable_1.default.toIterable(iterable));
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
        return new Ninq(iterable);
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
    static sequenceEqual(left, right, equalityComparer) {
        const comparer = equalityComparer || ((x, y) => x === y);
        return Ninq.every(Ninq.zip(left, right), ([left, right]) => comparer(left, right));
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
    sequenceEqual(other, equalityComparer) {
        return Ninq.sequenceEqual(this.iterable, other, equalityComparer);
    }
    static singleOrDefault(it, defVal, predicate) {
        if (predicate) {
            it = Ninq.filter(it, predicate);
        }
        else {
            it = array_like_iterable_1.default.toIterable(it);
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
    singleOrDefault(defVal, predicate) {
        return Ninq.singleOrDefault(this.iterable, predicate);
    }
    static single(it, predicate) {
        const result = Ninq.singleOrDefault(it, '\0__ERROR__\0', predicate);
        if (result === '\0__ERROR__\0') {
            throw new Error('Empty sequence');
        }
        return result;
    }
    single(predicate) {
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
    static skipWhile(it, predicate) {
        return new skip_1.SkippingIterable(array_like_iterable_1.default.toIterable(it), predicate);
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
    skipWhile(predicate) {
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
    static skip(it, count) {
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
    skip(count) {
        const iterable = Ninq.skip(this.iterable, count);
        return new Ninq(iterable);
    }
    static some(it, prediacte) {
        if (array_like_iterable_2.isArrayLike(it)) {
            if (!prediacte) {
                return it.length > 0;
            }
            it = array_like_iterable_1.default.toIterable(it);
        }
        return typeof prediacte === 'function'
            ? !Ninq.every(it, (item, i) => !prediacte(item, i))
            : !it[Symbol.iterator]()
                .next()
                .done;
    }
    some(prediacte) {
        return typeof prediacte === 'function'
            ? Ninq.some(this.iterable, prediacte)
            : Ninq.some(this);
    }
    static sortBy(iterable, comparerOrDesc, descending) {
        let comparer;
        [comparer, descending] = !comparerOrDesc || typeof comparerOrDesc === 'boolean'
            ? [
                    (x, y) => x < y ? -1 :
                    x === y ? 0 :
                        1,
                comparerOrDesc || descending
            ]
            : [comparerOrDesc, descending];
        iterable = array_like_iterable_1.default.toIterable(iterable);
        return new sortBy_1.SortingIterable(iterable, comparer, descending);
    }
    sortBy(compOrDesc, descending) {
        let comparer;
        [comparer, descending] = !compOrDesc || (typeof compOrDesc === 'boolean')
            ? [defaultComparer, !!(compOrDesc || descending)]
            : [compOrDesc, !!descending];
        const resultIterable = Ninq.sortBy(this.iterable, comparer, descending);
        return new Ninq(resultIterable);
        function defaultComparer(x, y) {
            return x < y ? -1 :
                x === y ? 0 :
                    1;
        }
    }
    // Used for sorted ninq objects.
    // tslint:disable-next-line
    thenBy(comparer, descending) {
        const iterable = this.iterable;
        if (!sortBy_1.isSortedIterable(iterable)) {
            throw new TypeError('Can only be called with sorted iterables');
        }
        return iterable.thenBy(comparer, descending);
    }
    static sum(it, selector) {
        const keySelector = selector || ((x) => x);
        return Ninq.reduce(it, 0, (sum, item) => sum + keySelector(item));
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
    sum(selector) {
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
    static takeWhile(it, predicate) {
        return new take_1.TakeWhileIterable(array_like_iterable_1.default.toIterable(it), predicate);
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
    takeWhile(predicate) {
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
    static take(it, count) {
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
    take(count) {
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
    static toArray(it) {
        if (it instanceof Array) {
            return it;
        }
        const [...result] = array_like_iterable_1.default.toIterable(it);
        return result;
    }
    static toLookup(it, keySelector, vs) {
        const valueSelector = vs || (x => x);
        const result = new Map();
        it = array_like_iterable_1.default.toIterable(it);
        for (const item of it) {
            const key = keySelector(item), value = valueSelector(item), list = result.get(key);
            if (!list) {
                result.set(key, [value]);
            }
            else {
                list.push(value);
            }
        }
        return result;
    }
    toLookup(keySelector, vs) {
        const result = Ninq.toLookup(this.iterable, keySelector, vs);
        for (const [key, value] of result.entries()) {
            result.set(key, new Ninq(value));
        }
        return result;
    }
    static toLookupObject(it, keySelector, vs) {
        const valueSelector = vs || (x => x);
        const result = {};
        it = array_like_iterable_1.default.toIterable(it);
        for (const item of it) {
            const key = keySelector(item), value = valueSelector(item), list = result[key] || [];
            list.push(value);
            result[key] = list;
        }
        return result;
    }
    toLookupObject(keySelector, vs) {
        const obj = Ninq.toLookupObject(this.iterable, keySelector, vs);
        Object.keys(obj)
            .forEach(key => obj[key] = new Ninq(obj[key]));
        return obj;
    }
    static toMap(it, keySelector, vs) {
        const valueSelector = vs || (x => x);
        const result = new Map();
        it = array_like_iterable_1.default.toIterable(it);
        for (const item of it) {
            const key = keySelector(item), value = valueSelector(item);
            result.set(key, value);
        }
        return result;
    }
    toMap(keySelector, vs) {
        const map = Ninq.toMap(this.iterable, keySelector, vs);
        return object_adapter_1.adaptTo(new Ninq(map), map);
    }
    static toObject(it, keySelector, vs) {
        const valueSelector = vs || (x => x);
        const result = {};
        it = array_like_iterable_1.default.toIterable(it);
        for (const item of it) {
            const key = keySelector(item), value = valueSelector(item);
            result[key] = value;
        }
        return result;
    }
    toObject(keySelector, vs) {
        return Ninq.toObject(this.iterable, keySelector, vs);
    }
    /**
     * Creates an array from a Iterable<T>
     *
     * @returns {T[]} - An array that contains the elements from the input sequence
     *
     * @memberOf Ninq
     */
    toArray() {
        return Ninq.toArray(this.iterable);
    }
    static union(left, right, comparer) {
        [left, right] = [left, right].map(array_like_iterable_1.default.toIterable);
        if (comparer) {
            return new union_1.UnionIterable(left, right, comparer);
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
     * Produces the set union of two sequences by using a specified comparer
     *
     * @param {Loopable<T>} other - An Iterable<T> whose distinct elements form the second set for the union
     * @param {EqualityComparer<T>} [comparer] - The comparer to compare values
     * @returns {Ninq<T>} - An Iterable<T> that contains the elements from both input sequences, excluding duplicates
     *
     * @memberOf Ninq
     */
    union(other, comparer) {
        return new Ninq(Ninq.union(this.iterable, other, comparer));
    }
    static zip(left, right, throughAll) {
        [left, right] = [left, right].map(array_like_iterable_1.default.toIterable);
        return new zip_1.ZipIterable(left, right, throughAll);
    }
    zip(other, throughAll) {
        const it = Ninq.zip(this.iterable, other);
        return new Ninq(it);
    }
}
exports.Ninq = Ninq;
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Ninq;
//# sourceMappingURL=ninq.js.map