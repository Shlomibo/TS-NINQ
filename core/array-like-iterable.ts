import { Loopable } from './declarations';

export default class ArrayLikeIterable<T> implements Iterable<T> {
	constructor(
		protected readonly arrayLike: ArrayLike<T>,
		readonly startIndex = 0,
		readonly maxCount = Infinity,
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
		for (let i = this.startIndex;
			(i < this.arrayLike.length) &&
			(i < this.maxCount);
			i++
		) {
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

export class ReverseArrayLikeIterable<T> extends ArrayLikeIterable<T> {
	constructor(
		arrayLike: ArrayLike<T>,
		startIndex?: number,
		maxCount?: number,
		continious?: boolean,
	) {
		startIndex = typeof startIndex === 'number'
			? startIndex
			: arrayLike.length - 1;
		super(arrayLike, startIndex, maxCount, continious);
	}

	*[Symbol.iterator]() {
		const keys = new Set(Object.keys(this.arrayLike));
		for (let i = this.startIndex, count = 0;
			i >= 0 && count < this.maxCount;
			i-- , count++
		) {
			if (this.continious ||
				keys.has(i.toString())) {

				yield this.arrayLike[i];
			}
		}
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

export function isLoopable<T>(obj: any): obj is Loopable<T> {
	return !!obj && (isIterable(obj) || isArrayLike(obj));
}
