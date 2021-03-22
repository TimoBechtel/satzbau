import { capitalize, pick, trim } from '../src/utils';

test('trims whitespace and newlines', () => {
	const testString = `
		This is just   a

			test.
	`;
	expect(trim(testString)).toBe('This is just a test.');
});

test('capitalizes string', () => {
	const word = 'this is a test';
	expect(capitalize(word)).toBe('This is a test');
});

test('picks a random item from a list', () => {
	const items = ['a', 'c', 'c'];
	expect(items.includes(pick(items))).toBe(true);
	expect(items.includes(pick(items))).toBe(true);
	expect(items.includes(pick(items))).toBe(true);
	expect(items.includes(pick(items))).toBe(true);
});
