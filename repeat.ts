import { Ninq } from './core/ninq';

class RepeatIterable<T> extends Ninq<T> {
	constructor(element: T, count: number) {
		if (count < 0) {
			throw new Error('count must be greater or equal to zero');
		}
		super({
			*[Symbol.iterator]() {
				for (let i = 0; i < count; i++) {
					yield element;
				}
			}
		});
	}
}

declare module './core/ninq' {
	namespace Ninq {
		/**
		 * Generates a sequence that contains one repeated value
		 *
		 * @static
		 * @template T - The type of the value to be repeated in the result sequence
		 * @param {T} element - The value to be repeated
		 * @param {number} count - The number of times to repeat the value in the generated sequence
		 * @returns {Ninq<T>} - An Iterable<T> that contains a repeated value
		 *
		 * @memberOf Ninq
		 */
		export function repeat<T>(element: T, count: number): Ninq<T>;
	}
}

Object.assign(Ninq, {
	repeat<T>(element: T, count: number): Ninq<T> {
		return new RepeatIterable(element, count);
	}
});
