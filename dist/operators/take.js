"use strict";
class TakeWhileIterable {
    constructor(iterable, predicate) {
        this.iterable = iterable;
        this.predicate = predicate;
    }
    *[Symbol.iterator]() {
        let i = 0;
        for (let item of this.iterable) {
            if (!this.predicate(item, i++)) {
                break;
            }
            yield item;
        }
    }
}
exports.TakeWhileIterable = TakeWhileIterable;
//# sourceMappingURL=take.js.map