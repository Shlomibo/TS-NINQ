export class ZipIterable<T, U> implements Iterable<[T | undefined, U | undefined]> {
	constructor(
		private readonly left: Iterable<T>,
		private readonly right: Iterable<U>,
		private readonly throughAll = false
	) {
	}
	*[Symbol.iterator](): Iterator<[T | undefined, U | undefined]> {
		const [lIt, rIt] = [this.left, this.right]
			.map(x => x[Symbol.iterator]()) as [Iterator<T>, Iterator<U>];
		for (
			let left = lIt.next(), right = rIt.next();
			this.shouldIterate(left, right);
			left = left.done ? left : lIt.next(), right = right.done ? right : rIt.next()
		) {
			yield [
				left.done ? undefined : left.value,
				right.done ? undefined : right.value
			];
		}

	}
	private shouldIterate({done: lDone}: IteratorResult<T>, {done: rDone}: IteratorResult<U>) {
		return this.throughAll
			? (!lDone || !rDone)
			: (!lDone && !rDone);

	}
}