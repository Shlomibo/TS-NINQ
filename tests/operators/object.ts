import _ from '../../ninq';
import { ObjectIterationOptions } from '../../operators/object';

describe('Iterates over object', () => {
	function strip(...flags: ObjectIterationOptions[]) {
		return flags.reduce(
			(result, flag) => result & ~flag,
			ObjectIterationOptions.all
		);
	}

	describe('Own and inherited properties', () => {
		const root = Object.create(null, {
			rootProp: { value: true },
		}),
			obj = Object.create(root, {
				own1: { value: true },
				own2: { value: true },
			});

		it('iterates own props', () => {
			expect([..._.of(obj, strip(ObjectIterationOptions.inheritedProperties))].length).toBe(2);
		});
		it('iterates inherited properties', () => {
			expect([..._.of(obj, strip(ObjectIterationOptions.ownProperties))].length).toBe(1);
		});

		it('iterates all props', () => {
			expect([..._.of(obj, strip())].length).toBe(3);
		});
	});


	describe('Enumerable properties', () => {
		const obj = {
			enum1: true,
			enum2: true
		};
		beforeAll(() => Object.defineProperties(obj, {
			nonEnum: { value: true }
		}));

		it('iterates enumerable props', () => {
			expect([..._.of(obj, strip(
				ObjectIterationOptions.nonEnumerableProperties,
				ObjectIterationOptions.inheritedProperties,
			))].length).toBe(2);
		});
		it('iterates nonenumerable properties', () => {
			expect([..._.of(obj, strip(
				ObjectIterationOptions.enumerableProperties,
				ObjectIterationOptions.inheritedProperties,
			))].length).toBe(1);
		});

		it('iterates all props', () => {
			expect([..._.of(obj, strip(ObjectIterationOptions.inheritedProperties))].length).toBe(3);
		});
	});


	describe('Readable and writable props', () => {
		const obj = {
			readwrite: true,
			get readP() {
				return true;
			},
			set writeP(value: any) { ; },
			get readwriteP() {
				return true;
			},
			set readwriteP(val: boolean) { ; },
		};
		beforeAll(() => Object.defineProperties(obj, {
			read: { value: true }
		}));

		it('iterates readable props', () => {
			expect([..._.of(obj, strip(
				ObjectIterationOptions.writableProperties,
				ObjectIterationOptions.inheritedProperties,
			))].length).toBe(4);
		});
		it('iterates writable properties', () => {
			expect([..._.of(obj, strip(
				ObjectIterationOptions.readableProperties,
				ObjectIterationOptions.inheritedProperties,
			))].length).toBe(3);
		});

		it('iterates all props', () => {
			expect([..._.of(obj, strip(ObjectIterationOptions.inheritedProperties))].length).toBe(5);
		});
	});


	describe('Data and accessor props', () => {
		const obj = {
			data1: true,
			data2: true,
			get accessor() {
				return true;
			},
		};

		it('iterates data props', () => {
			expect([..._.of(obj, strip(
				ObjectIterationOptions.accessorProperties,
				ObjectIterationOptions.inheritedProperties,
			))].length).toBe(2);
		});
		it('iterates accessor properties', () => {
			expect([..._.of(obj, strip(
				ObjectIterationOptions.dataProperties,
				ObjectIterationOptions.inheritedProperties,
			))].length).toBe(1);
		});

		it('iterates all props', () => {
			expect([..._.of(obj, strip(ObjectIterationOptions.inheritedProperties))].length).toBe(3);
		});
	});

	describe('symbols', () => {
		const sym1 = Symbol(),
			sym2 = Symbol(),
			obj = {
				prop: true,
				[sym1]: true,
				[sym2]: true,
			};

		it('iterates symbols props', () => {
			expect([..._.of(obj, strip(
				ObjectIterationOptions.enumerableProperties,
				ObjectIterationOptions.nonEnumerableProperties,
				ObjectIterationOptions.readableProperties |
				ObjectIterationOptions.writableProperties
			))].length).toBe(2);
		});
		it('iterates non-symbol properties', () => {
			expect([..._.of(obj, strip(
				ObjectIterationOptions.symbols,
				ObjectIterationOptions.inheritedProperties
			))].length).toBe(1);
		});

		it('iterates all props', () => {
			expect([..._.of(obj, strip(ObjectIterationOptions.inheritedProperties))].length).toBe(3);
		});
	});

});
