import { Predicate } from '../types';
export class SkippingIterable<T> implements Iterable<T> {
	constructor(
		private readonly iterable: Iterable<T>,
		private readonly predicate: Predicate<T>,
	) {
	}
	*[Symbol.iterator]() {
		let i = 0;
		for (let item of this.iterable) {
			if (!this.predicate(item, i++)) {
				yield item;
			}
		}
	}
}