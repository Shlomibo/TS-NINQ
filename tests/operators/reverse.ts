import { Ninq } from '../../ninq';

describe('reverse', () => {

	it('reverses an iterable', () => {
		expect([...Ninq.reverse([1, 2, 3, 4])]).toEqual([4, 3, 2, 1]);
	});

});
