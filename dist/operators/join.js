"use strict";
;
class JoinIterable {
    constructor(outer, inner, outerKeySelector, innerKeySelector, comparer) {
        this.outer = outer;
        this.inner = inner;
        this.outerKeySelector = outerKeySelector;
        this.innerKeySelector = innerKeySelector;
        this.comparer = comparer;
    }
    *[Symbol.iterator]() {
        yield* this.comparer
            ? this.iterateWithComparer()
            : this.iterateWithMap();
    }
    *iterateWithMap() {
        const mapping = new Map();
        for (let outerItem of this.outer) {
            mapping.set(this.outerKeySelector(outerItem), outerItem);
        }
        for (let innerItem of this.inner) {
            const key = this.innerKeySelector(innerItem), outerItem = mapping.get(key);
            if (outerItem) {
                yield {
                    outer: outerItem,
                    inner: innerItem,
                };
            }
        }
    }
    *iterateWithComparer() {
        const comparer = this.comparer, entries = [];
        if (!comparer) {
            throw new Error('Missing comparer');
        }
        for (let outerItem of this.outer) {
            entries.push([
                this.outerKeySelector(outerItem),
                outerItem
            ]);
        }
        for (let innerItem of this.inner) {
            const key = this.innerKeySelector(innerItem), outerEntry = entries.find(([outerKey]) => comparer(outerKey, key));
            if (outerEntry) {
                const [, outer] = outerEntry;
                yield {
                    inner: innerItem,
                    outer
                };
            }
        }
    }
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = JoinIterable;
//# sourceMappingURL=join.js.map