import { Article, Gender, GrammaticalCase, GrammaticalNumber } from './noun';
import { Declinable, WithArticleType } from './word';

export interface Adjective extends Declinable, WithArticleType {
	gender: (gender: Gender) => this;
}

export function adjective(template: string): Adjective {
	/**
	 * removes e at the end
	 * e.g. leise => leis
	 * 	  teuer => teur
	 */
	let stem = template.replace(/e([rl]?)$/, '$1');

	/**
	 * hoch => hoh
	 */
	stem = stem.replace(/ch$/, 'h');

	function decline({
		articleType = 'definite',
		gender = 'n',
		grammaticalCase = 'nominative',
		grammaticalNumber = 's',
	}: {
		grammaticalCase: GrammaticalCase;
		grammaticalNumber: GrammaticalNumber;
		gender: Gender;
		articleType: Article;
	}) {
		if (grammaticalNumber === 'p') {
			if (articleType !== 'none' || grammaticalCase === 'dative')
				return stem + 'en';
			if (grammaticalCase === 'nominative' || grammaticalCase === 'accusative')
				return stem + 'e';
			return stem + 'r';
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

	function create({
		grammaticalCase,
		grammaticalNumber,
		gender,
		articleType,
	}: {
		grammaticalCase?: GrammaticalCase;
		grammaticalNumber?: GrammaticalNumber;
		gender?: Gender;
		articleType?: Article;
	} = {}): Adjective {
		return {
			accusative() {
				return create({
					articleType,
					gender,
					grammaticalCase: 'accusative',
					grammaticalNumber,
				});
			},
			dative() {
				return create({
					articleType,
					gender,
					grammaticalCase: 'dative',
					grammaticalNumber,
				});
			},
			genitive() {
				return create({
					articleType,
					gender,
					grammaticalCase: 'genitive',
					grammaticalNumber,
				});
			},
			nominative() {
				return create({
					articleType,
					gender,
					grammaticalCase: 'nominative',
					grammaticalNumber,
				});
			},
			singular() {
				return create({
					articleType,
					gender,
					grammaticalCase,
					grammaticalNumber: 's',
				});
			},
			plural() {
				return create({
					articleType,
					gender,
					grammaticalCase,
					grammaticalNumber: 'p',
				});
			},
			article(type) {
				return create({
					articleType: type,
					gender,
					grammaticalCase,
					grammaticalNumber,
				});
			},
			gender(gender) {
				return create({
					articleType,
					gender: gender,
					grammaticalCase,
					grammaticalNumber,
				});
			},
			write() {
				return decline({
					articleType,
					gender,
					grammaticalCase,
					grammaticalNumber,
				});
			},
		};
	}
	return create();
}
