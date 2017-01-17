import { EqualityComparer } from '../types';
import { ComparerTracker } from './distinct';

export default class IntersectionIterator<T> implements Iterable<T> {

	constructor(
		private readonly left: Iterable<T>,
		private readonly right: Iterable<T>,
		private readonly comparer: EqualityComparer<T>
	) {
	}

	*[Symbol.iterator]() {
		const [...left] = this.left,
			tracker = new ComparerTracker(this.comparer);
		for (let rightItem of this.right) {
			if (left.some(leftItem => this.comparer(leftItem, rightItem)) &&
				!tracker.wasReturned(rightItem)) {

				yield rightItem;
			}
		}
	}
}
