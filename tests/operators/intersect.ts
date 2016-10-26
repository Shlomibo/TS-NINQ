import { Ninq } from '../../ninq';

describe('Intersect', () => {
	const arr1 = [1, 2, 3],
		starr1 = ['a', 'aa', 'aaa'],
		arr2 = [2, 3, 4],
		starr2 = ['bb', 'bbb', 'bbbb'],
		arr3 = [4, 5, 6],
		starr3 = ['cccc', 'ccccc', 'cccccc'],
		res12 = [2, 3],
		stres12 = ['bb', 'bbb'],
		dup = [1, 2, 2, 3, 3, 3],
		stDup = ['aaa', 'aa', 'bb', 'a', 'b', 'c'];

	it('produce no values for non overlapping seqs', () => {
		const [...result] = Ninq.intersect(arr1, arr3),
			[...stResult] = Ninq.intersect(starr1, starr3, compareStr);
		expect(result).toEqual([]);
		expect(stResult).toEqual([]);
	});
	it('produce all values for completeley overlapping seqs', () => {
		const [...result] = Ninq.intersect(arr1, arr1),
			[...stResult] = Ninq.intersect(starr1, starr1, compareStr);
		expect(result).toEqual(arr1);
		expect(stResult).toEqual(starr1);
	});
	it('produce values for overlapping seqs', () => {
		const [...result] = Ninq.intersect(arr1, arr2),
			[...stResult] = Ninq.intersect(starr1, starr2, compareStr);
		expect(result).toEqual(res12);
		expect(stResult).toEqual(stres12);
	});
	it('does not product dups', () => {
		const [...result] = Ninq.intersect(dup, dup),
			[...stResult] = Ninq.intersect(stDup, stDup, compareStr);
		expect(result).toEqual(arr1);
		expect(stResult).toEqual(['aaa', 'aa', 'a']);
	});

	function compareStr(l: string, r: string) {
		return l.length === r.length;
	}
});
