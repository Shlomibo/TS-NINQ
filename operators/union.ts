import { EqualityComparer } from '../types';
import { ComparerTracker } from './distinct';

export class UnionIterable<T> implements Iterable<T> {
	constructor(
		private readonly left: Iterable<T>,
		private readonly right: Iterable<T>,
		private readonly comparer: EqualityComparer<T>
	) {
	}
	*[Symbol.iterator]() {
		const tracker = new ComparerTracker(this.comparer, this.left);
		for (const item of this.right) {
			if (!tracker.wasReturned(item)) {
				yield item;
			}
		}
	}
}