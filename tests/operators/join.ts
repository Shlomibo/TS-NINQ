import { Ninq } from '../../ninq';

describe('Join', () => {
	const o1 = [
		[1, 'a'],
		[2, 'b'],
		[3, 'c'],
	] as [number, string][],
		o2 = [
			['a', 1],
			['aa', 2],
			['aaa', 3],
		] as [string, number][],
		match1 = [
			['bb', 2],
			['ccc', 3],
			['dddd', 4],
		] as [string, number][],
		noMatch1 = [
			['dddd', 4],
			['eeeee', 5],
			['ffffff', 6],
		] as [string, number][],
		match2 = [
			[22, 'b'],
			[333, 'c'],
			[4444, 'd'],
		] as [number, string][],
		noMatch2 = [
			[4444, 'd'],
			[55555, 'e'],
			[666666, 'f'],
		] as [number, string][];


	it('returns all matching elements', () => {
		const [...result1] = Ninq.join(
			o1,
			match1,
			e => e[0],
			e => e[0].length
		),
			[...result2] = Ninq.join(
				o2,
				match2,
				e => e[0],
				e => e[0].toString(),
				strComparer
			);

		expect(result1.length).toBe(2);
		result1.forEach(result => {
			expect(result.outer).toEqual([
				jasmine.any(Number),
				jasmine.any(String),
			]);
			expect(result.inner).toEqual([
				jasmine.any(String),
				jasmine.any(Number),
			]);
		});
		expect(result2.length).toBe(2);
		result2.forEach(result => {
			expect(result.outer).toEqual([
				jasmine.any(String),
				jasmine.any(Number),
			]);
			expect(result.inner).toEqual([
				jasmine.any(Number),
				jasmine.any(String),
			]);
		});
	});


	it('return empty seq for non matching seqs', () => {
		const [...result1] = Ninq.join(
			o1,
			noMatch1,
			e => e[0],
			e => e[0].length
		),
			[...result2] = Ninq.join(
				o2,
				noMatch2,
				e => e[0],
				e => e[0].toString(),
				strComparer
			);

		expect(result1.length).toBe(0);
		expect(result2.length).toBe(0);
	});


	function strComparer(l: string, r: string) {
		return l.length === r.length;
	}
});
