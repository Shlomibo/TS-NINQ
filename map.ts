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

export class MapManyIterable<TSource, TCollection, TResult> implements Iterable<TResult> {
	constructor(
		private readonly iterable: Iterable<TSource>,
		private readonly seqMapping: Mapping<TSource, Iterable<TCollection>>,
		private readonly resultMapping: Mapping<TCollection, TResult>
	) {
	}
	*[Symbol.iterator]() {
		let itemIndex = 0;
		for (let item of this.iterable) {
			const sequnce = this.seqMapping(item, itemIndex++);
			let resultIndex = 0;
			for (let resultItem of sequnce) {
				yield this.resultMapping(resultItem, resultIndex++);
			}
		}
	}
}