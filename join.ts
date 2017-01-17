import { KeySelector, EqualityComparer } from '../types';

export interface JoinMatch<TOuter, TInner> {
	outer: TOuter;
	inner: TInner;
};

export default class JoinIterable<TOuter, TInner, TKey> implements Iterable<JoinMatch<TOuter, TInner>> {

	constructor(
		private readonly outer: Iterable<TOuter>,
		private readonly inner: Iterable<TInner>,
		private readonly outerKeySelector: KeySelector<TOuter, TKey>,
		private readonly innerKeySelector: KeySelector<TInner, TKey>,
		private readonly comparer?: EqualityComparer<TKey>
	) {
	}

	*[Symbol.iterator]() {
		yield* this.comparer
			? this.iterateWithComparer()
			: this.iterateWithMap();
	}

	private *iterateWithMap(): Iterable<JoinMatch<TOuter, TInner>> {
		const mapping = new Map<TKey, TOuter>();
		for (let outerItem of this.outer) {
			mapping.set(
				this.outerKeySelector(outerItem),
				outerItem
			);
		}
		for (let innerItem of this.inner) {
			const key = this.innerKeySelector(innerItem),
				outerItem = mapping.get(key);
			if (outerItem) {
				yield {
					outer: outerItem,
					inner: innerItem,
				};
			}
		}
	}

	private *iterateWithComparer(): Iterable<JoinMatch<TOuter, TInner>> {
		const comparer = this.comparer,
			entries = [] as [TKey, TOuter][];
		if (!comparer) {
			throw new Error('Missing comparer');
		}
		for (let outerItem of this.outer) {
			entries.push([
				this.outerKeySelector(outerItem),
				outerItem
			]);
		}
		for (let innerItem of this.inner) {
			const key = this.innerKeySelector(innerItem),
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