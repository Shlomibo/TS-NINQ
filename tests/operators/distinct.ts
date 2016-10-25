import { Ninq } from '../../ninq';

describe('Distinct functionality', () => {

	it('returns set if no comparer specified', () => {
		const seq = [1, 2, 2, 3],
			result = Ninq.distinct(seq);
		expect(result).toEqual(jasmine.any(Set));
		expect(result.size).toBe(3);
	});


	it('return iterable with distinct values if comparer is specified', () => {
		const seq = ['a', 'aa', 'bb', 'aaa'],
			result = Ninq.distinct(seq, compare),
			[...resultVaues] = result;

		expect(result[Symbol.iterator]).toEqual(jasmine.any(Function));
		expect(resultVaues.length).toEqual(3);

		function compare(x: string, y: string) {
			return x.length === y.length;
		}
	});


});
