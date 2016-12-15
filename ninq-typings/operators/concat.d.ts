export default class ConcatIterable<T> implements Iterable<T> {
    private readonly iterables;
    constructor(iterables: Iterable<Iterable<T>>);
    [Symbol.iterator](): IterableIterator<T>;
}
