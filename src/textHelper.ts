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
					if (Array.isArray(words[i])) {
						text += writeList(words[i] as Writable[] | string[]);
					} else {
						text += asString(words[i] as Writable | string);
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
export function writeList(
	words: (Writable | string)[],
	emptyMessage?: Writable | string
): string {
	let _words = [...words];
	let lastThing: string = asString(_words.pop());
	let things: string[] = _words.map(asString);

	if (!lastThing) return asString(emptyMessage);
	if (things.length === 0) return lastThing;

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

export function asString(word: Writable | string): string {
	if (!word) return '';
	return typeof word === 'string' ? word : word.write();
}
