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
			rootProp: { value: 0 },
		}),
			obj = Object.create(root, {
				own1: { value: 1 },
				own2: { value: 2 },
			});

		it('iterates own props', () => {
			expect([..._.of(obj, strip(ObjectIterationOptions.inheritedProperties))].length).toBe(2);
			expect([..._.valuesOf(obj, strip(ObjectIterationOptions.inheritedProperties))])
				.toEqual([1, 2]);
		});
		it('iterates inherited properties', () => {
			expect([..._.of(obj, strip(ObjectIterationOptions.ownProperties))].length).toBe(1);
			expect([..._.valuesOf(obj, strip(ObjectIterationOptions.ownProperties))])
				.toEqual([0]);
		});

		it('iterates all props', () => {
			expect([..._.of(obj, strip())].length).toBe(3);
			expect([..._.valuesOf(obj, strip())])
				.toEqual([1, 2, 0]);
		});
	});


	describe('Enumerable properties', () => {
		const obj = {
			enum1: 1,
			enum2: 2,
		};
		beforeAll(() => Object.defineProperties(obj, {
			nonEnum: { value: 0 }
		}));

		it('iterates enumerable props', () => {
			expect([..._.of(obj, strip(
				ObjectIterationOptions.nonEnumerableProperties,
				ObjectIterationOptions.inheritedProperties,
			))].length).toBe(2);
			expect([..._.valuesOf(obj, strip(
				ObjectIterationOptions.nonEnumerableProperties,
				ObjectIterationOptions.inheritedProperties,
			))]).toEqual([1, 2]);
		});
		it('iterates nonenumerable properties', () => {
			expect([..._.of(obj, strip(
				ObjectIterationOptions.enumerableProperties,
				ObjectIterationOptions.inheritedProperties,
			))].length).toBe(1);
			expect([..._.valuesOf(obj, strip(
				ObjectIterationOptions.enumerableProperties,
				ObjectIterationOptions.inheritedProperties,
			))]).toEqual([0]);
		});

		it('iterates all props', () => {
			expect([..._.of(obj, strip(ObjectIterationOptions.inheritedProperties))].length).toBe(3);
		});
	});


	describe('Readable and writable props', () => {
		const obj = {
			readwrite: 2,
			get readP() {
				return 1;
			},
			set writeP(value: any) { ; },
			get readwriteP() {
				return 2;
			},
			set readwriteP(val: number) { ; },
		};
		beforeAll(() => Object.defineProperties(obj, {
			read: { value: 1 }
		}));

		it('iterates readable props', () => {
			expect([..._.of(obj, strip(
				ObjectIterationOptions.writableProperties,
				ObjectIterationOptions.inheritedProperties,
			))].length).toBe(4);
			expect([..._.valuesOf(obj, strip(
				ObjectIterationOptions.writableProperties,
				ObjectIterationOptions.inheritedProperties,
			))]).toEqual([2, 1, 2, 1]);
		});
		it('iterates writable properties', () => {
			expect([..._.of(obj, strip(
				ObjectIterationOptions.readableProperties,
				ObjectIterationOptions.inheritedProperties,
			))].length).toBe(3);
			expect([..._.valuesOf(obj, strip(
				ObjectIterationOptions.readableProperties,
				ObjectIterationOptions.inheritedProperties,
			))]).toEqual([2, 2]);
		});

		it('iterates all props', () => {
			expect([..._.of(obj, strip(ObjectIterationOptions.inheritedProperties))].length).toBe(5);
			expect([..._.valuesOf(obj, strip(ObjectIterationOptions.inheritedProperties))])
				.toEqual([2, 1, 2, 1]);
		});
	});


	describe('Data and accessor props', () => {
		const obj = {
			data1: 1,
			data2: 2,
			get accessor() {
				return 0;
			},
		};

		it('iterates data props', () => {
			expect([..._.of(obj, strip(
				ObjectIterationOptions.accessorProperties,
				ObjectIterationOptions.inheritedProperties,
			))].length).toBe(2);
			expect([..._.valuesOf(obj, strip(
				ObjectIterationOptions.accessorProperties,
				ObjectIterationOptions.inheritedProperties,
			))]).toEqual([1, 2]);
		});
		it('iterates accessor properties', () => {
			expect([..._.of(obj, strip(
				ObjectIterationOptions.dataProperties,
				ObjectIterationOptions.inheritedProperties,
			))].length).toBe(1);
			expect([..._.valuesOf(obj, strip(
				ObjectIterationOptions.dataProperties,
				ObjectIterationOptions.inheritedProperties,
			))]).toEqual([0]);
		});

		it('iterates all props', () => {
			expect([..._.of(obj, strip(ObjectIterationOptions.inheritedProperties))].length).toBe(3);
			expect([..._.valuesOf(obj, strip(ObjectIterationOptions.inheritedProperties))])
				.toEqual([1, 2, 0]);
		});
	});

	describe('symbols', () => {
		const sym1 = Symbol(),
			sym2 = Symbol(),
			obj = {
				prop: 0,
				[sym1]: 1,
				[sym2]: 2,
			};

		it('iterates symbols props', () => {
			expect([..._.of(obj, strip(
				ObjectIterationOptions.enumerableProperties,
				ObjectIterationOptions.nonEnumerableProperties,
				ObjectIterationOptions.readableProperties |
				ObjectIterationOptions.writableProperties
			))].length).toBe(2);
			expect([..._.valuesOf(obj, strip(
				ObjectIterationOptions.enumerableProperties,
				ObjectIterationOptions.nonEnumerableProperties,
				ObjectIterationOptions.readableProperties |
				ObjectIterationOptions.writableProperties
			))]).toEqual([1, 2]);
		});
		it('iterates non-symbol properties', () => {
			expect([..._.of(obj, strip(
				ObjectIterationOptions.symbols,
				ObjectIterationOptions.inheritedProperties
			))].length).toBe(1);
			expect([..._.valuesOf(obj, strip(
				ObjectIterationOptions.symbols,
				ObjectIterationOptions.inheritedProperties
			))]).toEqual([0]);
		});

		it('iterates all props', () => {
			expect([..._.of(obj, strip(ObjectIterationOptions.inheritedProperties))].length).toBe(3);
			expect([..._.valuesOf(obj, strip(ObjectIterationOptions.inheritedProperties))])
				.toEqual([0, 1, 2]);
		});
	});

});
