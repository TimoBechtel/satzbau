import { Noun, noun } from '../src/noun';
import { sentence } from '../src/sentence';
import { text, Writable, writeList } from '../src/text';
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

test('created sentences automatically optimizes a few words', () => {
	const plane = noun('das flugzeug,-e,-s');
	expect(sentence`ich sitze in ${plane.dative().specific()}`.write()).toBe(
		'Ich sitze im Flugzeug.'
	);
	expect(sentence`ich laufe zu ${plane.dative().specific()}`.write()).toBe(
		'Ich laufe zum Flugzeug.'
	);
});

test('creates a render function with props', () => {
	const youHave = sentence`
		du hast folgende Items in deinem Inventar:
		${({ items }: { items: Writable[] }) => sentence`${items}`}
	`;

	const items = [
		noun('der stock, die stöcke, des stocks'),
		noun('der stein, die steine, des steins'),
		noun('die axt, die äxte, der axt'),
	];

	expect(youHave.write({ items })).toBe(
		'Du hast folgende Items in deinem Inventar: Ein Stock, ein Stein und eine Axt.'
	);

	expect(youHave.write({ items: [text`nichts`] })).toBe(
		'Du hast folgende Items in deinem Inventar: Nichts.'
	);
});

test('allows creating nested template functions', () => {
	const listItems = sentence`${(items: Noun[]) => items}`;
	const youSeePills = text`
		${sentence`du siehst`.punctuation(':')}
		${listItems}
	`;
	const pill = noun('die pille,-n,-').accusative();
	const items = [
		pill.attributes('rot'),
		pill.attributes('blau'),
		pill.attributes('grün'),
	];
	expect(youSeePills.write(items)).toBe(
		'Du siehst: Eine rote Pille, eine blaue Pille und eine grüne Pille.'
	);
});
