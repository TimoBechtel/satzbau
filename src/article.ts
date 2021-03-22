import { Article, Gender, GrammaticalCase, GrammaticalNumber } from './noun';

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
		case 'none':
			return '';
		case 'indefinite':
			return indefiniteArticle(gender, grammaticalCase, grammaticalNumber);
		case 'definite':
			return definiteArticle(gender, grammaticalCase, grammaticalNumber);
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
