export function identity<T>(x: T): T {
	return x;
}

export interface CallbackHandler<T> extends PromiseLike<T> {
	(this: void, err: any, result: T): void;
}
export interface MultiArgCallbackHandler<T> extends PromiseLike<T[]> {
	(this: void, err: any, ...results: T[]): void;
}

export function fromCallback<T>(multiArg: false): CallbackHandler<T>;
export function fromCallback<T>(multiArg: true): MultiArgCallbackHandler<T>;
export function fromCallback<T>(multiArg: boolean)
	: CallbackHandler<T> | MultiArgCallbackHandler<T> {

	let handler: any;
	const resolvePromise = new Promise((resolve, reject) => {
		handler = (err: any, ...results: T[]) => {
			if (err) {
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