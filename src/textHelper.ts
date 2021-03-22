import { Noun } from './noun';
import { capitalize, trim } from './utils';

export type Writable = {
	write: () => string;
};

export type SupportedTextTypes = Writable | Writable[] | string | string[];

/**
 * Creates a writable sentence.
 * Sentences automatically start with a capital letter
 * and end with a dot.
 * @example const aboutTrains = sentence`ich mag ${train.plural()}`;
 * constole.log(aboutTrains.write()) // -> Ich mag Züge.
 * @param template text parts
 * @param words Writable | Writable[] | string
 * @returns a writable sentence
 */
export function sentence(
	template: TemplateStringsArray,
	...words: SupportedTextTypes[]
): Writable {
	const writableText = text(template, ...words);
	return {
		write() {
			let text = writableText.write();
			text = capitalize(text);
			if (text[text.length - 1] !== '.') text += '.';
			return text;
		},
	};
}

/**
 * Creates a writable text.
 * @example const aboutTrains = sentence`ich mag ${train.plural()}`;
 * console.log(aboutTrains.write()); //=> ich mag Züge
 * @param template text parts
 * @param words Writable | Writable[] | string
 * @returns a writable text
 */
export function text(
	template: TemplateStringsArray,
	...words: SupportedTextTypes[]
): Writable {
	return {
		write() {
			let text = '';
			template.forEach((part, i) => {
				text += part;
				if (words.length > i) {
					if (!words[i]) return;
					if (typeof words[i] === 'string') {
						text += words[i];
					} else if (Array.isArray(words[i])) {
						text += writeList(words[i] as Writable[] | string[]);
					} else {
						text += (words[i] as Noun).write();
					}
				}
			});
			text = trim(text);
			return text;
		},
	};
}

/**
 * generates a textual representation of a list
 * @example writeList([apple, pear, orange]); // => ein Apfel, eine Birne und eine Orange
 * @param words list of words
 * @returns written list
 */
export function writeList(words: (Writable | string)[]): string {
	if (words.length === 0) return '';
	if (words.length === 1) {
		if (typeof words[0] === 'string') return words[0];
		return words[0].write();
	}
	let things: string[] = [];
	let lastThing: string = '';

	words.forEach((word, i) => {
		const last = i === words.length - 1;
		if (!last) {
			if (typeof word === 'string') things.push(word);
			else things.push(word.write());
		} else {
			if (typeof word === 'string') lastThing = word;
			else lastThing = word.write();
		}
	});
	return [things.join(', '), lastThing].join(' und ');
}

/**
 * Creates a render function to dynamically generate texts.
 * @example const info = template`${(props) => props.fruit} ist gelb`; info({fruit: banana});
 * @param templateStrings
 * @param parameterFunctions functions that returns a string or Writable
 * @returns render function that takes properties to render a string
 */
export function template<Props = void>(
	templateStrings: TemplateStringsArray,
	...parameterFunctions: (
		| ((arg: Props) => SupportedTextTypes)
		| SupportedTextTypes
	)[]
): (props: Props) => string {
	return (props) => {
		const nodes = parameterFunctions.map((p) => {
			if (typeof p === 'function') return p(props);
			return p;
		});
		return text(templateStrings, ...nodes).write();
	};
}
