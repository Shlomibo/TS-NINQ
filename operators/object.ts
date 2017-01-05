
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

export interface EntryBase {
	source: {};
	type: EntryType;
}
export interface PropertyEntry {
	name: string;
	descriptor: PropertyDescriptor;
	type: EntryType.property;
}
export interface SymbolEntry {
	symbol: symbol;
	value: any;
	type: EntryType.symbol;
}
export type Entry = PropertyEntry | SymbolEntry;

const DEFAULT_OPTIONS = ObjectIterationOptions.ownProperties |
	ObjectIterationOptions.enumerableProperties |
	ObjectIterationOptions.readableProperties |
	ObjectIterationOptions.writableProperties;

export class ObjectIterable implements Iterable<Entry> {
	constructor(
		private readonly obj: {},
		private readonly options = ObjectIterationOptions.default,
	) {
		if (!this.obj || -1 === ['object', 'function'].indexOf(typeof this.obj)) {
			throw new TypeError('Invalid object');
		}
		this.options = this.options || DEFAULT_OPTIONS;
	}

	*values(): IterableIterator<any> {
		for (let entry of this) {
			switch (entry.type) {
				case EntryType.property: {
					if (entry.descriptor.get) {
						yield entry.descriptor.get.call(this.obj);
					}
					else if (!entry.descriptor.set) {
						yield entry.descriptor.value;
					}
					break;
				}
				case EntryType.symbol: {
					yield entry.value;
					break;
				}
				default: break;
			}
		}
	}

	[Symbol.iterator](): Iterator<Entry> {
		const that = this;
		let currentObj = this.obj;
		return generator();

		function* generator() {
			if (that.hasFlag(ObjectIterationOptions.ownProperties)) {
				yield* objGenerator();
			}
			if (that.hasFlag(ObjectIterationOptions.inheritedProperties)) {
				for (currentObj = Object.getPrototypeOf(currentObj);
					!!currentObj;
					currentObj = Object.getPrototypeOf(currentObj)) {

					yield* objGenerator();
				}
			}
		}
		function* objGenerator() {
			const names = Object.getOwnPropertyNames(currentObj),
				enumerables = new Set(Object.keys(currentObj));

			for (let name of names) {
				if (shouldNameReturned(name)) {
					const descriptor = Object.getOwnPropertyDescriptor(currentObj, name);

					if (shouldReturned(descriptor)) {
						yield {
							source: currentObj,
							type: EntryType.property,
							name,
							descriptor,
						} as PropertyEntry;
					}
				}
			}
			if (that.hasFlag(ObjectIterationOptions.symbols)) {
				for (let sym of Object.getOwnPropertySymbols(currentObj)) {
					yield {
						source: currentObj,
						type: EntryType.symbol,
						symbol: sym,
						value: currentObj[sym],
					} as SymbolEntry;
				}
			}

			function shouldNameReturned(name: string) {
				if (that.hasFlag(ObjectIterationOptions.enumerableProperties)) {
					return that.hasFlag(ObjectIterationOptions.nonEnumerableProperties) ||
						enumerables.has(name);
				}
				else if (that.hasFlag(ObjectIterationOptions.nonEnumerableProperties)) {
					return !enumerables.has(name);
				}
				else {
					return false;
				}
			}
			function shouldReturned(desc: PropertyDescriptor) {
				return checkReadWrite() && checkDataOrAccessor();

				function checkReadWrite() {
					if (that.hasFlag(ObjectIterationOptions.readableProperties)) {
						return that.hasFlag(ObjectIterationOptions.writableProperties) ||
							// It has an accessor prop with a getter
							typeof desc.get === 'function' ||
							// or it is a data prop.
							typeof desc.set !== 'function';
					}
					else if (that.hasFlag(ObjectIterationOptions.writableProperties)) {
						return typeof desc.set === 'function' ||
							(typeof desc.get !== 'function' && desc.writable);
					}
					else {
						return false;
					}
				}
				function checkDataOrAccessor() {
					if (that.hasFlag(ObjectIterationOptions.dataProperties)) {
						return that.hasFlag(ObjectIterationOptions.accessorProperties) ||
							!isAccessor();
					}
					else if (that.hasFlag(ObjectIterationOptions.accessorProperties)) {
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

	private hasFlag(flag: ObjectIterationOptions) {
		return (this.options & flag) === flag;
	}
}

export default ObjectIterable;
