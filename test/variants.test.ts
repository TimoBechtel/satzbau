import { noun } from '../src/noun';
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

test('allows creating declinable synonyms', () => {
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
