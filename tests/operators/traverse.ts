
export interface FirstTraverseMapping<T> {
	current: T;
	index: number;
	first: true;
}
export interface LaterTraverseMapping<T> {
	current: T;
	index: number;
	previous: T;
	first: false;
}
export type TraverseMapping<T> = FirstTraverseMapping<T> | LaterTraverseMapping<T>;

export class TraversingIterable<T> implements Iterable<TraverseMapping<T>> {
	constructor(private it: Iterable<T>) { }

	*[Symbol.iterator](): Iterator<TraverseMapping<T>> {
		let previous: T | undefined,
			first = true,
			index = 0;
		for (let item of this.it) {
			yield {
				current: item,
				index,
				first,
				previous,
			} as TraverseMapping<T>;

			first = false;
			previous = item;
		}
	}
}

export default TraversingIterable;
