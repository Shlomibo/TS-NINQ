import { EqualityComparer } from '../types';

interface Tracker<T> {
	wasReturned(item: T): boolean;
}
class DefaultTracker<T> implements Tracker<T> {
	private readonly set = new Set<T>();
	wasReturned(item: T) {
		const result = this.set.has(item);
		this.set.add(item);
		return result;
	}
}
class ComparerTracker<T> implements Tracker<T> {
	private readonly prevItems = [] as T[];
	constructor(private readonly comparer: EqualityComparer<T>) { }
	wasReturned(item: T) {
		const result = 0 !== this.prevItems.filter(element => this.comparer(element, item)).length;
		if (!result) {
			this.prevItems.push(item);
		}
		return result;
	}
}

export default class DistinctIterable<T> implements Iterable<T> {
	private readonly tracker: () => Tracker<T>;

	constructor(
		private readonly it: Iterable<T>,
		comparer?: EqualityComparer<T>
	) {
		this.tracker = typeof comparer !== 'function'
			? () => new DefaultTracker<T>()
			: () => new ComparerTracker(comparer);
	}

	*[Symbol.iterator]() {
		const tracker = this.tracker();
		for (let item of this.it) {
			if (!tracker.wasReturned(item)) {
				yield item;
			}
		}
	}
}