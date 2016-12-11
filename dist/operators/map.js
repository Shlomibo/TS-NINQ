"use strict";
class MappingIterable {
    constructor(iterable, mapping) {
        this.iterable = iterable;
        this.mapping = mapping;
    }
    *[Symbol.iterator]() {
        let i = 0;
        for (let item of this.iterable) {
            yield this.mapping(item, i++);
        }
    }
}
exports.MappingIterable = MappingIterable;
class MapManyIterable {
    constructor(iterable, seqMapping, resultMapping) {
        this.iterable = iterable;
        this.seqMapping = seqMapping;
        this.resultMapping = resultMapping;
    }
    *[Symbol.iterator]() {
        let itemIndex = 0;
        for (let item of this.iterable) {
            const sequnce = this.seqMapping(item, itemIndex++);
            let resultIndex = 0;
            for (let resultItem of sequnce) {
                yield this.resultMapping(resultItem, resultIndex++);
            }
        }
    }
}
exports.MapManyIterable = MapManyIterable;
//# sourceMappingURL=map.js.map