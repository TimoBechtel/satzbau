import { text, within } from '../src';
import { adjective } from '../src/adjective';
import { noun } from '../src/noun';
import { sentence } from '../src/sentence';
import { synonyms, variants } from '../src/variants';

test('always picks a different variant', () => {
	const items = ['a', 'b', noun('der affe, die affen, des affen')];
	const item = variants(...items);
	let last = item.write(); // 1

	let next = item.write(); // 2
	expect(next).not.toBe(last);
	last = next;

	next = item.write(); // 3
	expect(next).not.toBe(last);
	last = next;
});

test('allows creating declinable synonyms for nouns', () => {
	const light = synonyms(
		noun('das licht, die lichter, des lichtes'),
		noun('die lampe, die lampen, der lampe'),
		noun('die beleuchtung, die beleuchtungen, der beleuchtung')
	);
	const expected = ['den Lichtern', 'den Lampen', 'den Beleuchtungen'];

	expect(expected).toContain(light.dative().plural().write());
	expect(expected).toContain(light.dative().plural().write());
	expect(expected).toContain(light.dative().plural().write());
});

test('allows creating declinable synonyms for adjectives', () => {
	const easy = synonyms(
		adjective('leicht'),
		adjective('simpel'),
		adjective('einfach')
	)
		.genitive()
		.plural();

	const expected = ['leichten', 'simplen', 'einfachen'];

	expect(expected).toContain(easy.write());
	expect(expected).toContain(easy.write());
	expect(expected).toContain(easy.write());
});

test('allows adding adjective synonyms to nouns', () => {
	const easy = synonyms(
		adjective('leicht'),
		adjective('simpel'),
		adjective('einfach')
	)
		.genitive()
		.plural();
	const task = synonyms(
		noun('die aufgabe,-n,-'),
		noun('der job,-s,-s')
	).attributes(easy);

	const expected = [
		'Eine einfache Aufgabe.',
		'Eine simple Aufgabe.',
		'Eine leichte Aufgabe.',
		'Ein leichter Job.',
		'Ein simpler Job.',
		'Ein einfacher Job.',
	];
	expect(expected).toContain(sentence`${task}`.write());
	expect(expected).toContain(sentence`${task}`.write());
	expect(expected).toContain(sentence`${task}`.write());
	expect(expected).toContain(sentence`${task}`.write());
	expect(expected).toContain(sentence`${task}`.write());
	expect(expected).toContain(sentence`${task}`.write());
});

test('creates sentence variants with props', () => {
	const kilometer = noun('der kilometer,-,-s').accusative();
	const followRoad = variants(
		sentence`der Straße für ${(km: number) =>
			kilometer.count(km).attributes('weiter')} folgen`,
		sentence`folgen Sie der Straße für ${(km) =>
			kilometer.count(km).attributes('weiter')}`,
		sentence`einfach ${(km) => kilometer.count(km)} weiter geradeaus`,
		text`${sentence`immer der Nase nach`} ${sentence`${(km) =>
			within(kilometer.count(km))} sollten Sie angekommen sein`}`
	);

	const expected = [
		'Der Straße für drei weitere Kilometer folgen.',
		'Folgen Sie der Straße für drei weitere Kilometer.',
		'Einfach drei Kilometer weiter geradeaus.',
		'Immer der Nase nach. In drei Kilometern sollten Sie angekommen sein.',
	];

	expect(expected).toContain(followRoad.write(3));
	expect(expected).toContain(followRoad.write(3));
	expect(expected).toContain(followRoad.write(3));
	expect(expected).toContain(followRoad.write(3));
});
