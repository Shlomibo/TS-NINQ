import { Selector, EqualityComparer } from '../types';
export interface Grouping<TKey, TElement> extends Iterable<TElement> {
	readonly key: TKey;
}

export default class GroupingIterable<TSource, TKey, TElement> implements Iterable<Grouping<TKey, TElement>> {
	constructor(
		private readonly iterable: Iterable<TSource>,
		private readonly keySelector: Selector<TSource, TKey>,
		private readonly elementSelector: Selector<TSource, TElement>,
		private readonly comparer?: EqualityComparer<TKey>
	) {
	}
	*[Symbol.iterator]() {
		let result: Map<TKey, TElement[]> | ([TKey, TElement[]])[];
		if (!this.comparer) {
			result = new Map();
			for (let item of this.iterable) {
				const key = this.keySelector(item);
				if (!result.has(key)) {
					result.set(key, [this.elementSelector(item)]);
				}
				else {
					const entry = result.get(key) as TElement[];
					entry.push(this.elementSelector(item));
				}
			}
		}
		else {
			result = [];
			for (let item of this.iterable) {
				const key = this.keySelector(item),
					entry = result.find(entry => !!this.comparer && this.comparer(key, entry[0]));
				if (entry) {
					entry[1].push(this.elementSelector(item));
				}
				else {
					result.push([key, [this.elementSelector(item)]]);
				}
			}
		}
		for (let entry of result) {
			yield Object.assign(entry[1], {
				key: entry[0]
			}) as Grouping<TKey, TElement>;
		}
	}
}