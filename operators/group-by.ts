import { KeySelector, EqualityComparer } from '../core/declarations';
import { Ninq } from '../core/ninq';
import { Loopable } from '../core/declarations';
import ArrayLikeIterable from '../core/array-like-iterable';
import { iterable } from '../core/symbols';

export interface Grouping<TKey, TElement> extends Iterable<TElement> {
	readonly key: TKey;
}

class GroupingIterable<TSource, TKey, TElement> extends Ninq<Grouping<TKey, TElement>> {
	constructor(
		iterable: Iterable<TSource>,
		keySelector: KeySelector<TSource, TKey>,
		elementSelector: KeySelector<TSource, TElement>,
		comparer?: EqualityComparer<TKey>
	) {
		super({
			*[Symbol.iterator]() {
				let result: Map<TKey, TElement[]> | ([TKey, TElement[]])[];
				if (!comparer) {
					result = new Map();
					for (let item of iterable) {
						const key = keySelector(item);
						if (!result.has(key)) {
							result.set(key, [elementSelector(item)]);
						}
						else {
							const entry = result.get(key) as TElement[];
							entry.push(elementSelector(item));
						}
					}
				}
				else {
					result = [];
					for (let item of iterable) {
						const key = keySelector(item),
							entry = result.find(entry => comparer!(key, entry[0]));
						if (entry) {
							entry[1].push(elementSelector(item));
						}
						else {
							result.push([key, [elementSelector(item)]]);
						}
					}
				}
				for (let entry of result) {
					yield Object.assign(entry[1], {
						key: entry[0]
					}) as Grouping<TKey, TElement>;
				}
			},
		});
	}
}

declare module '../core/ninq' {
	namespace Ninq {
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
		export function groupBy<T, TKey>(
			it: Loopable<T>,
			keySelector: KeySelector<T, TKey>,
			comparer?: EqualityComparer<TKey>
		): Ninq<Grouping<T, TKey>>;
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
		export function groupBy<T, TKey, TResult>(
			it: Loopable<T>,
			keySelector: KeySelector<T, TKey>,
			elementSelector: KeySelector<T, TResult>,
			comparer?: EqualityComparer<TKey>
		): Ninq<Grouping<TResult, TKey>>;
	}
	interface Ninq<T> {
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
	}
}

Object.assign(Ninq, {
	groupBy<T, TKey, TResult>(
		it: Loopable<T>,
		keySelector: KeySelector<T, TKey>,
		selectorOrComparer: KeySelector<T, TResult> | EqualityComparer<TKey> | undefined,
		comparer?: EqualityComparer<TKey>
	): Ninq<Grouping<TKey, TResult>> {
		if (!comparer && (selectorOrComparer && selectorOrComparer.length === 2)) {
			comparer = selectorOrComparer as EqualityComparer<TKey>;
			selectorOrComparer = undefined;
		}
		if (!selectorOrComparer) {
			selectorOrComparer = (x => x as any) as KeySelector<T, TResult>;
		}

		it = ArrayLikeIterable.toIterable(it);
		return new GroupingIterable<T, TKey, TResult>(
			it,
			keySelector,
			selectorOrComparer as KeySelector<T, TResult>,
			comparer
		);
	}
});
Object.assign(Ninq.prototype, {
	groupBy<T, TKey, TResult>(
		this: Ninq<T>,
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
				this[iterable],
				keySelector,
				selectorOrComparer as KeySelector<T, TResult>,
				comparer
			)
			: Ninq.groupBy(
				this[iterable],
				keySelector,
				comparer
			);
		return resultIterable;
	}
});
