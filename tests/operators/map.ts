import { Ninq } from '../../ninq';

describe('map', () => {

	it('maps', () => {
		const [...result] = Ninq.map([1, 2, 3], x => x.toString());
		expect(result).toEqual(['1', '2', '3']);
	});

});


describe('map to many', () => {

	it('maps to many', () => {
		const [...result] = Ninq.mapMany([[1], [2], [3]], x => x.toString());
		expect(result).toEqual(['1', '2', '3']);
	});

	it('maps to many by selection', () => {
		const [...result] = Ninq.mapMany(
			['123', '456'],
			x => x.split(''),
			x => Number.parseInt(x)
		);
		expect(result).toEqual([1, 2, 3, 4, 5, 6]);
	});


});

