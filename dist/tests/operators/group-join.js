"use strict";
const ninq_1 = require('../../ninq');
describe('Group join', () => {
    const arr1 = [1, 2, 3], arr2 = ['a', 'aa', 'bb', 'aaa', 'bbb', 'ccc', 'dddd'];
    it('join to seqs', () => {
        const [...result] = ninq_1.Ninq.groupJoin(arr1, arr2, x => x, str => str.length, resultSelector);
        expect(result.length).toBe(arr1.length);
        result.forEach(result => {
            expect(result.outer).toEqual(jasmine.any(Number));
            result.inner.forEach(result => void expect(result).toEqual(jasmine.any(String)));
        });
    });
    it('joins with comparer', () => {
        const [...result] = ninq_1.Ninq.groupJoin(arr2, arr1, x => x, x => x.toString(), resultSelector, comparer);
        expect(result.length).toBe(arr2.length);
        result.forEach(outerResult => {
            expect(outerResult.outer).toEqual(jasmine.any(String));
            outerResult.inner.forEach(result => {
                expect(result).toEqual(jasmine.any(Number));
                expect(outerResult.outer).toBe('a');
            });
        });
        function comparer(l, r) {
            return l.length === r.length;
        }
    });
    function resultSelector(entry) {
        const [...inner] = entry.inner;
        return {
            inner,
            outer: entry.outer
        };
    }
});
//# sourceMappingURL=group-join.js.map