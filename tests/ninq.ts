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

});
