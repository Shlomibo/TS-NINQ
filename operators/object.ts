import { Ninq } from '../core/ninq';

export enum ObjectIterationOptions {
	default = 0x0,
	ownProperties = 0x1,
	inheritedProperties = 0x2,
	enumerableProperties = 0x4,
	nonEnumerableProperties = 0x8,
	readableProperties = 0x10,
	writableProperties = 0x20,
	dataProperties = 0x80,
	accessorProperties = 0x100,
	symbols = 0x40,


	dataAndAccessorProperties = dataProperties | accessorProperties,

	ownEnumerable = ownProperties | enumerableProperties | readableProperties | writableProperties | dataAndAccessorProperties,
	allOwnProperties = ownEnumerable | nonEnumerableProperties,
	allEnumerable = ownEnumerable | inheritedProperties,
	allReadonly = ownProperties | inheritedProperties | enumerableProperties | nonEnumerableProperties | readableProperties | dataAndAccessorProperties,
	allProperties = allReadonly | writableProperties,

	ownSymbols = ownProperties | symbols,
	allSymbols = ownSymbols | inheritedProperties,

	all = allProperties | allSymbols,
}
export enum EntryType {
	property,
	symbol
}

export interface ObjectIterableExtension extends Ninq<Entry> {
	keys(): Iterable<string | symbol>;
	values(): Iterable<any>;
}
export interface EntryBase {
	source: {};
	type: EntryType;
	data(safe?: boolean): any;
}
export interface PropertyEntry extends EntryBase {
	name: string;
	descriptor: PropertyDescriptor;
	type: EntryType.property;
}
export interface SymbolEntry extends EntryBase {
	symbol: symbol;
	value: any;
	type: EntryType.symbol;
}
export type Entry = PropertyEntry | SymbolEntry;

const DEFAULT_OPTIONS = ObjectIterationOptions.ownEnumerable;

class ObjectIterable extends Ninq<Entry> implements ObjectIterableExtension {
	private _keys: Ninq<string | symbol> | undefined;
	private _values: Ninq<any> | undefined;

	constructor(
		obj: {},
		options = [ObjectIterationOptions.default],
	) {
		if (!obj || -1 === ['object', 'function'].indexOf(typeof obj)) {
			throw new TypeError('Invalid object');
		}
		options = options.map(op => op || DEFAULT_OPTIONS);

		super({
			[Symbol.iterator](): IterableIterator<Entry> {
				let currentObj = obj;
				return generator();

				function* generator() {
					for (const op of options) {
						if (hasFlag(op, ObjectIterationOptions.ownProperties)) {
							yield* objGenerator(op);
						}
						if (hasFlag(op, ObjectIterationOptions.inheritedProperties)) {
							for (currentObj = Object.getPrototypeOf(currentObj);
								!!currentObj;
								currentObj = Object.getPrototypeOf(currentObj)) {

								yield* objGenerator(op);
							}
						}
					}
				}

				function* objGenerator(options: ObjectIterationOptions) {
					const names = Object.getOwnPropertyNames(currentObj),
						enumerables = new Set(Object.keys(currentObj));

					for (let name of names) {
						if (shouldNameReturned(name)) {
							const descriptor = Object.getOwnPropertyDescriptor(currentObj, name);

							if (shouldReturned(descriptor)) {
								yield appendData({
									source: currentObj,
									type: EntryType.property,
									name,
									descriptor,
								});
							}
						}
					}
					if (hasFlag(options, ObjectIterationOptions.symbols)) {
						for (let sym of Object.getOwnPropertySymbols(currentObj)) {
							yield appendData({
								source: currentObj,
								type: EntryType.symbol,
								symbol: sym,
								value: currentObj[sym],
							});
						}
					}

					function appendData(entry: Partial<Entry>): Entry {
						entry.data = data.bind(null, entry);
						return entry as Entry;
					}
					function shouldNameReturned(name: string) {
						if (hasFlag(options, ObjectIterationOptions.enumerableProperties)) {
							return hasFlag(options, ObjectIterationOptions.nonEnumerableProperties) ||
								enumerables.has(name);
						}
						else if (hasFlag(options, ObjectIterationOptions.nonEnumerableProperties)) {
							return !enumerables.has(name);
						}
						else {
							return false;
						}
					}
					function shouldReturned(desc: PropertyDescriptor) {
						return checkReadWrite() && checkDataOrAccessor();

						function checkReadWrite() {
							if (hasFlag(options, ObjectIterationOptions.readableProperties)) {
								return hasFlag(options, ObjectIterationOptions.writableProperties) ||
									// It has an accessor prop with a getter
									typeof desc.get === 'function' ||
									// or it is a data prop.
									typeof desc.set !== 'function';
							}
							else if (hasFlag(options, ObjectIterationOptions.writableProperties)) {
								return typeof desc.set === 'function' ||
									(typeof desc.get !== 'function' && desc.writable);
							}
							else {
								return false;
							}
						}
						function checkDataOrAccessor() {
							if (hasFlag(options, ObjectIterationOptions.dataProperties)) {
								return hasFlag(options, ObjectIterationOptions.accessorProperties) ||
									!isAccessor();
							}
							else if (hasFlag(options, ObjectIterationOptions.accessorProperties)) {
								return isAccessor();
							}
							else {
								return false;
							}

							function isAccessor() {
								return typeof desc.get === 'function' ||
									typeof desc.set === 'function';
							}
						}
					}
				}
			}
		});

		function hasFlag(options: ObjectIterationOptions, flag: ObjectIterationOptions) {
			return (options & flag) === flag;
		}
	}

	keys(): Ninq<string | symbol> {
		const that = this as Iterable<Entry>;
		if (!this._keys) {
			this._keys = new Ninq({
				*[Symbol.iterator]() {
					for (let entry of that) {
						yield entry.type === EntryType.property
							? entry.name
							: entry.symbol;
					}
				}
			});
		}

		return this._keys;
	}

	values(): Ninq<any> {
		let that = this;
		if (!this._values) {
			this._values = new Ninq({
				*[Symbol.iterator]() {
					for (let entry of <Iterable<Entry>>that) {
						yield entry.data();
					}

				}
			});
		}

		return this._values;
	}
}

declare module '../core/ninq' {
	namespace Ninq {
		/**
		 * Convert loopable object to Ninq
		 *
		 * @static
		 * @template T - The type of the elements of it
		 * @param {Loopable<T>} - Loopable to convert
		 * @returns {Ninq<T>} - Ninq wrapper for it.
		 */
		export function of(obj: {}, options?: ObjectIterationOptions[]): ObjectIterableExtension;
		export function keys(obj: {}, options?: ObjectIterationOptions[]): Ninq<string | symbol>;
		export function values(obj: {}, options?: ObjectIterationOptions[]): Ninq<any>;
	}
}

Object.assign(Ninq, {
	of(obj: {}, options?: ObjectIterationOptions[]): ObjectIterableExtension {
		return new ObjectIterable(obj, options);
	},

	keys(obj: {}, options?: ObjectIterationOptions[]): Ninq<string | symbol> {
		return new ObjectIterable(obj, options)
			.keys();
	},

	values(obj: {}, options?: ObjectIterationOptions[]): Ninq<any> {
		return new ObjectIterable(obj, options)
			.values();
	}
});

function data(entry: Entry, safe = true): any {
	switch (entry.type) {
		case EntryType.property: {
			if (entry.descriptor.get) {
				return entry.descriptor.get.call(entry.source);
			}
			else if (!entry.descriptor.set) {
				return entry.descriptor.value;
			}
			else if (!safe) {
				throw Error('Cannot read write-only property');
			}
			break;
		}
		case EntryType.symbol: {
			return entry.value;
		}
		default: break;
	}
}
