import { Ninq } from '../core/ninq';
import { Loopable } from '../core/declarations';
import ArrayLikeIterable from '../core/array-like-iterable';
import { iterable } from '../core/symbols';

declare module '../core/ninq' {
	namespace Ninq {
		export function stringify<T>(it: Loopable<T>, separator?: string): string;
	}
	interface Ninq<T> {
		stringify(separator?: string): string;
	}
}

Object.assign(Ninq, {
	stringify<T>(it: Loopable<T>, separator = ','): string {
		const decomposed = it instanceof Array
			? it
			: [...ArrayLikeIterable.toIterable(it)];

		return decomposed.join(separator);
	}

});
Object.assign(Ninq.prototype, {
	stringify<T>(this: Ninq<T>, separator?: string): string {
		return Ninq.stringify(this[iterable], separator);
	}
});
