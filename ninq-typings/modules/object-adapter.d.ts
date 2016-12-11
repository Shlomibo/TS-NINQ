export declare type ObjectType = {} | Function | Object;
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
export declare function adaptTo<TMain extends ObjectType, TSecondary extends ObjectType>(main: TMain, secondary: TSecondary): TMain & TSecondary;
export default adaptTo;
