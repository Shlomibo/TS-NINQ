import _ from '../../ninq';

describe('Traverses an iterable', () => {
	const arr = [1, 2, 3, 4];


	it('traverse the array', () => {
		let hadFirst = false;
		_.of(arr)
			.traverse()
			.forEach(trav => {
				if (trav.first && hadFirst) {
					fail();
				}
				if (trav.first && trav.previous) {
					fail();
				}
				hadFirst = hadFirst || trav.first;

				if (!trav.first) {
					expect(trav.previous).toBe(trav.current - 1);
				}
			});
		expect(hadFirst).toBe(true);
	});

});
