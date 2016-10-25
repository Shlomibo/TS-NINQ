export type ReductionFunc<T, U> = (aggregate: U | undefined, item: T, index: number) => U;
export type Predicate<T> = (item: T, index: number) => boolean;
export type Selector<T, U> = (item: T) => U;
export type EqualityComparer<T> = (left: T, right: T) => boolean;
