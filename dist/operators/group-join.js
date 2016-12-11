"use strict";
class GroupJoinIterable {
    constructor(outer, inner, outerSelector, innerSelector, resultSelector, comparer) {
        this.outer = outer;
        this.inner = inner;
        this.outerSelector = outerSelector;
        this.innerSelector = innerSelector;
        this.resultSelector = resultSelector;
        this.comparer = comparer;
    }
    *[Symbol.iterator]() {
        let results;
        const comparer = this.comparer;
        if (!comparer) {
            const innerMap = new Map();
            for (let innerItem of this.inner) {
                const key = this.innerSelector(innerItem), entry = innerMap.get(key) || [];
                entry.push(innerItem);
                innerMap.set(key, entry);
            }
            results = innerMap;
        }
        else {
            const entries = [];
            for (let inner of this.inner) {
                const key = this.innerSelector(inner), entry = entries.find(([itemKey]) => comparer(key, itemKey));
                if (entry) {
                    entry[1].push(inner);
                }
                else {
                    entries.push([
                        key,
                        [inner]
                    ]);
                }
            }
            results = entries;
        }
        for (let outer of this.outer) {
            const key = this.outerSelector(outer), comparer = this.comparer;
            let inner;
            if (!comparer) {
                inner = results.get(key);
            }
            else {
                const entry = results
                    .find(([innerKey]) => comparer(key, innerKey));
                if (entry) {
                    inner = entry[1];
                }
            }
            yield this.resultSelector({
                outer,
                inner: inner || []
            });
        }
    }
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = GroupJoinIterable;
//# sourceMappingURL=group-join.js.map