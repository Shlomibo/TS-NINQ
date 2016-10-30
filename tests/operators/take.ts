import { Ninq } from '../../ninq';

describe('take', () => {

	it('takes item from seq', () => {
		const arr = [1, 2, 3],
			[...res] = Ninq.take(arr, 2);
		expect(res).toEqual([1, 2]);
	});
	it('takes item from seq', () => {
		const arr = [1, 2, 3],
			[...res] = Ninq.take(arr, 5);
		expect(res).toEqual([1, 2, 3]);
	});

});
