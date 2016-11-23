import { Loopable } from '../types';
export default class ArrayLikeIterable<T> implements Iterable<T> {
	constructor(private readonly arrayLike: ArrayLike<T>) {
		if (!arrayLike ||
			(typeof arrayLike.length !== 'number') ||
			(arrayLike.length < 0)) {
			throw new TypeError();
		}
	}

	*[Symbol.iterator]() {
		for (let i = 0; i < this.arrayLike.length; i++) {
			yield this.arrayLike[i];
		}
	}

	static toIterable<T>(it: Loopable<T>): Iterable<T> {
		return isIterable(it)
			? it
			: new ArrayLikeIterable(it);
	}
}

export function isIterable<T>(obj: any): obj is Iterable<T> {
	return !!obj && (typeof obj[Symbol.iterator] === 'function');
}