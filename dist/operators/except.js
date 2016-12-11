"use strict";
class ExceptIterable {
    constructor(left, right, comparer) {
        this.left = left;
        this.right = right;
        this.comparer = comparer;
    }
    *[Symbol.iterator]() {
        if (this.comparer) {
            let [...result] = new Set(this.left);
            for (let rightItem of this.right) {
                result = result.filter(leftItem => this.comparer && !this.comparer(leftItem, rightItem));
            }
            yield* result;
        }
        else {
            let lSet = new Set(this.left), rSet = new Set(this.right);
            for (let item of lSet) {
                if (!rSet.has(item)) {
                    yield item;
                }
            }
        }
    }
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = ExceptIterable;
//# sourceMappingURL=except.js.map