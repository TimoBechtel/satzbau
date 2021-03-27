import { capitalize, trim } from './utils';

export type Writable<Options = {}> = {
	write: (options?: Options) => string;
};

export type SupportedTextTypes = Writable | Writable[] | string | string[];

type TextOptions = {
	/**
	 * automatically use short forms.
	 * e.g. "im" instead of "in dem"
	 */
	shortForms?: boolean;
	/**
	 * trims whitespace and line breaks
	 */
	trimWhiteSpace?: boolean;
};

/**
 * Creates a writable sentence.
 *
 * Sentences automatically start with a capital letter
 * and end with a dot.
 * @example const aboutTrains = sentence`ich mag ${train.plural()}`;
 * constole.log(aboutTrains.write()) // -> Ich mag Züge.
 * @param template text parts
 * @param words Writable | Writable[] | string
 * @returns a writable sentence
 */
type SentenceOptions = {
	punctuation?: string;
	capitalizeFirstLetter?: boolean;
};
export function sentence(
	template: TemplateStringsArray,
	...words: SupportedTextTypes[]
): Writable<TextOptions & SentenceOptions> {
	const writableText = text(template, ...words);
	return {
		write({
			shortForms,
			punctuation = '.',
			trimWhiteSpace,
			capitalizeFirstLetter = true,
		} = {}) {
			let text = writableText.write({ shortForms, trimWhiteSpace });
			if (capitalizeFirstLetter) text = capitalize(text);
			if (punctuation) text = text.replace(/[.,:;!?]?$/, punctuation);
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
): Writable<TextOptions> {
	return {
		write({ shortForms = true, trimWhiteSpace = true } = {}) {
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
			if (shortForms) text = beautify(text);
			if (trimWhiteSpace) text = trim(text);
			return text;
		},
	};
}

/**
 * do a few optimizations, like replacing "in dem" with "im"
 */
function beautify(text: string): string {
	// replace "in dem" with "im", as this sound more natural
	text = text.replace(/\bin dem\b/, 'im');
	text = text.replace(/\bin das\b/, 'ins');
	text = text.replace(/\zu dem\b/, 'zum');
	text = text.replace(/\zu der\b/, 'zur');
	return text;
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
): (props: Props, options?: TextOptions & SentenceOptions) => string {
	return (props, options = {}) => {
		const nodes = parameterFunctions.map((p) => {
			if (typeof p === 'function') return p(props);
			return p;
		});
		return sentence(templateStrings, ...nodes).write(options);
	};
}

export function asString(word: Writable | string): string {
	if (!word) return '';
	return typeof word === 'string' ? word : word.write();
}
