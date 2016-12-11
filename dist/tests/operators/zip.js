"use strict";
const ninq_1 = require('../../ninq');
describe('zip', () => {
    it('zip 2 iterables', () => {
        const left = [1, 2, 3], right = ['a', 'b', 'c'], expected = [[1, 'a'], [2, 'b'], [3, 'c']], [...result] = ninq_1.Ninq.zip(left, right);
        expect(result).toEqual(expected);
    });
    it('zip 2 iterables entirely', () => {
        const left = [1, 2, 3], right = ['a'], expected = [[1, 'a'], [2, undefined], [3, undefined]], [...result] = ninq_1.Ninq.zip(left, right, true);
        expect(result).toEqual(expected);
    });
    it('zip 2 iterables to first end', () => {
        const left = [1, 2, 3], right = ['a'], expected = [[1, 'a']], [...result] = ninq_1.Ninq.zip(left, right);
        expect(result).toEqual(expected);
    });
});
//# sourceMappingURL=zip.js.map