import { Mapping } from '../types';
export class MappingIterable<TSource, TResult> implements Iterable<TResult> {
	constructor(
		private readonly iterable: Iterable<TSource>,
		private readonly mapping: Mapping<TSource, TResult>
	) {
	}
	*[Symbol.iterator]() {
		let i = 0;
		for (let item of this.iterable) {
			yield this.mapping(item, i++);
		}
	}
}