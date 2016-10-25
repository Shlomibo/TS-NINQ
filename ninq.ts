
export type ReductionFunc<T, U> = (aggregate: U | undefined, item: T) => U;

export class Ninq<T> implements Iterable<T> {
	constructor(private readonly iterable: Iterable<T>) {
	}

	*[Symbol.iterator]() {
		for (let item of this.iterable) {
			yield item;
		}
	}

	reduce<TResult>(reduction: ReductionFunc<T, TResult>): TResult | undefined;
	reduce<TResult>(seed: TResult, reduction: ReductionFunc<T, TResult>): TResult;
	reduce<TResult>(
		seedOrReduc: TResult | ReductionFunc<T, TResult>,
		reduc?: ReductionFunc<T, TResult>
	): TResult | undefined {
		const reduction = typeof reduc === 'function'
			? reduc
			: seedOrReduc as ReductionFunc<T, TResult>;
		let result = typeof reduc === 'function'
			? seedOrReduc as TResult
			: undefined;
		for (let item of this) {
			result = reduction(result, item);
		}
		return result;
	}
}

export default Ninq;