"use strict";
const distinct_1 = require('./distinct');
class UnionIterable {
    constructor(left, right, comparer) {
        this.left = left;
        this.right = right;
        this.comparer = comparer;
    }
    *[Symbol.iterator]() {
        const tracker = new distinct_1.ComparerTracker(this.comparer, this.left);
        for (const item of this.right) {
            if (!tracker.wasReturned(item)) {
                yield item;
            }
        }
    }
}
exports.UnionIterable = UnionIterable;
//# sourceMappingURL=union.js.map