import { generateArticle, parseGenderFromArticle } from '../src/article';

test('parses gender from article', () => {
	let test;

	test = {
		article: 'der',
		gender: 'm',
	};

	expect(parseGenderFromArticle(test.article)).toBe(test.gender);

	test = {
		article: 'die',
		gender: 'f',
	};

	expect(parseGenderFromArticle(test.article)).toBe(test.gender);

	test = {
		article: 'das',
		gender: 'n',
	};

	expect(parseGenderFromArticle(test.article)).toBe(test.gender);

	test = {
		article: 'not an article',
		gender: undefined,
	};

	expect(parseGenderFromArticle(test.article)).toBe(test.gender);
});

test('generates article', () => {
	const articles = {
		definite: {
			s: {
				nominative: {
					f: 'die',
					m: 'der',
					n: 'das',
				},
				accusative: {
					f: 'die',
					m: 'den',
					n: 'das',
				},
				dative: {
					f: 'der',
					m: 'dem',
					n: 'dem',
				},
				genitive: {
					f: 'der',
					m: 'des',
					n: 'des',
				},
			},
			p: {
				nominative: {
					f: 'die',
					m: 'die',
					n: 'die',
				},
				accusative: {
					f: 'die',
					m: 'die',
					n: 'die',
				},
				dative: {
					f: 'den',
					m: 'den',
					n: 'den',
				},
				genitive: {
					f: 'der',
					m: 'der',
					n: 'der',
				},
			},
		},
		indefinite: {
			s: {
				nominative: {
					f: 'eine',
					m: 'ein',
					n: 'ein',
				},
				accusative: {
					f: 'eine',
					m: 'einen',
					n: 'ein',
				},
				dative: {
					f: 'einer',
					m: 'einem',
					n: 'einem',
				},
				genitive: {
					f: 'einer',
					m: 'eines',
					n: 'eines',
				},
			},
		},
		negation: {
			s: {
				nominative: {
					f: 'keine',
					m: 'kein',
					n: 'kein',
				},
				accusative: {
					f: 'keine',
					m: 'keinen',
					n: 'kein',
				},
				dative: {
					f: 'keiner',
					m: 'keinem',
					n: 'keinem',
				},
				genitive: {
					f: 'keiner',
					m: 'keines',
					n: 'keines',
				},
			},
		},
	};
	Object.entries(articles).forEach(([specificity, value]) => {
		Object.entries(value).forEach(([number, value]) => {
			Object.entries(value).forEach(([gram_case, value]) => {
				Object.entries(value).forEach(([gender, article]) => {
					expect(
						generateArticle(
							specificity as any,
							gender as any,
							gram_case as any,
							number as any
						)
					).toBe(article);
					// console.log(`generateArticle(
					// 		${specificity} as any,
					// 		${gender} as any,
					// 		${gram_case} as any,
					// 		${number} as any
					// 	)`);
				});
			});
		});
	});
	expect(generateArticle('none', 'n', 'accusative', 's')).toBe('');
});
