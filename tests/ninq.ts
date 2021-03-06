import * as n from '../ninq';
import { Ninq } from '../ninq';

function* randomSeq(length = 10, max = 100) {
	for (let i = 0; i < length; i++) {
		yield Math.floor(Math.random() * max);
	}
}

describe('Test Base ninq class', () => {

	it('constructed around iterable', () => {
		expect(n.Ninq).toEqual(jasmine.any(Function));
		const N = new n.Ninq(randomSeq());
		expect(N[Symbol.iterator]).toEqual(jasmine.any(Function));
	});


	describe('reduction', () => {
		const emptySeq = [] as number[],
			seq = [1, 5, 3],
			maxVal = 5;
		it('returns undefined for empty seqs', () => {
			const ninq = new n.Ninq(emptySeq);
			expect(ninq.reduce(maxReduction)).toBeUndefined();
		});
		it('returns seed for empty seqs', () => {
			const ninq = new n.Ninq(emptySeq),
				seed = Math.random();
			expect(ninq.reduce(seed, maxReduction)).toBe(seed);
		});
		it('returns reduction value without seed', () => {
			const ninq = new n.Ninq(seq);
			expect(ninq.reduce(maxReduction)).toBe(maxVal);
		});
		it('returns reduction value with seed', () => {
			const ninq = new n.Ninq(seq),
				seed = Math.random() * 10;
			expect(ninq.reduce(seed, maxReduction))
				.toBe(Math.max(seed, maxVal));
		});
		function maxReduction(prev: number | undefined, current: number) {
			return typeof prev === 'number'
				? Math.max(prev, current)
				: current;
		}
	});


	describe('Some functionality', () => {

		it('return false for empty seq', () => {
			const seq = new n.Ninq([]);
			expect(seq.some()).toBe(false);
			expect(seq.some(x => false)).toBe(false);
		});

		it('return true for single success', () => {
			const seq = new n.Ninq([1, 2, 3]);
			expect(seq.some()).toBe(true);
			expect(seq.some((x, index) => index === 1)).toBe(true);
		});

		it('return true for all success', () => {
			const seq = new n.Ninq([1, 2, 3]);
			expect(seq.every(x => true)).toBe(true);
		});

		it('return false for no success', () => {
			const seq = new n.Ninq([1, 2, 3]);
			expect(seq.every(x => false)).toBe(false);
		});
	});
	describe('Every functionality', () => {

		it('return true for empty seq', () => {
			const seq = new n.Ninq([]);
			expect(seq.every(x => false)).toBe(true);
		});

		it('return false for single failure', () => {
			const seq = new n.Ninq([1, 2, 3]);
			expect(seq.every((x, index) => index !== 1)).toBe(false);
		});

		it('return false for all failure', () => {
			const seq = new n.Ninq([1, 2, 3]);
			expect(seq.every(x => false)).toBe(false);
		});

		it('return true for no failure', () => {
			const seq = new n.Ninq([1, 2, 3]);
			expect(seq.every(x => true)).toBe(true);
		});
	});


	describe('Average functionality', () => {

		it('Calculates avg', () => {
			const [...arr] = randomSeq(),
				sum = arr.reduce((sum, val) => sum + val),
				avg = sum / arr.length,
				seq = new n.Ninq(arr);
			expect(seq.average(x => x)).toBeCloseTo(avg, 10);
		});

	});


	describe('Icludes', () => {
		function comparer(left: string, right: string) {
			return left.length === right.length;
		}
		it('return true if the item is included', () => {
			const seq = new Ninq([1, 2, 3]);
			expect(seq.includes(2)).toBe(true);
		});
		it('return false if the item is not included', () => {
			const seq = new Ninq([1, 2, 3]);
			expect(seq.includes(5)).toBe(false);
		});
		it('return true if the item is included, using comparer', () => {
			const seq = new Ninq(['a', 'aa', 'aaa']);
			expect(seq.includes('bb', comparer)).toBe(true);
		});
		it('return false if the item is not included, using comparer', () => {
			const seq = new Ninq(['a', 'aa', 'aaa']);
			expect(seq.includes('bbbbb', comparer)).toBe(false);
		});
	});


	describe('Count', () => {

		it('Should return full count', () => {
			const seq = new Ninq([1, 2, 3]);
			expect(seq.count()).toBe(3);
		});
		it('Should return predicate count', () => {
			const seq = new Ninq([1, 2, 3, 4]);
			expect(seq.count(x => 0 === x % 2)).toBe(2);
		});

	});


	describe('Default if empty', () => {

		it('Shoud return the same it if not empty', () => {
			const it = [1, 2];
			expect(Ninq.defaultIfEmpty(it, 0)).toBe(it);
		});
		it('Shoud return def value if empty', () => {
			const it: any[] = [];
			expect(Ninq.defaultIfEmpty(it, Infinity)).toEqual([Infinity]);
		});
		it('Shoud return the same ninq if not empty', () => {
			const seq = new Ninq([1, 2]);
			expect(seq.defaultIfEmpty(0)).toBe(seq);
		});
		it('Shoud return def value if empty', () => {
			const seq = new Ninq<number>([]);
			const [...result] = seq.defaultIfEmpty(Infinity);
			expect(result).toEqual([Infinity]);
		});

	});


	describe('element at', () => {

		it('return the element at the index', () => {
			const seq = [1, 2, 3];
			expect(Ninq.elementAt(seq, 1)).toBe(2);
			expect(Ninq.elementAtOrDefault(seq, 1, undefined)).toBe(2);
		});
		it('return the default value if index is out of range', () => {
			const seq = [1, 2, 3];
			expect(Ninq.elementAtOrDefault(seq, 6, 666)).toBe(666);
		});
		it('throws if index is out of range', () => {
			const seq = [1, 2, 3];
			expect(() => Ninq.elementAt(seq, 6)).toThrow();
		});

	});


	describe('empty', () => {

		it('return an empty sequence', () => {
			const seq = Ninq.empty<undefined>(),
				it = seq[Symbol.iterator](),
				{done} = it.next();
			expect(done).toBeTruthy();
		});

	});


	describe('First', () => {

		it('Return the first of a seq', () => {
			const seq = [1, 2],
				resWODefault = Ninq.first(seq),
				resWDefault = Ninq.firstOrDefault(seq, undefined);
			expect(resWDefault).toBe(1);
			expect(resWODefault).toBe(1);
		});
		it('Return the first of a seq with predicate', () => {
			const seq = [1, 2],
				resWODefault = Ninq.first(seq, x => 0 === x % 2),
				resWDefault = Ninq.firstOrDefault(seq, undefined, x => 0 === x % 2);
			expect(resWDefault).toBe(2);
			expect(resWODefault).toBe(2);
		});
		it('Return the default if it is empty iterable', () => {
			const seq = [] as number[],
				resWDefault = Ninq.firstOrDefault(seq, undefined);
			expect(resWDefault).toBe(undefined);
			expect(() => Ninq.first(seq)).toThrow();
		});

	});


	describe('Last', () => {
		const arr = [1, 2, 3],
			empty: any[] = [];

		it('return the last element', () => {
			expect(Ninq.last(arr)).toBe(3);
			expect(Ninq.lastOrDefault(arr, NaN)).toBe(3);
		});


		it('return def value or throws for empty seq', () => {
			expect(() => Ninq.last(empty)).toThrow();
			expect(Ninq.lastOrDefault(empty, Infinity)).toBe(Infinity);
		});

		it('return the last element that pass predicate', () => {
			expect(Ninq.last(arr, x => 0 === x % 2)).toBe(2);
			expect(Ninq.lastOrDefault(arr, NaN, x => 0 === x % 2)).toBe(2);
		});


		it("return def value or throws for seqs that don't pass", () => {
			expect(() => Ninq.last(arr, x => false)).toThrow();
			expect(Ninq.lastOrDefault(arr, Infinity, x => false)).toBe(Infinity);
		});

	});


	describe('Max', () => {

		it('return max value', () => {
			const num = [1, -2, 3],
				str = ['a', 'ba', 'caa'];

			expect(Ninq.max(num)).toBe(3);
			expect(Ninq.max(str, s => s.length)).toBe(3);
		});

		it('return undefined', () => {
			const num = [] as number[],
				str = [] as string[];

			expect(Ninq.max(num)).toBeUndefined();
			expect(Ninq.max(str, s => s.length)).toBeUndefined();
		});

	});

	describe('Min', () => {

		it('return min value', () => {
			const num = [1, 2, -3],
				str = ['a', 'ba', 'caa'];

			expect(Ninq.min(num)).toBe(-3);
			expect(Ninq.min(str, s => s.length)).toBe(1);
		});

		it('return undefined', () => {
			const num = [] as number[],
				str = [] as string[];

			expect(Ninq.min(num)).toBeUndefined();
			expect(Ninq.min(str, s => s.length)).toBeUndefined();
		});

	});


	describe('range', () => {

		it('zero upwards', () => {
			const [...result] = Ninq.range(5);
			expect(result).toEqual([0, 1, 2, 3, 4]);
		});


		it('povided value upwards', () => {
			const [...result] = Ninq.range(5, 1);
			expect(result).toEqual([1, 2, 3, 4, 5]);
		});
		it('zero value downwards', () => {
			const [...result] = Ninq.range(5, undefined, -1);
			expect(result).toEqual([0, -1, -2, -3, -4]);
		});
		it('povided value downwards', () => {
			const [...result] = Ninq.range(5, 1, -1);
			expect(result).toEqual([1, 0, -1, -2, -3]);
		});
	});


	describe('repeat', () => {

		it('repeat the value multiple times', () => {
			const [...result] = Ninq.repeat(null, 3);
			expect(result).toEqual([null, null, null]);
		});

	});


	describe('equality', () => {

		it('test for equality', () => {
			const left = [1, 2, 3],
			right = [1, 2, 3];
			expect(Ninq.sequenceEqual(left, right)).toBe(true);
		});

	});


	describe('single', () => {

		it('empty seqs', () => {
			const arr: any[] = [];
			expect(Ninq.singleOrDefault(arr, Infinity)).toBe(Infinity);
			expect(() => Ninq.single(arr)).toThrow();
		});

		it('single element seqs', () => {
			const arr = [1];
			expect(Ninq.singleOrDefault(arr, Infinity)).toBe(1);
			expect(Ninq.single(arr)).toBe(1);
		});

		it('throws on multi elments seqs', () => {
			const arr = [1, 2];
			expect(() => Ninq.singleOrDefault(arr, Infinity)).toThrow();
			expect(() => Ninq.single(arr)).toThrow();
		});
		it('empty seqs, condition', () => {
			const arr = [1];
			expect(Ninq.singleOrDefault(arr, Infinity, predicate)).toBe(Infinity);
			expect(() => Ninq.single(arr, predicate)).toThrow();
		});

		it('single element seqs, condition', () => {
			const arr = [1, 2];
			expect(Ninq.singleOrDefault(arr, Infinity, predicate)).toBe(2);
			expect(Ninq.single(arr, predicate)).toBe(2);
		});

		it('throws on multi elments seqs, condition', () => {
			const arr = [0, 1, 2];
			expect(() => Ninq.singleOrDefault(arr, Infinity, predicate)).toThrow();
			expect(() => Ninq.single(arr, predicate)).toThrow();
		});

		function predicate(x: number) {
			return 0 === x % 2;
		}
	});


	describe('sum', () => {

		it('calc sum', () => {
			const arr = [1, 2, 3];
			expect(Ninq.sum(arr)).toBe(6);
		});

	});

});
