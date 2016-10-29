import { Ninq } from '../../ninq';

describe('map', () => {

	it('maps', () => {
		const [...result] = Ninq.map([1, 2, 3], x => x.toString());
		expect(result).toEqual(['1', '2', '3']);
	});

});
