"use strict";
class ConcatIterable {
    constructor(iterables) {
        this.iterables = iterables;
        for (let iterable of iterables) {
            if (!iterable || (typeof iterable[Symbol.iterator] !== 'function')) {
                throw new Error("Iterable is't iterable");
            }
        }
    }
    *[Symbol.iterator]() {
        for (let iterable of this.iterables) {
            yield* iterable;
        }
    }
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = ConcatIterable;
//# sourceMappingURL=concat.js.map