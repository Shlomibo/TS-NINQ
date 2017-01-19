import { KeySelector, EqualityComparer, Loopable } from './core/declarations';
import { Ninq } from './core/ninq';
import ArrayLikeIterable from './core/array-like-iterable';
import { symbols } from './core/symbols';
const iterable = symbols.iterable;

export interface JoinMatch<TOuter, TInner> {
	outer: TOuter;
	inner: TInner;
};

export default class JoinIterable<TOuter, TInner, TKey> extends Ninq<JoinMatch<TOuter, TInner>> {
	constructor(
		outer: Iterable<TOuter>,
		inner: Iterable<TInner>,
		outerKeySelector: KeySelector<TOuter, TKey>,
		innerKeySelector: KeySelector<TInner, TKey>,
		comparer?: EqualityComparer<TKey>
	) {
		super(!!comparer
			? iterateWithComparer()
			: iterateWithMap()
		);

		function* iterateWithMap(): Iterable<JoinMatch<TOuter, TInner>> {
			const mapping = new Map<TKey, TOuter>();
			for (let outerItem of outer) {
				mapping.set(
					outerKeySelector(outerItem),
					outerItem
				);
			}
			for (let innerItem of inner) {
				const key = innerKeySelector(innerItem),
					outerItem = mapping.get(key);
				if (outerItem) {
					yield {
						outer: outerItem,
						inner: innerItem,
					};
				}
			}
		}

		function* iterateWithComparer(): Iterable<JoinMatch<TOuter, TInner>> {
			const entries = [] as [TKey, TOuter][];
			if (!comparer) {
				throw new Error('Missing comparer');
			}
			for (let outerItem of outer) {
				entries.push([
					outerKeySelector(outerItem),
					outerItem
				]);
			}
			for (let innerItem of inner) {
				const key = innerKeySelector(innerItem),
					outerEntry = entries.find(([outerKey]) => comparer(outerKey, key));
				if (outerEntry) {
					const [, outer] = outerEntry;
					yield {
						inner: innerItem,
						outer
					};
				}
			}
		}
	}
}

declare module './core/ninq' {
	namespace Ninq {
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
		export function join<TOuter, TInner, TKey>(
			outer: Loopable<TOuter>,
			inner: Loopable<TInner>,
			outerKeySelector: KeySelector<TOuter, TKey>,
			innerKeySelector: KeySelector<TInner, TKey>,
			comparer?: EqualityComparer<TKey>
		): Ninq<JoinMatch<TOuter, TInner>>;
	}
	interface Ninq<T> {
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
		join<TOther, TKey>(
			other: Loopable<TOther>,
			keySelector: KeySelector<T, TKey>,
			otherKeySelector: KeySelector<TOther, TKey>,
			comparer?: EqualityComparer<TKey>
		): Ninq<T>;
	}
}

Object.defineProperties(Ninq, {
	join<TOuter, TInner, TKey>(
		outer: Loopable<TOuter>,
		inner: Loopable<TInner>,
		outerKeySelector: KeySelector<TOuter, TKey>,
		innerKeySelector: KeySelector<TInner, TKey>,
		comparer?: EqualityComparer<TKey>
	): Ninq<JoinMatch<TOuter, TInner>> {
		[outer, inner] = [outer, inner].map(ArrayLikeIterable.toIterable) as [Iterable<TOuter>, Iterable<TInner>];
		return new JoinIterable(
			outer,
			inner,
			outerKeySelector,
			innerKeySelector,
			comparer
		);
	}
});
Object.defineProperties(Ninq.prototype, {
	join<T, TOther, TKey>(
		this: Ninq<T>,
		other: Loopable<TOther>,
		keySelector: KeySelector<T, TKey>,
		otherKeySelector: KeySelector<TOther, TKey>,
		comparer?: EqualityComparer<TKey>
	) {
		return new Ninq(Ninq.join(
			this[iterable],
			other,
			keySelector,
			otherKeySelector,
			comparer
		));
	}
});
