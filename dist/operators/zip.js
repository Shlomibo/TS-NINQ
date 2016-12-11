"use strict";
class ZipIterable {
    constructor(left, right, throughAll = false) {
        this.left = left;
        this.right = right;
        this.throughAll = throughAll;
    }
    *[Symbol.iterator]() {
        const [lIt, rIt] = [this.left, this.right]
            .map(x => x[Symbol.iterator]());
        for (let left = lIt.next(), right = rIt.next(); this.shouldIterate(left, right); left = left.done ? left : lIt.next(), right = right.done ? right : rIt.next()) {
            yield [
                left.done ? undefined : left.value,
                right.done ? undefined : right.value
            ];
        }
    }
    shouldIterate({ done: lDone }, { done: rDone }) {
        return this.throughAll
            ? (!lDone || !rDone)
            : (!lDone && !rDone);
    }
}
exports.ZipIterable = ZipIterable;
//# sourceMappingURL=zip.js.map