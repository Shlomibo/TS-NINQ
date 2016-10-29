export class ReverseIterable<T> implements Iterable<T> {
	constructor(private readonly iterable: Iterable<T>) {
	}
	*[Symbol.iterator]() {
		const [...elements] = this.iterable;
		for (let i = elements.length - 1; i >= 0; i--) {
			yield elements[i];
		}
	}
}