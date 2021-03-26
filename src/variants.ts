import { adjective, Adjective } from './adjective';
import { Article, GrammaticalCase, GrammaticalNumber, Noun } from './noun';
import { Writable } from './textHelper';
import { pick } from './utils';

/**
 * Creates a declinable word with different synonyms.
 * It works just like a single word, only that
 * it chooses a different synonym every time it is rendered.
 * @example
 * const car = synonyms(
 *      noun('das auto,autos,autos'),
 *      noun('der wagen,wagen,wagens')
 * );
 * console.log(car.dative().plural().write());
 * @param words
 * @returns declinable word
 */
export function synonyms(...words: Noun[]): Noun {
	const next = createVariantPicker(words);
	function createSynonyms({
		attributes = [],
		articleType,
		grammaticalCase,
		grammaticalNumber,
	}: {
		grammaticalCase?: GrammaticalCase;
		grammaticalNumber?: GrammaticalNumber;
		articleType?: Article;
		attributes: Adjective[];
	}): Noun {
		return {
			article(a) {
				return createSynonyms({
					grammaticalCase,
					grammaticalNumber,
					articleType: a,
					attributes,
				});
			},
			specific() {
				return this.article('definite');
			},
			unspecific() {
				return this.article('indefinite');
			},
			accusative() {
				return createSynonyms({
					grammaticalCase: 'accusative',
					grammaticalNumber,
					articleType,
					attributes,
				});
			},
			dative() {
				return createSynonyms({
					grammaticalCase: 'dative',
					grammaticalNumber,
					articleType,
					attributes,
				});
			},
			genitive() {
				return createSynonyms({
					grammaticalCase: 'genitive',
					grammaticalNumber,
					articleType,
					attributes,
				});
			},
			nominative() {
				return createSynonyms({
					grammaticalCase: 'nominative',
					grammaticalNumber,
					articleType,
					attributes,
				});
			},
			attributes(...adjectivesOrStrings) {
				const adjectives = adjectivesOrStrings.map((a) =>
					typeof a === 'string' ? adjective(a) : a
				);
				return createSynonyms({
					grammaticalCase,
					grammaticalNumber,
					articleType,
					attributes: adjectives,
				});
			},
			plural() {
				return createSynonyms({
					grammaticalCase,
					grammaticalNumber: 'p',
					articleType,
					attributes,
				});
			},
			singular() {
				return createSynonyms({
					grammaticalCase,
					grammaticalNumber: 's',
					articleType,
					attributes,
				});
			},
			write() {
				let word = next();
				if (grammaticalCase) word = word[grammaticalCase]();
				if (grammaticalNumber)
					word = grammaticalNumber === 's' ? word.singular() : word.plural();
				if (articleType) word = word.article(articleType);
				if (attributes.length > 0) word = word.attributes(...attributes);
				return word.write();
			},
		};
	}
	return createSynonyms({ attributes: [] });
}

/**
 * Creates a writable text node.
 * It chooses a different variant each time it is rendered.
 * @param words
 * @returns writable text node
 */
export function variants(...words: (Writable | string)[]): Writable {
	const next = createVariantPicker(words);
	return {
		write() {
			let word = next();
			if (typeof word === 'string') return word;
			return word.write();
		},
	};
}

function createVariantPicker<T>(variants: T[]): () => T {
	let remaining = [...variants];
	return () => {
		let picked = pick(remaining);
		remaining = remaining.filter((r) => r !== picked);
		if (remaining.length === 0) remaining = [...variants];
		return picked;
	};
}
