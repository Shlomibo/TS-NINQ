export default class ConcatIterable<T> implements Iterable<T> {

	constructor(
		private readonly iterables: Iterable<Iterable<T>>
	) {
		for (let iterable of iterables) {
			if (!iterable || (typeof iterable[Symbol.iterator] !== 'function')) {
				throw new Error("Iterable is't iterable");
			}
		}
	}
	*[Symbol.iterator]() {
		for (let iterable of this.iterables) {
			yield *iterable;
		}
	}
}