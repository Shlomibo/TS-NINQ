import { EqualityComparer } from '../types';
export default class ExceptIterable<T> implements Iterable<T> {

	constructor(
		private readonly left: Iterable<T>,
		private readonly right: Iterable<T>,
		private readonly comparer?: EqualityComparer<T>
	) {
	}
	*[Symbol.iterator]() {
		if (this.comparer) {
			let [...result] = new Set(this.left);
			for (let rightItem of this.right) {
				result = result.filter(leftItem =>
					this.comparer && !this.comparer(leftItem, rightItem)
				);
			}
			yield* result;
		}
		else {
			let lSet = new Set(this.left),
				rSet = new Set(this.right);
			for (let item of lSet) {
				if (!rSet.has(item)) {
					yield item;
				}
			}
		}
	}
}