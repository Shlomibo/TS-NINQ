import { Loopable } from '../types';
export default class ArrayLikeIterable<T> implements Iterable<T> {
	constructor(
		private readonly arrayLike: ArrayLike<T>,
		readonly continious = false
	) {
		if (!arrayLike ||
			(typeof arrayLike.length !== 'number') ||
			(arrayLike.length < 0)) {
			throw new TypeError();
		}
	}

	*[Symbol.iterator]() {
		const keys = new Set(Object.keys(this.arrayLike));
		for (let i = 0; i < this.arrayLike.length; i++) {
			if (this.continious ||
				keys.has(i.toString())) {

				yield this.arrayLike[i];
			}
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
export function isArrayLike<T>(obj: any): obj is ArrayLike<T> {
	return !!obj && (typeof obj.length === 'number') &&
		(obj.length >= 0) &&
		(obj.length !== Infinity) &&
		(Math.floor(obj.length) === obj.length);
}