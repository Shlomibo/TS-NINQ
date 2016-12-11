"use strict";
const ninq_1 = require('../../ninq');
describe('Group by', () => {
    it('group items by key', () => {
        const seq = [1, 2, 3, 4], [...result] = ninq_1.Ninq.groupBy(seq, x => x % 2);
        expect(result.length).toBe(2);
        expect(result[0].key).toEqual(jasmine.any(Number));
    });
    it('group items by key with selector', () => {
        const seq = [1, 2, 3, 4], [...result] = ninq_1.Ninq.groupBy(seq, x => x % 2, x => x.toString());
        expect(result.length).toBe(2);
        result.forEach(grouping => {
            expect(grouping.key).toEqual(jasmine.any(Number));
            const [...elemets] = grouping;
            elemets.forEach(elemets => void expect(elemets).toEqual(jasmine.any(String)));
        });
    });
    it('group items by key with comparer', () => {
        const seq = ['a', 'aa', 'bb', 'aaa'], [...result] = ninq_1.Ninq.groupBy(seq, x => x, compare);
        expect(result.length).toBe(3);
        expect(result[0].key).toEqual(jasmine.any(String));
    });
    it('group items by key with selector', () => {
        const seq = ['a', 'aa', 'bb', 'aaa'], [...result] = ninq_1.Ninq.groupBy(seq, x => x, x => x.length, compare);
        expect(result.length).toBe(3);
        result.forEach(grouping => {
            expect(grouping.key).toEqual(jasmine.any(String));
            const [...elemets] = grouping;
            elemets.forEach(elemets => void expect(elemets).toEqual(jasmine.any(Number)));
        });
    });
    function compare(l, r) {
        return l.length === r.length;
    }
});
//# sourceMappingURL=group-by.js.map