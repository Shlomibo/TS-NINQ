import { SortedCollection, Comparer } from '../types';

export class TwoThreeTree<T> implements SortedCollection<T> {

	private _root: Node<T> | undefined;
	private readonly _comparer: Comparer<T>;

	constructor(comparer: Comparer<T>) {
		this._comparer = comparer;
	}

	add(...items: T[]) {
		this.addRange(items);
	}
	addRange(items: Iterable<T>) {
		for (let item of items) {
			this._root = insert({
				tree: this._root,
				value: item,
				comparer: this._comparer,
				isRoot: true,
			});
		}
	}

	[Symbol.iterator](): Iterator<T> {
		return iterateTree(this._root);
	}

	toString() {
		return print(this._root);
	}
}

function print<T>(node: Node<T> | undefined, indentation = 0): string {
	const indent = Array.from({ length: indentation })
		.map(_ => '  ')
		.join('');
	indentation++;
	if (!node) {
		return indent + '\u25cf';
	}
	switch (node.order) {
		case 2: {
			return `${indent}(${node.values[0]})
${print(node.left, indentation)}
${print(node.right, indentation)}`;
		}
		case 3: {
			return `${indent}(${node.values.join(', ')})
${print(node.left, indentation)}
${print(node.middle, indentation)}
${print(node.right, indentation)}`;
		}
		case 4: {
			return `${indent}(${node.values.join(', ')})
${print(node.left, indentation)}
${print(node.middle, indentation)}
${print(node.temp, indentation)}
${print(node.right, indentation)}`;
		}
		default:
			throw new TypeError('Invalid node');
	}

}

function* iterateTree<T>(tree: Node<T> | undefined)
	: IterableIterator<T> {
	if (tree) {
		yield* iterateTree(tree.left);
		yield tree.values[0];

		if (tree.order === 3) {
			yield* iterateTree(tree.middle);
			yield tree.values[1];
		}

		yield* iterateTree(tree.right);
	}
}

function log(...messages: any[]) {
	// global.console.log.apply(global.console, messages);
	// global.console.log();
}

function insert<T>({
	tree,
	value,
	comparer,
	isRoot,
}: {
		tree: Node<T> | undefined,
		value: T,
		comparer: Comparer<T>,
		isRoot?: boolean,
	}): Node<T> {

	if (isRoot) {
		log(print(tree));
		tree = insert({ tree, value, comparer });
		log(print(tree));
		if (tree.order === 4) {
			tree = decompose4Node(tree, undefined);
			log(print(tree));
		}
		return tree;
	}

	if (!tree) {

		return {
			order: 2,
			values: [value],
		};
	}

	if (tree.order === 2) {
		const cmp = comparer(value, tree.values[0]);
		if (cmp < 0) {
			const left = tree.left;
			log(print(tree));
			if (!left) {
				return {
					order: 3,
					values: [value, tree.values[0]],
					right: tree.right,
				};
			}
			tree.left = insert({ tree: left, value, comparer });
			log(print(tree));

			if (tree.left.order === 4) {
				tree = decompose4Node(tree.left, tree);
				log(print(tree));
			}

			return tree;
		}

		const right = tree.right;
		if (!right) {
			return {
				order: 3,
				values: [tree.values[0], value],
				left: tree.left,
			};
		}
		log(print(tree));
		tree.right = insert({ tree: right, value, comparer });
		log(print(tree));

		if (tree.right.order === 4) {
			tree = decompose4Node(tree.right, tree);
			log(print(tree));
		}

		return tree;
	}

	if (tree.order === 3) {
		const [lCmp, rCmp] = tree.values.map(comparer.bind(null, value));
		if (lCmp < 0) {
			const left = tree.left;
			if (!left) {
				return {
					order: 4,
					values: [value, ...tree.values] as [T, T, T],
					middle: tree.middle,
					right: tree.right,
				};
			}
			log(print(tree));
			tree.left = insert({ tree: tree.left, value, comparer });
			log(print(tree));

			if (tree.left.order === 4) {
				tree = decompose4Node(tree.left, tree);
				log(print(tree));
			}

			return tree;
		}

		if (rCmp < 0) {
			const middle = tree.middle;
			if (!middle) {
				return {
					order: 4,
					values: [tree.values[0], value, tree.values[1]],
					left: tree.left,
					right: tree.right,
				};
			}
			log(print(tree));
			tree.middle = insert({ tree: middle, value, comparer });
			log(print(tree));

			if (tree.middle.order === 4) {
				tree = decompose4Node(tree.middle, tree);
				log(print(tree));
			}

			return tree;
		}

		const right = tree.right;
		if (!right) {
			return {
				order: 4,
				values: [...tree.values, value] as [T, T, T],
				left: tree.left,
				middle: tree.middle,
			};
		}
		log(print(tree));
		tree.right = insert({ tree: right, value, comparer });
		log(print(tree));

		if (tree.right.order === 4) {
			tree = decompose4Node(tree.right, tree);
			log(print(tree));
		}

		return tree;
	}

	throw new TypeError('Cannot insert into 4-node');

	function decompose4Node(node: FourNode<T>, parent: Node<T> | undefined)
		: Node<T> {

		const [
			lVal,
			mVal,
			rVal
		] = node.values;
		const [lrNode, rlNode] = node.middle
			? comparer(node.middle.values[0], mVal) < 0
				? [node.middle, node.temp]
				: [node.temp, node.middle]
			: [undefined, undefined];
		const left = {
			order: 2,
			values: [lVal],
			left: node.left,
			right: lrNode,
		} as TwoNode<T>,
			right = {
				order: 2,
				values: [rVal],
				left: rlNode,
				right: node.right
			} as TwoNode<T>;

		if (!parent) {
			return {
				order: 2,
				values: [mVal],
				left,
				right,
			};
		}

		if (parent.order === 2) {
			const [plValue, prValue, pLeft, pMiddle, pRight] = comparer(mVal, parent.values[0]) < 0
				? [mVal, parent.values[0], left, right, parent.right]
				: [parent.values[0], mVal, parent.left, left, right];
			return {
				order: 3,
				values: [plValue, prValue],
				left: pLeft,
				middle: pMiddle,
				right: pRight,
			};
		}

		if (parent.order === 3) {
			const nodePos = comparer(mVal, parent.values[0]) < 0 ? 'start' :
				comparer(mVal, parent.values[1]) < 0 ? 'middle' :
					'end';
			switch (nodePos) {
				case 'start': {
					return {
						order: 4,
						values: [mVal, ...parent.values] as [T, T, T],
						left,
						middle: right,
						temp: parent.middle,
						right: parent.right,
					};
				}
				case 'middle': {
					return {
						order: 4,
						values: [parent.values[0], mVal, parent.values[2]],
						left: parent.left,
						middle: left,
						temp: right,
						right: parent.right,
					};
				}
				case 'end': {
					return {
						order: 4,
						values: [...parent.values, mVal] as [T, T, T],
						left: parent.left,
						middle: parent.middle,
						temp: left,
						right,
					};
				}
				default:
					throw new Error('??');
			}
		}

		throw new Error('Parent should not be 4-node');
	}
}

type Node<T> = TwoNode<T> | ThreeNode<T> | FourNode<T>;

interface TwoNode<T> {
	order: 2;
	values: [T];
	left?: Node<T> | undefined;
	right?: Node<T> | undefined;
}
interface ThreeNode<T> {
	order: 3;
	values: [T, T];
	left?: Node<T> | undefined;
	middle?: Node<T> | undefined;
	right?: Node<T> | undefined;
}
interface FourNode<T> {
	order: 4;
	values: [T, T, T];
	left?: Node<T> | undefined;
	middle?: Node<T> | undefined;
	right?: Node<T> | undefined;
	temp?: Node<T>;
}