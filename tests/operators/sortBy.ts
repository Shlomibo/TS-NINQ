import { Ninq } from '../../ninq';

describe('Sort by', () => {


	it('sorts numbers and strings', () => {
		const arr = [4, 2, 7, 1, 7, 6, 9, 2, 41, 11, 8, 15, 3, 5, 0, 15, 100, -30],
			starr = ['asd', 'sdf', 'erggf', 'sggv', 'jbvc', 'tsd'],
			sorted = [-30, 0, 1, 2, 2, 3, 4, 5, 6, 7, 7, 8, 9, 11, 15, 15, 41, 100],
			stsorted = ['asd', 'erggf', 'jbvc', 'sdf', 'sggv', 'tsd'],
			secsorted = ['asd', 'sdf', 'tsd', 'jbvc', 'sggv', 'erggf'];
		const [...res] = Ninq.sortBy(arr),
			[...stres] = Ninq.sortBy(starr),
			[...secres] = Ninq.sortBy(starr, compareByLength)
				.thenBy(regCompare);
		expect(res).toEqual(sorted);
		expect(stres).toEqual(stsorted);
		expect(secres).toEqual(secsorted);

		function compareByLength(l: string, r: string) {
			return l.length - r.length;
		}
		function regCompare(l: string, r: string) {
			return l < r ? -1 :
				l === r ? 0 :
					1;
		}
	});


	it('sorts by descending order', () => {
		const arr = [4, 6, 3, 7, 9, 2],
			sorted = [9, 7, 6, 4, 3, 2];
		const [...res] = Ninq.sortBy(arr, true);
		expect(res).toEqual(sorted);
	});


});
