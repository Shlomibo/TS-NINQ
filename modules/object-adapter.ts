export type ObjectType = {} | Function | Object;

/**
 * Creates an object that evaluates data from both objects.
 *
 * @export
 * @template TMain - The type of the main object.
 * @template TSecondary - The type of the secondary object.
 * @param {TMain} main - The main object.
 * @param {TSecondary} secondary - The secondary object.
 * @returns {(TMain & TSecondary)} An object that evaluates data from both objects.
 */
export function adaptTo<
	TMain extends ObjectType,
	TSecondary extends ObjectType
	>(main: TMain, secondary: TSecondary)
	: TMain & TSecondary {

	const proxy = new Proxy(main, {
		getOwnPropertyDescriptor(target, prop) {
			return Object.getOwnPropertyDescriptor(main, prop) ||
				Object.getOwnPropertyDescriptor(secondary, prop);
		},

		has(target, prop) {
			return (prop in main) ||
				(prop in secondary);
		},

		get(target, prop, receiver): any {
			return (prop in receiver)
				? receiver[prop]
				: (secondary as any)[prop];
		},

		ownKeys(target) {
			const returnedKeys = new Set(Object.getOwnPropertyNames(main));
			Object.getOwnPropertyNames(secondary)
				.forEach(key => returnedKeys.add(key));
			const [...resultArray] = returnedKeys;
			return resultArray;
		},

		apply(target, thisArg, argList) {
			if ([main, secondary].every(x => typeof x !== 'function')) {
				throw new TypeError('Not a function');
			}
			const func = [main, secondary]
				.find(x => typeof x === 'function') as Function;
			return func.call(thisArg, ...argList);
		},
	});

	return proxy as any;
}

export default adaptTo;