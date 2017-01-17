import { Predicate } from '../types';
export class SkippingIterable<T> implements Iterable<T> {
	constructor(
		private readonly iterable: Iterable<T>,
		private readonly predicate: Predicate<T>,
	) {
	}
	*[Symbol.iterator]() {
		let i = 0,
			isSkipping = true;
		for (let item of this.iterable) {
			isSkipping = isSkipping && this.predicate(item, i++);
			if (!isSkipping) {
				yield item;
			}
		}
	}
}