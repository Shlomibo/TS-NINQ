"use strict";
class ReverseIterable {
    constructor(iterable) {
        this.iterable = iterable;
    }
    *[Symbol.iterator]() {
        const [...elements] = this.iterable;
        for (let i = elements.length - 1; i >= 0; i--) {
            yield elements[i];
        }
    }
}
exports.ReverseIterable = ReverseIterable;
//# sourceMappingURL=reverse.js.map