import { Ninq } from '../../ninq';

describe('reverse', () => {

	it('reverses an iterable', () => {
		const [...result] = Ninq.reverse([1, 2, 3, 4]);
		expect(result).toEqual([4, 3, 2, 1]);
	});

});
