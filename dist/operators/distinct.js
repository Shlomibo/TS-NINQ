"use strict";
class DefaultTracker {
    constructor() {
        this.set = new Set();
    }
    wasReturned(item) {
        const result = this.set.has(item);
        this.set.add(item);
        return result;
    }
}
class ComparerTracker {
    constructor(comparer, items) {
        this.comparer = comparer;
        this.prevItems = [];
        if (items) {
            [...this.prevItems] = items;
        }
    }
    wasReturned(item) {
        const result = 0 !== this.prevItems.filter(element => this.comparer(element, item)).length;
        if (!result) {
            this.prevItems.push(item);
        }
        return result;
    }
}
exports.ComparerTracker = ComparerTracker;
class DistinctIterable {
    constructor(it, comparer) {
        this.it = it;
        this.tracker = typeof comparer !== 'function'
            ? () => new DefaultTracker()
            : () => new ComparerTracker(comparer);
    }
    *[Symbol.iterator]() {
        const tracker = this.tracker();
        for (let item of this.it) {
            if (!tracker.wasReturned(item)) {
                yield item;
            }
        }
    }
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = DistinctIterable;
//# sourceMappingURL=distinct.js.map