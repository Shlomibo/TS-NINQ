import { KeySelector, EqualityComparer } from '../types';
export interface GroupJoinEntry<TOuter, TInner> {
	outer: TOuter;
	inner: Iterable<TInner>;
}

export default class GroupJoinIterable<TOuter, TInner, TKey, TResult> implements Iterable<TResult> {
	constructor(
		private readonly outer: Iterable<TOuter>,
		private readonly inner: Iterable<TInner>,
		private readonly outerSelector: KeySelector<TOuter, TKey>,
		private readonly innerSelector: KeySelector<TInner, TKey>,
		private readonly resultSelector: KeySelector<GroupJoinEntry<TOuter, TInner>, TResult>,
		private readonly comparer?: EqualityComparer<TKey>
	) {
	}
	*[Symbol.iterator]() {
		let results: Iterable<[TKey, TInner[]]>;
		const comparer = this.comparer;
		if (!comparer) {
			const innerMap = new Map<TKey, TInner[]>();
			for (let innerItem of this.inner) {
				const key = this.innerSelector(innerItem),
					entry = innerMap.get(key) || [];
				entry.push(innerItem);
				innerMap.set(key, entry);
			}
			results = innerMap;
		}
		else {
			const entries = [] as [TKey, TInner[]][];
			for (let inner of this.inner) {
				const key = this.innerSelector(inner),
					entry = entries.find(([itemKey]) => comparer(key, itemKey));
				if (entry) {
					entry[1].push(inner);
				}
				else {
					entries.push([
						key,
						[inner]
					]);
				}
			}
			results = entries;
		}
		for (let outer of this.outer) {
			const key = this.outerSelector(outer),
				comparer = this.comparer;
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

			yield this.resultSelector({
				outer,
				inner: inner || []
			});
		}
	}
}