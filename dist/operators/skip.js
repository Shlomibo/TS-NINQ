"use strict";
class SkippingIterable {
    constructor(iterable, predicate) {
        this.iterable = iterable;
        this.predicate = predicate;
    }
    *[Symbol.iterator]() {
        let i = 0, isSkipping = true;
        for (let item of this.iterable) {
            isSkipping = isSkipping && this.predicate(item, i++);
            if (!isSkipping) {
                yield item;
            }
        }
    }
}
exports.SkippingIterable = SkippingIterable;
//# sourceMappingURL=skip.js.map