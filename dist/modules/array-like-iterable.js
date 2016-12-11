"use strict";
class ArrayLikeIterable {
    constructor(arrayLike, continious = false) {
        this.arrayLike = arrayLike;
        this.continious = continious;
        if (!arrayLike ||
            (typeof arrayLike.length !== 'number') ||
            (arrayLike.length < 0)) {
            throw new TypeError();
        }
    }
    *[Symbol.iterator]() {
        const keys = new Set(Object.keys(this.arrayLike));
        for (let i = 0; i < this.arrayLike.length; i++) {
            if (this.continious ||
                keys.has(i.toString())) {
                yield this.arrayLike[i];
            }
        }
    }
    static toIterable(it) {
        return isIterable(it)
            ? it
            : new ArrayLikeIterable(it);
    }
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = ArrayLikeIterable;
function isIterable(obj) {
    return !!obj && (typeof obj[Symbol.iterator] === 'function');
}
exports.isIterable = isIterable;
function isArrayLike(obj) {
    return !!obj && (typeof obj.length === 'number') &&
        (obj.length >= 0) &&
        (obj.length !== Infinity) &&
        (Math.floor(obj.length) === obj.length);
}
exports.isArrayLike = isArrayLike;
//# sourceMappingURL=array-like-iterable.js.map