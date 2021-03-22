import { generateArticle, parseGenderFromArticle } from './article';
import { Writable } from './textHelper';
import { capitalize } from './utils';

export type Gender = 'f' | 'n' | 'm';
export type GrammaticalCase =
	| 'nominative'
	| 'accusative'
	| 'dative'
	| 'genitive';
export type GrammaticalNumber = 'p' | 's';
export type Article = 'indefinite' | 'definite' | 'none';

export type Noun = {
	article: (type: Article) => Noun;
	specific: () => Noun;
	unspecific: () => Noun;
	plural: () => Noun;
	singular: () => Noun;
	accusative: () => Noun;
	genitive: () => Noun;
	dative: () => Noun;
	nominative: () => Noun;
} & Writable;

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

	let articleType: Article;
	let grammaticalCase: GrammaticalCase;
	let grammaticalNumber: GrammaticalNumber;

	return createNode(
		{ nominativeSg, nominativePl, genitiveSg },
		grammaticalCase,
		grammaticalNumber,
		gender,
		articleType
	);
}

function createNode(
	template: { nominativeSg: string; nominativePl: string; genitiveSg: string },
	grammaticalCase: GrammaticalCase,
	grammaticalNumber: GrammaticalNumber,
	gender: Gender,
	articleType: Article
): Noun {
	function decline(
		grammaticalCase: GrammaticalCase,
		grammaticalNumber: GrammaticalNumber
	): string {
		if (grammaticalNumber === 's') {
			if (grammaticalCase === 'nominative') return template.nominativeSg;
			if (grammaticalCase === 'genitive') return template.genitiveSg;
			if (gender === 'f') return template.nominativeSg;
			if (gender === 'n') {
				if (grammaticalCase === 'accusative') return template.nominativeSg;
				// needs extra care ❤️
				if (template.nominativeSg.toLowerCase() === 'herz')
					return template.nominativePl;
				return template.nominativeSg;
			}
			// maskuline: accusative + dative
			if (isNDeclension(template.nominativeSg)) return template.nominativePl;
			return template.nominativeSg;
		}
		if (grammaticalNumber === 'p') {
			if (
				grammaticalCase === 'dative' &&
				!['s', 'n'].includes(
					template.nominativePl[template.nominativePl.length - 1]
				)
			)
				return template.nominativePl + 'n';
			return template.nominativePl;
		}
	}

	return {
		accusative() {
			return createNode(
				template,
				'accusative',
				grammaticalNumber,
				gender,
				articleType
			);
		},
		dative() {
			return createNode(
				template,
				'dative',
				grammaticalNumber,
				gender,
				articleType
			);
		},
		genitive() {
			return createNode(
				template,
				'genitive',
				grammaticalNumber,
				gender,
				articleType
			);
		},
		nominative() {
			return createNode(
				template,
				'nominative',
				grammaticalNumber,
				gender,
				articleType
			);
		},
		specific() {
			return createNode(
				template,
				grammaticalCase,
				grammaticalNumber,
				gender,
				'definite'
			);
		},
		unspecific() {
			return createNode(
				template,
				grammaticalCase,
				grammaticalNumber,
				gender,
				'indefinite'
			);
		},
		article(type) {
			return createNode(
				template,
				grammaticalCase,
				grammaticalNumber,
				gender,
				type
			);
		},
		plural() {
			return createNode(template, grammaticalCase, 'p', gender, articleType);
		},
		singular() {
			return createNode(template, grammaticalCase, 's', gender, articleType);
		},
		write() {
			let words: string[] = [];
			let k = grammaticalCase || 'nominative';
			let n = grammaticalNumber || 's';
			const article = generateArticle(
				articleType || (n === 's' ? 'indefinite' : 'definite'),
				gender,
				k,
				n
			);
			if (article) words.push(article);
			words.push(capitalize(decline(k, n)));
			return words.join(' ');
		},
	};
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
