export declare class ReverseIterable<T> implements Iterable<T> {
    private readonly iterable;
    constructor(iterable: Iterable<T>);
    [Symbol.iterator](): IterableIterator<T>;
}
