import { Gender, GrammaticalCase, GrammaticalNumber } from './declinable';

export type Article = 'indefinite' | 'definite' | 'none' | 'negation';

export function parseGenderFromArticle(article: string): Gender {
	switch (article) {
		case 'die':
			return 'f';
		case 'das':
			return 'n';
		case 'der':
			return 'm';
		default:
			return;
	}
}

export function generateArticle(
	type: Article,
	gender: Gender,
	grammaticalCase: GrammaticalCase,
	grammaticalNumber: GrammaticalNumber
): string {
	switch (type) {
		case 'indefinite':
			return indefiniteArticle(gender, grammaticalCase, grammaticalNumber);
		case 'definite':
			return definiteArticle(gender, grammaticalCase, grammaticalNumber);
		case 'negation':
			return negatedIndefiniteArticle(
				gender,
				grammaticalCase,
				grammaticalNumber
			);
		default:
			return '';
	}
}

function indefiniteArticle(
	gender: Gender,
	grammaticalCase: GrammaticalCase,
	grammaticalNumber: GrammaticalNumber
): string {
	if (grammaticalNumber === 's') {
		if (gender === 'f') {
			if (grammaticalCase === 'nominative' || grammaticalCase === 'accusative')
				return 'eine';
			return 'einer';
		}
		if (gender === 'n') {
			if (grammaticalCase === 'nominative' || grammaticalCase === 'accusative')
				return 'ein';
			if (grammaticalCase === 'dative') return 'einem';
			if (grammaticalCase === 'genitive') return 'eines';
		}
		if (gender === 'm') {
			if (grammaticalCase === 'nominative') return 'ein';
			if (grammaticalCase === 'accusative') return 'einen';
			if (grammaticalCase === 'dative') return 'einem';
			if (grammaticalCase === 'genitive') return 'eines';
		}
	}
	return '';
}

function negatedIndefiniteArticle(
	gender: Gender,
	grammaticalCase: GrammaticalCase,
	grammaticalNumber: GrammaticalNumber
): string {
	if (grammaticalNumber === 's') {
		return 'k' + indefiniteArticle(gender, grammaticalCase, grammaticalNumber);
	}
	if (grammaticalNumber === 'p') {
		if (grammaticalCase === 'nominative' || grammaticalCase === 'accusative')
			return 'keine';
		if (grammaticalCase === 'genitive') return 'keiner';
		return 'keinen'; // genitive
	}
}

function definiteArticle(
	gender: Gender,
	grammaticalCase: GrammaticalCase,
	grammaticalNumber: GrammaticalNumber
): string {
	if (grammaticalNumber === 'p') {
		if (grammaticalCase === 'nominative' || grammaticalCase === 'accusative')
			return 'die';
		if (grammaticalCase === 'genitive') return 'der';
		return 'den'; // genitive
	}
	if (gender === 'f') {
		if (grammaticalCase === 'nominative' || grammaticalCase === 'accusative')
			return 'die';
		return 'der';
	}
	if (gender === 'n') {
		if (grammaticalCase === 'nominative' || grammaticalCase === 'accusative')
			return 'das';
		if (grammaticalCase === 'dative') return 'dem';
		return 'des'; // genitive
	}
	if (gender === 'm') {
		if (grammaticalCase === 'nominative') return 'der';
		if (grammaticalCase === 'accusative') return 'den';
		if (grammaticalCase === 'dative') return 'dem';
		return 'des'; // genitive
	}
}

export interface WithArticleType<T> {
	article: (type: Article) => T;
}

export type WithArticleArgs = {
	articleType?: Article;
};

export function withArticleMixin<
	T extends WithArticleType<T>,
	Args extends WithArticleArgs
>(constructor: (args: Args) => T): (args: Args) => WithArticleType<T> {
	return function create(args: Args): WithArticleType<T> {
		return {
			article(type) {
				return constructor({ ...args, articleType: type });
			},
		};
	};
}
