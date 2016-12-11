"use strict";
const _2_3_tree_1 = require('../modules/2-3-tree');
class SortingIterable {
    constructor(iterable, comparer, descending = false) {
        this.iterable = iterable;
        this._comparer = descending
            ? inverter
            : comparer;
        function inverter(x, y) {
            const cmp = comparer(x, y);
            if (cmp < 0) {
                return 1;
            }
            else if (cmp === 0) {
                return 0;
            }
            else {
                return -1;
            }
        }
    }
    [Symbol.iterator]() {
        return this.sort(this.iterable);
    }
    thenBy(comparer, descending = false) {
        return new SubSort(this, this.iterable, comparer, descending);
    }
    *sort(it) {
        const sorted = new _2_3_tree_1.TwoThreeTree(this._comparer);
        sorted.addRange(it);
        yield* sorted;
    }
}
exports.SortingIterable = SortingIterable;
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = SortingIterable;
class SubSort extends SortingIterable {
    constructor(parent, iterable, comparer, descending = false) {
        super(iterable, comparer, descending);
        this.parent = parent;
    }
    [Symbol.iterator]() {
        const subSort = this.sort(this.iterable);
        return this.sort.call(this.parent, subSort);
    }
}
function isSortedIterable(iterable) {
    return typeof iterable.thenBy === 'function';
}
exports.isSortedIterable = isSortedIterable;
//# sourceMappingURL=sortBy.js.map