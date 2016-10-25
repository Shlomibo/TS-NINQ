import { Predicate } from '../types';
export default class FilterIterable<T> implements Iterable<T> {
	constructor(
		private readonly it: Iterable<T>,
		private readonly predicate: Predicate<T>
	) {
	}
	*[Symbol.iterator]() {
		let i = 0;
		for (let item of this.it) {
			if (this.predicate(item, i++)) {
				yield item;
			}
		}
	}
}