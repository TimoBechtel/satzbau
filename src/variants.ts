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
	function createSynonyms(
		words: Noun[],
		grammaticalCase?: GrammaticalCase,
		grammaticalNumber?: GrammaticalNumber,
		articleType?: Article
	): Noun {
		return {
			article(a) {
				return createSynonyms(words, grammaticalCase, grammaticalNumber, a);
			},
			specific() {
				return createSynonyms(
					words,
					grammaticalCase,
					grammaticalNumber,
					'definite'
				);
			},
			unspecific() {
				return createSynonyms(
					words,
					grammaticalCase,
					grammaticalNumber,
					'indefinite'
				);
			},
			accusative() {
				return createSynonyms(
					words,
					'accusative',
					grammaticalNumber,
					articleType
				);
			},
			dative() {
				return createSynonyms(words, 'dative', grammaticalNumber, articleType);
			},
			genitive() {
				return createSynonyms(
					words,
					'genitive',
					grammaticalNumber,
					articleType
				);
			},
			nominative() {
				return createSynonyms(
					words,
					'nominative',
					grammaticalNumber,
					articleType
				);
			},
			plural() {
				return createSynonyms(words, grammaticalCase, 'p', articleType);
			},
			singular() {
				return createSynonyms(words, grammaticalCase, 's', articleType);
			},
			write() {
				let word = next();
				if (grammaticalCase) word = word[grammaticalCase]();
				if (grammaticalNumber)
					word = grammaticalNumber === 's' ? word.singular() : word.plural();
				if (articleType) word = word.article(articleType);
				return word.write();
			},
		};
	}
	return createSynonyms(words);
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
