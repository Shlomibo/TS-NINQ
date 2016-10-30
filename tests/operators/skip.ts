import { Ninq } from '../../ninq';

describe('skip', () => {

	it('skip elements', () => {
		const arr = [1, 2, 3],
			[...result] = Ninq.skip(arr, 2);
		expect(result).toEqual([3]);
	});
	it('skip all elements', () => {
		const arr = [1, 2, 3],
			[...result] = Ninq.skip(arr, 5);
		expect(result).toEqual([]);
	});

});
