
export interface TraverseMappingBase<T> {
	current: T;
	index: number;
	last: boolean;
}
export interface FirstTraverseMapping<T> extends TraverseMappingBase<T> {
	previous: undefined;
	first: true;
}
export interface LaterTraverseMapping<T> extends TraverseMappingBase<T> {
	previous: T;
	first: false;
}
export type TraverseMapping<T> = FirstTraverseMapping<T> | LaterTraverseMapping<T>;

export class TraversingIterable<T> implements Iterable<TraverseMapping<T>> {
	constructor(private it: Iterable<T>) { }

	*[Symbol.iterator](): Iterator<TraverseMapping<T>> {
		let previous: T | undefined,
			first = true,
			index = 0,
			it = this.it[Symbol.iterator](),
			current = it.next(),
			next = !current.done && it.next();
		try {
			for (; !current.done
				; current = next as any, next = it.next()) {

				try {
					const item = current.value;

					yield {
						current: item,
						index,
						first,
						previous,
						last: !next || next.done
					} as TraverseMapping<T>;

					first = false;
					previous = item;
				}
				catch (e) {
					if (it.throw) {
						current = next as any;
						next = it.throw(e);
					}
					else {
						throw e;
					}
				}
			}
		}
		finally {
			it && it.return && it.return();
		}
	}
}

export default TraversingIterable;
