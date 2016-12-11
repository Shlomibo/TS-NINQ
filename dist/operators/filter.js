"use strict";
class FilterIterable {
    constructor(it, predicate) {
        this.it = it;
        this.predicate = predicate;
    }
    *[Symbol.iterator]() {
        let i = 0;
        for (let item of this.it) {
            if (this.predicate(item, i++)) {
                yield item;
            }
        }
    }
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = FilterIterable;
//# sourceMappingURL=filter.js.map