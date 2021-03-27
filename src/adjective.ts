import {
	Article,
	WithArticleArgs,
	withArticleMixin,
	WithArticleType,
} from './article';
import {
	Declinable,
	DeclinableArgs,
	declinableMixin,
	Gender,
	GrammaticalCase,
	GrammaticalNumber,
} from './declinable';
import { Writable } from './textHelper';

export function isAdjective(obj: any): obj is Adjective {
	return (obj as Adjective).gender !== undefined;
}
export interface Adjective
	extends Declinable<Adjective>,
		WithArticleType<Adjective>,
		Writable {
	gender: (gender: Gender) => this;
}

/**
 * creates a declinable adjective
 * @param template adjective in base form
 * @example adjective('klein');
 */
export function adjective(template: string): Adjective {
	/**
	 * removes 'e' at the end
	 * e.g. leise => leis
	 */
	let stem = template.replace(/e(l?)$/, '$1');

	/**
	 * removes 'e' in '-er' after diphthong (eu,ei,au)
	 * e.g. teuer => teur
	 */
	stem = stem.replace(/(eu|ei|au)er$/, '$1r');

	/**
	 * hoch => hoh
	 * (any word that ends with 'hoch', so you can write something like 'sehr hoch')
	 */
	stem = stem.replace(/hoch$/, 'hoh');

	function decline({
		articleType = 'definite',
		gender = 'n',
		grammaticalCase = 'nominative',
		grammaticalNumber = 's',
	}: {
		grammaticalCase?: GrammaticalCase;
		grammaticalNumber?: GrammaticalNumber;
		gender?: Gender;
		articleType?: Article;
	}) {
		if (grammaticalNumber === 'p') {
			if (articleType !== 'none' || grammaticalCase === 'dative')
				return stem + 'en';
			if (grammaticalCase === 'nominative' || grammaticalCase === 'accusative')
				return stem + 'e';
			return stem + 'er';
		}
		if (gender === 'f') {
			if (grammaticalCase === 'nominative' || grammaticalCase === 'accusative')
				return stem + 'e';
			if (articleType === 'none') return stem + 'er';
			return stem + 'en';
		}
		if (gender === 'm') {
			if (grammaticalCase === 'accusative' || grammaticalCase === 'genitive')
				return stem + 'en';
			if (grammaticalCase === 'dative') {
				if (articleType === 'none') return stem + 'em';
				return stem + 'en';
			}
			if (articleType === 'definite') return stem + 'e';
			return stem + 'er';
		}
		if (gender === 'n') {
			if (grammaticalCase === 'genitive') return stem + 'en';
			if (grammaticalCase === 'dative') {
				if (articleType === 'none') return stem + 'em';
				return stem + 'en';
			}
			if (articleType === 'definite') return stem + 'e';
			return stem + 'es';
		}
		return '';
	}

	const create = adjectiveFactory((args) => ({
		write() {
			return decline(args);
		},
	}));
	return create();
}

type AdjectiveArgs = {
	gender?: Gender;
} & DeclinableArgs &
	WithArticleArgs;

export function adjectiveFactory(
	writable: (args: AdjectiveArgs) => Writable
): (args?: AdjectiveArgs) => Adjective {
	return function create(args: AdjectiveArgs = {}): Adjective {
		return {
			gender(g) {
				return create({ ...args, gender: g });
			},
			...withArticleMixin(create)(args),
			...declinableMixin(create)(args),
			...writable({ ...args }),
		};
	};
}
