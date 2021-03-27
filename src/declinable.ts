export type Gender = 'f' | 'n' | 'm';
export type GrammaticalCase =
	| 'nominative'
	| 'accusative'
	| 'dative'
	| 'genitive';
export type GrammaticalNumber = 'p' | 's';

export interface Declinable<T> {
	/**
	 * returns the word in plural
	 */
	plural: () => T;
	/**
	 * returns the word in singular
	 */
	singular: () => T;
	/**
	 * returns the word in accusative
	 */
	accusative: () => T;
	/**
	 * returns the word in genitive
	 */
	genitive: () => T;
	/**
	 * returns the word in dative
	 */
	dative: () => T;
	/**
	 * returns the word in nominative
	 */
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
