export function identity<T>(x: T): T {
	return x;
}

export type Reason = {} | number | string | boolean | symbol;
export interface CallbackHandler<T> extends PromiseLike<T> {
	(this: void, err: Reason): void;
	(this: void, err: null | undefined, result: T): void;
}
export interface MultiArgCallbackHandler<T> extends PromiseLike<T[]> {
	(this: void, err: Reason): void;
	(this: void, err: null | undefined, ...results: T[]): void;
}

export function fromCallback<T>(multiArg?: false): CallbackHandler<T>;
export function fromCallback<T>(multiArg: true): MultiArgCallbackHandler<T>;
export function fromCallback<T>(multiArg = false)
	: CallbackHandler<T> | MultiArgCallbackHandler<T> {

	let handler: any;
	const resolvePromise = new Promise((resolve, reject) => {
		handler = (err: any, ...results: T[]) => {
			if (err != null) {
				reject(err);
			}
			else {
				resolve(
					multiArg
						? results
						: results[0]
				);
			}
		};
		handler.then =
			(onFullfilled: any, onRejected: any) => 	resolvePromise.then(
				onFullfilled,
				onRejected
			);
	});
	return handler;
}