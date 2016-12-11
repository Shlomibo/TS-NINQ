"use strict";
class GroupingIterable {
    constructor(iterable, keySelector, elementSelector, comparer) {
        this.iterable = iterable;
        this.keySelector = keySelector;
        this.elementSelector = elementSelector;
        this.comparer = comparer;
    }
    *[Symbol.iterator]() {
        let result;
        if (!this.comparer) {
            result = new Map();
            for (let item of this.iterable) {
                const key = this.keySelector(item);
                if (!result.has(key)) {
                    result.set(key, [this.elementSelector(item)]);
                }
                else {
                    const entry = result.get(key);
                    entry.push(this.elementSelector(item));
                }
            }
        }
        else {
            result = [];
            for (let item of this.iterable) {
                const key = this.keySelector(item), entry = result.find(entry => !!this.comparer && this.comparer(key, entry[0]));
                if (entry) {
                    entry[1].push(this.elementSelector(item));
                }
                else {
                    result.push([key, [this.elementSelector(item)]]);
                }
            }
        }
        for (let entry of result) {
            yield Object.assign(entry[1], {
                key: entry[0]
            });
        }
    }
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = GroupingIterable;
//# sourceMappingURL=group-by.js.map