import { adjective } from '../src/adjective';

test('adjectives decline properly', () => {
	const niceCases = {
		sg: {
			definite: {
				nominative: {
					m: 'nette',
					f: 'nette',
					n: 'nette',
				},
				accusative: {
					m: 'netten',
					f: 'nette',
					n: 'nette',
				},
				genitive: {
					m: 'netten',
					f: 'netten',
					n: 'netten',
				},
				dative: {
					m: 'netten',
					f: 'netten',
					n: 'netten',
				},
			},
			indefinite: {
				nominative: {
					m: 'netter',
					f: 'nette',
					n: 'nettes',
				},
				accusative: {
					m: 'netten',
					f: 'nette',
					n: 'nettes',
				},
				genitive: {
					m: 'netten',
					f: 'netten',
					n: 'netten',
				},
				dative: {
					m: 'netten',
					f: 'netten',
					n: 'netten',
				},
			},
			none: {
				nominative: {
					m: 'netter',
					f: 'nette',
					n: 'nettes',
				},
				accusative: {
					m: 'netten',
					f: 'nette',
					n: 'nettes',
				},
				genitive: {
					m: 'netten',
					f: 'netter',
					n: 'netten',
				},
				dative: {
					m: 'nettem',
					f: 'netter',
					n: 'nettem',
				},
			},
		},
		pl: {
			// no gender differences in plural
			definite: {
				nominative: 'netten',
				accusative: 'netten',
				genitive: 'netten',
				dative: 'netten',
			},
			indefinite: {
				nominative: 'netten',
				accusative: 'netten',
				genitive: 'netten',
				dative: 'netten',
			},
			none: {
				nominative: 'nette',
				accusative: 'nette',
				genitive: 'netter',
				dative: 'netten',
			},
		},
	};

	const nice = adjective('nett');
	let singularCaseCount = 0;
	Object.entries(niceCases.sg).forEach(([article, values]) => {
		Object.entries(values).forEach(([gCase, values]) => {
			Object.entries(values).forEach(([gender, expectedWord]) => {
				singularCaseCount++;
				expect(
					nice
						.singular()
						.article(article as any)
						.gender(gender as any)
						[gCase]()
						.write()
				).toBe(expectedWord);
			});
		});
	});
	expect(singularCaseCount).toBe(12 * 3);

	let pluralCaseCount = 0;
	Object.entries(niceCases.pl).forEach(([article, values]) => {
		Object.entries(values).forEach(([gCase, expectedWord]) => {
			pluralCaseCount++;
			for (const gender of ['m', 'n', 'f']) {
				expect(
					nice
						.plural()
						.gender(gender as any)
						.article(article as any)
						[gCase]()
						.write()
				).toBe(expectedWord);
			}
		});
	});
	expect(pluralCaseCount).toBe(4 * 3);
});

test('handles edge cases', () => {
	/**
	 * we do not check for every form (case, number, gender, article)
	 * as the word transformation for edge cases is done on adjective initialization
	 * everything else stays the same as tested in previous test
	 */

	/**
	 * words ending with -e should only contain a single e at the end
	 * e.g. leise => leise instead of leise = leisee
	 */
	const quiet = adjective('leise');
	expect(quiet.write()).toBe('leise');
	expect(quiet.accusative().write()).toBe('leise');
	expect(quiet.genitive().write()).toBe('leisen');
	expect(quiet.dative().write()).toBe('leisen');
	expect(quiet.plural().write()).toBe('leisen');

	/**
	 * words ending with -er after diphthong (ei,au,eu) should not contain an 'e'
	 */
	const pricey = adjective('teuer');
	expect(pricey.write()).toBe('teure');
	expect(pricey.accusative().write()).toBe('teure');
	expect(pricey.genitive().write()).toBe('teuren');
	expect(pricey.dative().write()).toBe('teuren');
	expect(pricey.plural().write()).toBe('teuren');

	/**
	 * others ending in -er should not be modified
	 */
	const tasty = adjective('lecker');
	expect(tasty.write()).toBe('leckere');
	expect(tasty.accusative().write()).toBe('leckere');
	expect(tasty.genitive().write()).toBe('leckeren');
	expect(tasty.dative().write()).toBe('leckeren');
	expect(tasty.plural().write()).toBe('leckeren');

	/**
	 * words ending with -el should switch 'e' with 'l'
	 * e.g. dunkel => dunkle instead of dunkel => dunkele
	 */
	const dark = adjective('dunkel');
	expect(dark.write()).toBe('dunkle');
	expect(dark.accusative().write()).toBe('dunkle');
	expect(dark.genitive().write()).toBe('dunklen');
	expect(dark.dative().write()).toBe('dunklen');
	expect(dark.plural().write()).toBe('dunklen');

	/**
	 * special case: "hoch"
	 */
	const high = adjective('hoch');
	expect(high.nominative().write()).toBe('hohe');
	expect(high.accusative().write()).toBe('hohe');
	expect(high.genitive().write()).toBe('hohen');
	expect(high.dative().write()).toBe('hohen');
});
