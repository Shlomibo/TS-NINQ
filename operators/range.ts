import { Ninq } from '../core/ninq';

class RangeIterable extends Ninq<number> {
	constructor(count: number, start = 0, step = 1) {
		super({
			*[Symbol.iterator]() {
				for (let i = start; shouldIterate(i); i += step) {
					yield i;
				}

				function shouldIterate(i: number) {
					return step < 0
						? i > start - count
						: i < start + count;
				}
			}
		});
	}
}

declare module '../core/ninq' {
	namespace Ninq {
		/**
		 * Generates a sequence of integral numbers within a specified range
		 *
		 * @static
		 * @param {number} count - The number of sequential integers to generate
		 * @param {number} [start=0] - The value of the first integer in the sequence
		 * @param {number} [step=1] - The step between each iteration result.
		 * @returns {Iterable<number>} - An Iterable<number> that contains a range of sequential integral numbers
		 *
		 * @memberOf Ninq
		 */
		export function range(count: number, start?: number, step?: number): Ninq<number>;
	}
}

Object.assign(Ninq, {
	range(count: number, start = 0, step = 1): Ninq<number> {
		return new RangeIterable(count, start, step);
	}
});
