import * as n from '../ninq';

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

});
