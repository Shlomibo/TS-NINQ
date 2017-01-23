import { Constructor } from './declarations';

export function combineConstructors<T, U>(
	NewT: Constructor<T>,
	NewU: Constructor<U>
): Constructor<T & U> {
	const result: Constructor<T & U> = function CombinedConstructor(this: T & U) {
		NewT.call(this);
		NewU.call(this);
	} as any;
	result.prototype = combineObjects(NewT.prototype, NewU.prototype);
	result.prototype.constructor = result;
	return result;
}

export function combineObjects<T, U>(
	t: T,
	u: U,
): T & U {
	return new Proxy<T & U>({} as any, {
		getPrototypeOf(target) {
			const [
				tProto,
				uProto,
			] = [t, u].map(obj => Object.getPrototypeOf(obj));
			if (!tProto) {
				return uProto;
			}
			else if (!uProto) {
				return tProto;
			}
			else {
				return combineObjects(tProto, uProto);
			}
		},

		getOwnPropertyDescriptor(target, prop) {
			const result = Object.getOwnPropertyDescriptor(t, prop) ||
				Object.getOwnPropertyDescriptor(u, prop) ||
				Object.getOwnPropertyDescriptor(target, prop);

			if (result &&
				!result.configurable &&
				!Object.getOwnPropertyDescriptor(target, prop)
			) {
				Object.defineProperty(target, prop, result);
			}
			return result;
		},

		has(target, prop) {
			return [
				t,
				u,
				target,
			].some(obj => Reflect.has(obj, prop));
		},

		get(target, prop, reciever) {
			const desc = getPropDescriptor(t, prop) ||
				getPropDescriptor(u, prop) ||
				getPropDescriptor(target, prop);

			if (desc && !desc.get && desc.set) {
				throw new Error('Write only prop');
			}

			return (desc && desc.get) ? desc.get.call(reciever) :
				(desc && !desc.set) ? desc.value :
					undefined;
		},

		set(target, prop, value, receiver) {
			const desc = getPropDescriptor(target, prop) ||
				getPropDescriptor(t, prop) ||
				getPropDescriptor(u, prop);

			if ((desc && desc.get && !desc.set) ||
				(desc && !desc.get && !desc.set && !desc.writable)
			) {
				return false;
			}

			if (desc && desc.set) {
				desc.set.call(receiver, value);
			}
			else if (desc) {
				Object.defineProperty(target, prop, {
					configurable: desc.configurable,
					writable: desc.writable,
					enumerable: desc.enumerable,
					value,
				});
			}
			else {
				target[prop] = value;
			}
			return true;
		},

		deleteProperty(target, prop) {
			const results = [
				delete t[prop],
				delete u[prop],
				delete target[prop],
			];

			return results.some(res => res);
		},

		ownKeys(target) {
			const keysSet = new Set(Reflect.ownKeys(t));
			Reflect.ownKeys(u).forEach(key => keysSet.add(key));
			Reflect.ownKeys(target).forEach(key => keysSet.add(key));
			return [...keysSet];
		},

		apply(target, thisArg, argsList) {
			return typeof t === 'function' ? Reflect.apply(t, thisArg, argsList) :
				typeof u === 'function' ? Reflect.apply(u, thisArg, argsList) :
					Reflect.apply(target as any, thisArg, argsList);
		}
	});
}

function getPropDescriptor(obj: {}, prop: PropertyKey): PropertyDescriptor | undefined {
	const descriptor = Object.getOwnPropertyDescriptor(obj, prop);
	if (descriptor) {
		return descriptor;
	}
	const proto = Object.getPrototypeOf(obj);
	return !!proto
		? getPropDescriptor(proto, prop)
		: undefined;
}
