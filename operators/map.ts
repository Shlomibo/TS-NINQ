import { Mapping, Loopable } from '../core/declarations';
import { Ninq } from '../core/ninq';
import ArrayLikeIterable from '../core/array-like-iterable';
import { iterable } from '../core/symbols';

export class MappingIterable<TSource, TResult> extends Ninq<TResult> {
	constructor(
		iterable: Iterable<TSource>,
		mapping: Mapping<TSource, TResult>
	) {
		super({
			*[Symbol.iterator]() {
				let i = 0;
				for (let item of iterable) {
					yield mapping(item, i++);
				}
			}
		});
	}
}

export class MapManyIterable<TSource, TCollection, TResult> extends Ninq<TResult> {
	constructor(
		iterable: Iterable<TSource>,
		seqMapping: Mapping<TSource, Iterable<TCollection>>,
		resultMapping: Mapping<TCollection, TResult>
	) {
		super({
			*[Symbol.iterator]() {
				let itemIndex = 0;
				for (let item of iterable) {
					const sequnce = seqMapping(item, itemIndex++);
					let resultIndex = 0;
					for (let resultItem of sequnce) {
						yield resultMapping(resultItem, resultIndex++);
					}
				}
			}
		});
	}
}

declare module '../core/ninq' {
	namespace Ninq {
/**
	 * Projects each element of a sequence into a new form by incorporating the element's index
	 *
	 * @static
	 * @template T - The type of the elements of it
	 * @template TResult - The type of the value returned by mapping
	 * @param {Loopable<T>} it - A sequence of values to invoke a transform function on
	 * @param {Mapping<T, TResult>} mapping - A transform function to apply to each source element;
	 * 	the second parameter of the function represents the index of the source element
	 * @returns {Iterable<TResult>} - An Iterable<T> whose elements are the result of invoking the transform function on each element of this
	 *
	 * @memberOf Ninq
	 */
		export function map<T, TResult>(it: Loopable<T>, mapping: Mapping<T, TResult>): Ninq<TResult>;
		/**
	 * Flattens the sequences into one sequence, and invokes a result selector function on each element therein.
	 * 	The index of each source element is used in the intermediate projected form of that element
	 *
	 * @static
	 * @template T - The type of the elements of source
	 * @template TResult - The type of the elements of the resulting sequence
	 * @param {Loopable<Loopable<T>>} it - A sequence of values to project
	 * @param {Mapping<T, TResult>} mapping - A transform function to apply to each element of the intermediate sequence
	 * @returns {Iterable<TResult>} - An Iterable<TResult> whose elements are the result of invoking the mapping each
	 * 	of the sequence elements to a result element
	 *
	 * @memberOf Ninq
	 */
	export function flatMap<T, TResult>(it: Loopable<Loopable<T>>, mapping: Mapping<T, TResult>): Ninq<TResult>;
	/**
	 * Projects each element of a sequence to an Iterable<TCollection>,
	 * 	flattens the resulting sequences into one sequence, and invokes a result selector function on each element therein.
	 * 	The index of each source element is used in the intermediate projected form of that element
	 *
	 * @static
	 * @template T - The type of the elements of source
	 * @template TCollection - The type of the intermediate elements collected by sequenceMapping
	 * @template TResult - The type of the elements of the resulting sequence
	 * @param {Loopable<T>} it - A sequence of values to project
	 * @param {Mapping<T, Iterable<TCollection>>} sequenceMapping - A transform function to apply to each source element;
	 * 	the second parameter of the function represents the index of the source element
	 * @param {Mapping<TCollection, TResult>} resultMapping - A transform function to apply to each element of the intermediate sequence
	 * @returns {Iterable<TResult>} - An Iterable<TResult> whose elements are the result of invoking the one-to-many transform function
	 * 	collectionSelector on each element of source and then mapping each of those sequence elements and
	 * 	their corresponding source element to a result element
	 *
	 * @memberOf Ninq
	 */
	export function flatMap<T, TCollection, TResult>(
		it: Loopable<T>,
		sequenceMapping: Mapping<T, Iterable<TCollection>>,
		resultMapping: Mapping<TCollection, TResult>
	): Ninq<TResult>;
	}
	interface Ninq<T> {
/**
	 * Projects each element of a sequence into a new form by incorporating the element's index
	 *
	 * @template TResult - The type of the value returned by mapping
	 * @param {Mapping<T, TResult>} mapping - A transform function to apply to each source element;
	 * 	the second parameter of the function represents the index of the source element
	 * @returns - An Iterable<T> whose elements are the result of invoking the transform function on each element of this
	 *
	 * @memberOf Ninq
	 */
		map<TResult>(mapping: Mapping<T, TResult>): Ninq<T>;

		/**
	 * Flattens the sequences into one sequence, and invokes a result selector function on each element therein.
	 * 	The index of each source element is used in the intermediate projected form of that element
	 *
	 * @template TResult - The type of the elements of the resulting sequence
	 * @param {Mapping<any, TResult>} mapping - A transform function to apply to each element of the intermediate sequence
	 * @returns {Ninq<TResult>} - An Iterable<TResult> whose elements are the result of invoking the mapping each
	 * 	of the sequence elements to a result element
	 *
	 * @memberOf Ninq
	 */
	flatMap<TResult>(mapping: Mapping<any, TResult>): Ninq<TResult>;
	/**
	 * Projects each element of a sequence to an Iterable<TCollection>,
	 * 	flattens the resulting sequences into one sequence, and invokes a result selector function on each element therein.
	 * 	The index of each source element is used in the intermediate projected form of that element
	 *
	 * @template TCollection - The type of the intermediate elements collected by sequenceMapping
	 * @template TResult - The type of the elements of the resulting sequence
	 * @param {Mapping<T, Iterable<TCollection>>} sequenceMapping - A transform function to apply to each source element;
	 * 	the second parameter of the function represents the index of the source element
	 * @param {Mapping<TCollection, TResult>} resultMapping - A transform function to apply to each element of the intermediate sequence
	 * @returns {Ninq<TResult>}
	 * @returns {Ninq<TResult>} - An Iterable<TResult> whose elements are the result of invoking the one-to-many transform function
	 * 	collectionSelector on each element of source and then mapping each of those sequence elements and
	 * 	their corresponding source element to a result element
	 *
	 * @memberOf Ninq
	 */
	flatMap<TCollection, TResult>(
		sequenceMapping: Mapping<T, Iterable<TCollection>>,
		resultMapping: Mapping<TCollection, TResult>
	): Ninq<TResult>;
	}
}

Object.assign(Ninq, {
	map<T, TResult>(it: Loopable<T>, mapping: Mapping<T, TResult>)
		: Ninq<TResult> {

		it = ArrayLikeIterable.toIterable(it);
		return new MappingIterable<T, TResult>(it, mapping);
	},
	flatMap<T, TCollection, TResult>(
		it: Loopable<T>,
		seqOrResMapping: Mapping<T, Iterable<TCollection>> | Mapping<T, TResult>,
		resultMapping?: Mapping<TCollection, TResult>
	): Ninq<TResult> {
		it = ArrayLikeIterable.toIterable(it);
		if (!resultMapping) {
			resultMapping = seqOrResMapping as any;
			seqOrResMapping = x => x as any;
		}
		return new MapManyIterable<T, TCollection, TResult>(
			it,
			seqOrResMapping as any,
			resultMapping as any
		);
	},
});
Object.assign(Ninq.prototype, {
	map<T, TResult>(this: Ninq<T>, mapping: Mapping<T, TResult>) {
		const it = Ninq.map(this[iterable], mapping);
		return new Ninq<TResult>(it);
	},
	flatMap<T>(
		this: Ninq<T>,
		seqOrResMapping: Mapping<any, any>,
		resultMapping?: Mapping<any, any>
	): Ninq<T> {
		if (!resultMapping) {
			resultMapping = seqOrResMapping;
			seqOrResMapping = x => x;
		}
		return Ninq.flatMap(this[iterable], seqOrResMapping, resultMapping);
	}
});
