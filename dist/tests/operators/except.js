"use strict";
const ninq_1 = require('../../ninq');
describe('Except', () => {
    it('returns empty seq if theres no values', () => {
        const l = [1, 2, 3], r = [1, 2, 3], [...result] = ninq_1.Ninq.except(l, r);
        expect(result.length).toBe(0);
    });
    it('returns seq with appropriate values', () => {
        const l = [1, 2, 3], r = [1, 3], [...result] = ninq_1.Ninq.except(l, r);
        expect(result).toEqual([2]);
    });
    it('works with comparer', () => {
        const l = ['a', 'aa', 'aaa'], r = ['b', 'bbb'], full = ['bb', ...r], [...result] = ninq_1.Ninq.except(l, r, compare), [...empty] = ninq_1.Ninq.except(l, full, compare);
        expect(result).toEqual(['aa']);
        expect(empty).toEqual([]);
        function compare(l, r) {
            return l.length === r.length;
        }
    });
});
//# sourceMappingURL=except.js.map