import _ from '../../ninq';

describe('Traverses an iterable', () => {
	const arr = [1, 2, 3, 4];


	it('traverse the array', () => {
		let hadFirst = false,
			hadLast = false;
		_.of(arr)
			.traverse()
			.forEach(trav => {
				if (hadLast) {
					fail('had last');
				}
				if (trav.first && hadFirst) {
					fail('duplicate first');
				}
				if (trav.first && trav.previous) {
					fail('previous with first');
				}
				hadFirst = hadFirst || trav.first;
				hadLast = hadLast || trav.last;

				if (!trav.first) {
					expect(trav.previous).toBe(trav.current - 1);
				}
			});
		expect(hadFirst).toBe(true);
		expect(hadLast).toBe(true);
	});

});
