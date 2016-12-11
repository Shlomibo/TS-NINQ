"use strict";
const distinct_1 = require('./distinct');
class IntersectionIterator {
    constructor(left, right, comparer) {
        this.left = left;
        this.right = right;
        this.comparer = comparer;
    }
    *[Symbol.iterator]() {
        const [...left] = this.left, tracker = new distinct_1.ComparerTracker(this.comparer);
        for (let rightItem of this.right) {
            if (left.some(leftItem => this.comparer(leftItem, rightItem)) &&
                !tracker.wasReturned(rightItem)) {
                yield rightItem;
            }
        }
    }
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = IntersectionIterator;
//# sourceMappingURL=intersect.js.map