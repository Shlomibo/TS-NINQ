import { Loopable } from './core/declarations';
import { Ninq as NinqClass } from './core/ninq';
import { ObjectIterationOptions, EntryType } from './operators/object';
import './operators/object';
import './operators/filter';

export function Ninq<T>(it: Loopable<T>): NinqClass<T> {
	return new NinqClass(it);
}
NinqClass.of(NinqClass, [ObjectIterationOptions.allOwnProperties])
	.filter(entry => typeof entry.data() === 'function')
	.forEach(entry => {
		switch (entry.type) {
			case EntryType.property: {
				Object.defineProperty(Ninq, entry.name, entry.descriptor);
				break;
			}
			case EntryType.symbol: {
				Ninq[entry.symbol] = entry.value;
				break;
			}
			default: break;
		}
	});
