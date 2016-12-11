"use strict";
const ninq_1 = require('../../ninq');
describe('reverse', () => {
    it('reverses an iterable', () => {
        const [...result] = ninq_1.Ninq.reverse([1, 2, 3, 4]);
        expect(result).toEqual([4, 3, 2, 1]);
    });
});
//# sourceMappingURL=reverse.js.map