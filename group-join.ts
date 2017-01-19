import { KeySelector, EqualityComparer, Loopable } from './core/declarations';
import { Ninq } from './core/ninq';
import ArrayLikeIterable from './core/array-like-iterable';
import { symbols } from './core/symbols';
const iterable = symbols.iterable;

export interface GroupJoinEntry<TOuter, TInner> {
	outer: TOuter;
	inner: Iterable<TInner>;
}

export default class GroupJoinIterable<TOuter, TInner, TKey, TResult> extends Ninq<TResult> {
	constructor(
		outer: Iterable<TOuter>,
		inner: Iterable<TInner>,
		outerSelector: KeySelector<TOuter, TKey>,
		innerSelector: KeySelector<TInner, TKey>,
		resultSelector: KeySelector<GroupJoinEntry<TOuter, TInner>, TResult>,
		comparer?: EqualityComparer<TKey>
	) {
		super({
			*[Symbol.iterator]() {
				let results: Iterable<[TKey, TInner[]]>;
				if (!comparer) {
					const innerMap = new Map<TKey, TInner[]>();
					for (let innerItem of inner) {
						const key = innerSelector(innerItem),
							entry = innerMap.get(key) || [];
						entry.push(innerItem);
						innerMap.set(key, entry);
					}
					results = innerMap;
				}
				else {
					const entries = [] as [TKey, TInner[]][];
					for (let innerItem of inner) {
						const key = innerSelector(innerItem),
							entry = entries.find(([itemKey]) => comparer(key, itemKey));
						if (entry) {
							entry[1].push(innerItem);
						}
						else {
							entries.push([
								key,
								[innerItem]
							]);
						}
					}
					results = entries;
				}
				for (let outerItem of outer) {
					const key = outerSelector(outerItem);
					let inner: TInner[] | undefined;

					if (!comparer) {
						inner = (results as Map<TKey, TInner[]>).get(key);
					}
					else {
						const entry = (results as [TKey, TInner[]][])
							.find(([innerKey]) => comparer(key, innerKey));
						if (entry) {
							inner = entry[1];
						}
					}

					yield resultSelector({
						outer: outerItem,
						inner: inner || []
					});
				}
			},
		});
	}
}

declare module './core/ninq' {
	namespace Ninq {
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
		export function groupJoin<TOuner, TInner, TKey>(
			outer: Loopable<TOuner>,
			inner: Loopable<TInner>,
			outerSelector: KeySelector<TOuner, TKey>,
			innerSelector: KeySelector<TInner, TKey>,
			comparer?: EqualityComparer<TKey>
		): Ninq<GroupJoinEntry<TOuner, TInner>>;
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
		export function groupJoin<TOuner, TInner, TKey, TResult>(
			outer: Loopable<TOuner>,
			inner: Loopable<TInner>,
			outerSelector: KeySelector<TOuner, TKey>,
			innerSelector: KeySelector<TInner, TKey>,
			resultSelector: KeySelector<GroupJoinEntry<TOuner, TInner>, TResult>,
			comparer?: EqualityComparer<TKey>
		): Ninq<TResult>;
	}

	interface Ninq<T> {
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
		groupJoin<TInner, TKey>(
			inner: Loopable<TInner>,
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
		groupJoin<TInner, TKey, TResult>(
			inner: Loopable<TInner>,
			keySelector: KeySelector<T, TKey>,
			innerKeySelector: KeySelector<TInner, TKey>,
			resultSelecor: KeySelector<GroupJoinEntry<T, TInner>, TResult>,
			comparer?: EqualityComparer<TKey>
		): Ninq<TResult>;
	}
}

Object.assign(Ninq, {
	groupJoin<TOuner, TInner, TKey, TResult>(
		outer: Loopable<TOuner>,
		inner: Loopable<TInner>,
		outerSelector: KeySelector<TOuner, TKey>,
		innerSelector: KeySelector<TInner, TKey>,
		resultSelectorOrComparer?: KeySelector<GroupJoinEntry<TOuner, TInner>, TResult> | EqualityComparer<TKey>,
		comparer?: EqualityComparer<TKey>
	): Ninq<TOuner> | Ninq<GroupJoinEntry<TOuner, TInner>> {
		[outer, inner] = [outer, inner].map(ArrayLikeIterable.toIterable) as [Iterable<TOuner>, Iterable<TInner>];
		if (!resultSelectorOrComparer || resultSelectorOrComparer.length === 2) {
			return new GroupJoinIterable(
				outer,
				inner,
				outerSelector,
				innerSelector,
				entry => entry,
				resultSelectorOrComparer as (EqualityComparer<TKey> | undefined)
			);
		}
		else {
			return new GroupJoinIterable(
				outer,
				inner,
				outerSelector,
				innerSelector,
				resultSelectorOrComparer as KeySelector<GroupJoinEntry<TOuner, TInner>, TResult>,
				comparer
			) as any;
		}
	}
});

Object.assign(Ninq.prototype, {
	groupJoin<T, TInner, TKey, TResult>(
		this: Ninq<T>,
		inner: Loopable<TInner>,
		keySelector: KeySelector<T, TKey>,
		innerKeySelector: KeySelector<TInner, TKey>,
		resultSelecorOrComparer?: KeySelector<GroupJoinEntry<T, TInner>, TResult> | EqualityComparer<TKey>,
		comparer?: EqualityComparer<TKey>
	) {
		let resultIterable: Iterable<TResult>;
		if (!resultSelecorOrComparer || resultSelecorOrComparer.length === 2) {
			resultIterable = Ninq.groupJoin(
				this[iterable],
				inner,
				keySelector,
				innerKeySelector,
				resultSelecorOrComparer as (EqualityComparer<TKey> | undefined)
			);
		}
		else {
			resultIterable = Ninq.groupJoin(
				this[iterable],
				inner,
				keySelector,
				innerKeySelector,
				resultSelecorOrComparer as KeySelector<GroupJoinEntry<T, TInner>, TResult>,
				comparer
			);
		}
		return resultIterable;
	}
});
