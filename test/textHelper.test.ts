import { noun } from '../src/noun';
import {
	sentence,
	SupportedTextTypes,
	template,
	text,
	writeList,
} from '../src/textHelper';
import { variants } from '../src/variants';

test('generates a textual representation of a list', () => {
	const list = [
		'a',
		variants('b'),
		noun('der clown, die clowns, des clowns'),
		'Bertha',
	];
	expect(writeList(list)).toBe('a, b, ein Clown und Bertha');
	expect(writeList(list)).toBe('a, b, ein Clown und Bertha'); // should not have side effects :sweat_smiley:

	expect(writeList(['ein wort'])).toBe('ein wort');
	expect(writeList(['eins', 'zwei'])).toBe('eins und zwei');

	expect(writeList([])).toBe('');
});

test('creates a writable sentence that adds a dot and capitalizes the first letter', () => {
	const test = noun('der test, die tests, des tests').article('none');

	const test1 = sentence`dies ist ein generischer ${test}`;
	expect(test1.write()).toBe('Dies ist ein generischer Test.');

	const test2 = sentence`
		Dies ist ein 

			weiterer ${['generischer', 'langweiliger', 'unkreativer']} ${test}

			${text`(und ein weiterer Satz in einem Satz)`}
	`;
	expect(test2.write()).toBe(
		'Dies ist ein weiterer generischer, langweiliger und unkreativer Test (und ein weiterer Satz in einem Satz).'
	);
});

test('creates a render function with props', () => {
	const render = template`
		Du hast folgende Items in deinem Inventar:
		${({ items }: { items: SupportedTextTypes }) => sentence`${items}`}
	`;

	const items = [
		noun('der stock, die stöcke, des stocks'),
		noun('der stein, die steine, des steins'),
		noun('die axt, die äxte, der axt'),
	];

	expect(render({ items })).toBe(
		'Du hast folgende Items in deinem Inventar: Ein Stock, ein Stein und eine Axt.'
	);

	expect(render({ items: [text`nichts`] })).toBe(
		'Du hast folgende Items in deinem Inventar: Nichts.'
	);
});
