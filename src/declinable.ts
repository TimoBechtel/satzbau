export type Gender = 'f' | 'n' | 'm';
export type GrammaticalCase =
	| 'nominative'
	| 'accusative'
	| 'dative'
	| 'genitive';
export type GrammaticalNumber = 'p' | 's';

export interface Declinable<T> {
	plural: () => T;
	singular: () => T;
	accusative: () => T;
	genitive: () => T;
	dative: () => T;
	nominative: () => T;
}

export type DeclinableArgs = {
	grammaticalCase?: GrammaticalCase;
	grammaticalNumber?: GrammaticalNumber;
};

export function declinableMixin<
	T extends Declinable<T>,
	Args extends DeclinableArgs
>(constructor: (args: Args) => T): (args: Args) => Declinable<T> {
	return function create(args: Args): Declinable<T> {
		return {
			accusative() {
				return constructor({ ...args, grammaticalCase: 'accusative' });
			},
			dative() {
				return constructor({ ...args, grammaticalCase: 'dative' });
			},
			genitive() {
				return constructor({ ...args, grammaticalCase: 'genitive' });
			},
			nominative() {
				return constructor({ ...args, grammaticalCase: 'nominative' });
			},
			plural() {
				return constructor({ ...args, grammaticalNumber: 'p' });
			},
			singular() {
				return constructor({ ...args, grammaticalNumber: 's' });
			},
		};
	};
}
