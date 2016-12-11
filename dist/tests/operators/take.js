"use strict";
const ninq_1 = require('../../ninq');
describe('take', () => {
    it('takes item from seq', () => {
        const arr = [1, 2, 3], [...res] = ninq_1.Ninq.take(arr, 2);
        expect(res).toEqual([1, 2]);
    });
    it('takes item from seq', () => {
        const arr = [1, 2, 3], [...res] = ninq_1.Ninq.take(arr, 5);
        expect(res).toEqual([1, 2, 3]);
    });
});
//# sourceMappingURL=take.js.map