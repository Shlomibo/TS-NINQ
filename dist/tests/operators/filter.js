"use strict";
const ninq_1 = require('../../ninq');
describe('Filter', () => {
    it('returns filtered iterator', () => {
        const seq = [1, 2, 3, 4], [...result] = ninq_1.Ninq.filter(seq, x => 0 === x % 2);
        expect(result).toEqual([2, 4]);
    });
});
//# sourceMappingURL=filter.js.map