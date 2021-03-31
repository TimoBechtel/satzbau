import { adjective, Adjective } from './adjective';
import {
	generateArticle,
	parseGenderFromArticle,
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
import { number } from './number';
import { Writable } from './text';
import { capitalize } from './utils';

export interface Noun
	extends Declinable<Noun>,
		WithArticleType<Noun>,
		Writable {
	/**
	 * returns a noun with a definite article.
	 *
	 * (e.g. nominative sg: "der" | "die" | "das")
	 */
	specific: () => this;
	/**
	 * returns a noun with an indefinite article.
	 *
	 * (e.g. nominative sg: "einer" | "eine" | "eines")
	 */
	unspecific: () => this;
	/**
	 * returns a noun with a negated article.
	 *
	 * (e.g. nominative sg: "keiner" | "keine" | "keines")
	 */
	negated: () => Noun;
	/**
	 * returns a noun with a given count
	 * @example apple.count(4) => "vier Äpfel"
	 */
	count: (n: number) => Noun;
	/**
	 * returns a noun with the given adjectives.
	 *
	 * adjectives will automatically mirror the nouns declension
	 * @param adjectives...  adjectives or strings
	 */
	attributes: (...adjectives: (Adjective | string)[]) => this;
}

export function isNoun(obj: any): obj is Noun {
	return (obj as Noun).attributes !== undefined;
}

/**
 * Creates a declinable noun.
 * For this to work, you need to provide this function with
 * the word + an article (der/die/das)
 * in the forms nominative singular, nominative plural and genitive singular.
 * You can also create an adjective-noun combination, e.g. "der blaue Himmel".
 * @param template template; syntax: 'ARTICLE WORD_SINGULAR, [ART.] W.PLURAL, [ART.] W.GENITIVE_PLURAL'
 * @example noun('das auto, die autos, des autos');
 */
export function noun(template: string): Noun {
	const declensions = template.split(',');
	if (declensions.length < 3) throw 'Wrong template syntax';

	const nominativeWords = declensions[0].trim().split(' ');
	const templateArticle = nominativeWords[0].trim();

	let gender: Gender = parseGenderFromArticle(templateArticle);
	if (!gender) throw 'Could not detect gender.';

	let nominativeSg: string;
	let definingAdjective: Adjective;
	if (nominativeWords.length > 2) {
		definingAdjective = adjective(nominativeWords[1]);
		nominativeSg = nominativeWords[2];
	} else {
		nominativeSg = nominativeWords[1];
	}

	let nominativePl = declensions[1].trim().split(' ').pop().trim();
	let genitiveSg = declensions[2].trim().split(' ').pop().trim();

	// when only endings are provided
	if (nominativePl[0] === '-')
		nominativePl = nominativeSg + nominativePl.slice(1);
	if (genitiveSg[0] === '-') genitiveSg = nominativeSg + genitiveSg.slice(1);

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

	const create = nounFactory(
		({
			articleType,
			attributes = [],
			grammaticalCase,
			grammaticalNumber,
			count,
			definingAdjective,
		}) => ({
			write() {
				let words: string[] = [];

				// generate defaults if parameters are not explicitly set
				count = grammaticalNumber === 's' ? undefined : count;
				grammaticalCase = grammaticalCase || 'nominative';
				grammaticalNumber = grammaticalNumber || 's';
				if (!articleType) {
					if (count) {
						articleType = 'none';
					} else {
						articleType = grammaticalNumber === 's' ? 'indefinite' : 'definite';
					}
				}

				const article = generateArticle(
					articleType,
					gender,
					grammaticalCase,
					grammaticalNumber
				);
				if (article) words.push(article);
				if (count && count !== 1) {
					words.push(number(count));
				}
				const attributesString = attributes
					.map((a) => {
						let attribute: Adjective = a[grammaticalCase]()
							.article(articleType)
							.gender(gender);
						attribute =
							grammaticalNumber === 'p'
								? attribute.plural()
								: attribute.singular();
						return attribute.write();
					})
					.join(', ');
				if (attributesString.length > 0) words.push(attributesString);

				if (definingAdjective) {
					let adjective: Adjective = definingAdjective[grammaticalCase]()
						.article(articleType)
						.gender(gender);
					adjective =
						grammaticalNumber === 'p'
							? adjective.plural()
							: adjective.singular();
					words.push(adjective.write());
				}

				words.push(capitalize(decline(grammaticalCase, grammaticalNumber)));
				return words.join(' ');
			},
		})
	);

	return create({ definingAdjective });
}

type NounArgs = {
	definingAdjective?: Adjective;
	attributes?: Adjective[];
	count?: number;
} & DeclinableArgs &
	WithArticleArgs;

export function nounFactory(
	writable: (args: NounArgs) => Writable
): (args?: NounArgs) => Noun {
	return function create(args: NounArgs = { attributes: [] }): Noun {
		return {
			specific() {
				return this.article('definite');
			},
			unspecific() {
				return this.article('indefinite');
			},
			negated() {
				return this.article('negation');
			},
			count(c) {
				if (c === 1)
					return args.articleType === 'negation'
						? this.unspecific().singular()
						: this.singular();
				if (c <= 0) return this.negated();
				return create({ ...args, grammaticalNumber: 'p', count: c });
			},
			attributes(...adjectivesOrStrings) {
				const adjectives = adjectivesOrStrings.map((a) =>
					typeof a === 'string' ? adjective(a) : a
				);
				return create({ ...args, attributes: adjectives });
			},
			...withArticleMixin(create)(args),
			...declinableMixin(create)(args),
			...writable({ ...args }),
		};
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
