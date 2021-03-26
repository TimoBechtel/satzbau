import { adjective } from '../src/adjective';

test('adjectives decline properly', () => {
	// TODO: test properly

	const red = adjective('rot');
	expect(red.write()).toBe('rote');
	expect(red.accusative().write()).toBe('rote');
	expect(red.genitive().write()).toBe('roten');
	expect(red.dative().write()).toBe('roten');
	expect(red.plural().write()).toBe('roten');

	const quite = adjective('leise');
	expect(quite.write()).toBe('leise');
	expect(quite.accusative().write()).toBe('leise');
	expect(quite.genitive().write()).toBe('leisen');
	expect(quite.dative().write()).toBe('leisen');
	expect(quite.plural().write()).toBe('leisen');

	const pricey = adjective('teuer');
	expect(pricey.write()).toBe('teure');
	expect(pricey.accusative().write()).toBe('teure');
	expect(pricey.genitive().write()).toBe('teuren');
	expect(pricey.dative().write()).toBe('teuren');
	expect(pricey.plural().write()).toBe('teuren');

	const high = adjective('hoch');
	expect(high.write()).toBe('hohe');
	expect(high.accusative().write()).toBe('hohe');
	expect(high.genitive().write()).toBe('hohen');
	expect(high.dative().write()).toBe('hohen');
	expect(high.plural().write()).toBe('hohen');

	let adj = adjective('dunkel');
	expect(adj.write()).toBe('dunkle');
	expect(adj.accusative().write()).toBe('dunkle');
	expect(adj.genitive().write()).toBe('dunklen');
	expect(adj.dative().write()).toBe('dunklen');
	expect(adj.plural().write()).toBe('dunklen');

	adj = adj.gender('m').article('indefinite');
	expect(adj.write()).toBe('dunkler');
	expect(adj.accusative().write()).toBe('dunklen');
	expect(adj.genitive().write()).toBe('dunklen');
	expect(adj.dative().write()).toBe('dunklen');
	expect(adj.plural().write()).toBe('dunklen');

	adj = adj.gender('f').article('indefinite');
	expect(adj.write()).toBe('dunkle');
	expect(adj.accusative().write()).toBe('dunkle');
	expect(adj.genitive().write()).toBe('dunklen');
	expect(adj.dative().write()).toBe('dunklen');
	expect(adj.plural().write()).toBe('dunklen');
});
