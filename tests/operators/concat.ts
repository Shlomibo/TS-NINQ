import { Ninq } from '../../ninq';

describe('Concat tests', () => {
	const arr1 = [1, 2, 3],
		arr2 = [4, 5, 6],
		arr3 = [7, 8, 9],
		arr23 = [arr2, arr3],
		arrs = [arr1, arr2, arr3],
		all23 = [...arr2, ...arr3],
		all = [...arr1, ...all23];

	it('It concat varargs', () => {
		const seq = new Ninq(arr1),
			[...result] = seq.concat(arr2, arr3);
		expect(result).toEqual(all);
	});
	it('It concat iterable', () => {
		const seq = new Ninq(arr1),
			[...result] = seq.concat(arr23);
		expect(result).toEqual(all);
	});
	it('Static concat varargs', () => {
		const [...result] = Ninq.concat(arr1, arr2, arr3);
		expect(result).toEqual(all);
	});
	it('Static concat iterable', () => {
		const [...result] = Ninq.concat(arrs);
		expect(result).toEqual(all);
	});

});
