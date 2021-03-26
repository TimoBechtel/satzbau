import { adjective, Adjective } from './adjective';
import { generateArticle, parseGenderFromArticle } from './article';
import { capitalize } from './utils';
import { Declinable, WithArticleType } from './word';

export type Gender = 'f' | 'n' | 'm';
export type GrammaticalCase =
	| 'nominative'
	| 'accusative'
	| 'dative'
	| 'genitive';
export type GrammaticalNumber = 'p' | 's';
export type Article = 'indefinite' | 'definite' | 'none';

export interface Noun extends Declinable, WithArticleType {
	specific: () => this;
	unspecific: () => this;
	attributes: (...adjectives: (Adjective | string)[]) => this;
}

/**
 * Creates a declinable noun.
 * For this to work, you need to provide this function with
 * the word with an article (der/die/das) and
 * in the form nominative singular, nominative plural and genitive singular.
 * @param template template; syntax: 'ARTICLE WORD_SINGULAR, [ART.] W.PLURAL, [ART.] W.GENITIVE_PLURAL'
 * @example noun('das auto, die autos, des autos');
 */
export function noun(template: string): Noun {
	const declensions = template.split(',');
	if (declensions.length < 3) throw 'Wrong template syntax';

	const templateArticle = declensions[0].trim().split(' ')[0].trim();

	let gender: Gender = parseGenderFromArticle(templateArticle);
	if (!gender) throw 'Could not detect gender.';

	let nominativeSg = declensions[0].trim().split(' ')[1].trim();
	let nominativePl = declensions[1].trim().split(' ').pop().trim();
	let genitiveSg = declensions[2].trim().split(' ').pop().trim();

	// when only endings are provided
	if (nominativePl[0] === '-')
		nominativePl = nominativeSg + nominativePl.slice(1);
	if (genitiveSg[0] === '-') genitiveSg = nominativeSg + genitiveSg.slice(1);

	function create({
		articleType,
		attributes = [],
		grammaticalCase,
		grammaticalNumber,
	}: {
		grammaticalCase?: GrammaticalCase;
		grammaticalNumber?: GrammaticalNumber;
		articleType?: Article;
		attributes?: Adjective[];
	} = {}): Noun {
		function decline(
			grammaticalCase: GrammaticalCase,
			grammaticalNumber: GrammaticalNumber
		): string {
			if (grammaticalNumber === 's') {
				if (grammaticalCase === 'nominative') return nominativeSg;
				if (grammaticalCase === 'genitive') return genitiveSg;
				if (gender === 'f') return nominativeSg;
				if (gender === 'n') {
					if (grammaticalCase === 'accusative') return nominativeSg;
					// needs extra care ❤️
					if (nominativeSg.toLowerCase() === 'herz') return nominativePl;
					return nominativeSg;
				}
				// maskuline: accusative + dative
				if (isNDeclension(nominativeSg)) return nominativePl;
				return nominativeSg;
			}
			if (grammaticalNumber === 'p') {
				if (
					grammaticalCase === 'dative' &&
					!['s', 'n'].includes(nominativePl[nominativePl.length - 1])
				)
					return nominativePl + 'n';
				return nominativePl;
			}
		}

		return {
			accusative() {
				return create({
					grammaticalCase: 'accusative',
					grammaticalNumber,
					articleType,
					attributes,
				});
			},
			dative() {
				return create({
					grammaticalCase: 'dative',
					grammaticalNumber,
					articleType,
					attributes,
				});
			},
			genitive() {
				return create({
					grammaticalCase: 'genitive',
					grammaticalNumber,
					articleType,
					attributes,
				});
			},
			nominative() {
				return create({
					grammaticalCase: 'nominative',
					grammaticalNumber,
					articleType,
					attributes,
				});
			},
			specific() {
				return this.article('definite');
			},
			unspecific() {
				return this.article('indefinite');
			},
			article(type) {
				return create({
					grammaticalCase,
					grammaticalNumber,
					articleType: type,
					attributes,
				});
			},
			attributes(...adjectivesOrStrings) {
				const adjectives = adjectivesOrStrings.map((a) =>
					typeof a === 'string' ? adjective(a) : a
				);
				return create({
					grammaticalCase,
					grammaticalNumber,
					articleType,
					attributes: adjectives,
				});
			},
			plural() {
				return create({
					grammaticalCase,
					grammaticalNumber: 'p',
					articleType,
					attributes,
				});
			},
			singular() {
				return create({
					grammaticalCase,
					grammaticalNumber: 's',
					articleType,
					attributes,
				});
			},
			write() {
				let words: string[] = [];
				let k = grammaticalCase || 'nominative';
				let n = grammaticalNumber || 's';
				let t = articleType || (n === 's' ? 'indefinite' : 'definite');
				const article = generateArticle(t, gender, k, n);
				if (article) words.push(article);
				const attributesString = attributes
					.map((a) => {
						let attribute: Adjective = a[k]().article(t).gender(gender);
						attribute = n === 'p' ? attribute.plural() : attribute.singular();
						return attribute.write();
					})
					.join(', ');
				if (attributesString.length > 0) words.push(attributesString);
				words.push(capitalize(decline(k, n)));
				return words.join(' ');
			},
		};
	}
	return create();
}

/**
 * maskulin words that end with these strings
 * belong to the n-declension and need special treatment
 */
const nDeclensionEndings = [
	'e',
	'et',
	'ad',
	'at',
	'it',
	'ik',
	'ot',
	'ut',
	'bär',
	'and',
	'ant',
	'aut',
	'ent',
	'eut',
	'ist',
	'nom',
	'urg',
	'isk',
	'und',
	'soph',
	'arch',
	'held',
	'graf',
	'graph',
	'herr',
	'bauer',
	'depp',
	'narr',
	'mensch',
	'prinz',
	'nachbar',
	'architekt',
];

function isNDeclension(word: string): boolean {
	word = word.toLowerCase();
	if (word === 'staat') return false; // this would otherwise match '-at'
	for (const ending of nDeclensionEndings) {
		const endingIndex = word.indexOf(ending);
		if (endingIndex > -1 && endingIndex === word.length - ending.length)
			return true;
	}
	return false;
}
