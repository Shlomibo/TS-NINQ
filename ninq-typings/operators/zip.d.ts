export declare class ZipIterable<T, U> implements Iterable<[T | undefined, U | undefined]> {
    private readonly left;
    private readonly right;
    private readonly throughAll;
    constructor(left: Iterable<T>, right: Iterable<U>, throughAll?: boolean);
    [Symbol.iterator](): Iterator<[T | undefined, U | undefined]>;
    private shouldIterate({done: lDone}, {done: rDone});
}
