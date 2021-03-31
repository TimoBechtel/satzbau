import { capitalize, trim } from './utils';

export type Writable<Props = void> = {
	write: Props extends void ? () => string : (props: Props) => string;
};

export type SupportedTextTypes<Props = void> =
	| Writable<Props>
	| Writable[]
	| string
	| string[];

type FormattingOptions = {
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

export type SentenceFormattingOptions = {
	punctuation?: string;
	capitalizeFirstLetter?: boolean;
};

export interface Text<Props = void> extends Writable<Props> {
	/**
	 * returns a new text with the given formatting options
	 */
	formatting(options: FormattingOptions): this;
	/**
	 * returns a new text with the given capitalization option
	 */
	capitalization(capitalize: 'first' | 'none'): this;
	/**
	 * returns a new text that ends in the given string
	 */
	punctuation(character: string): this;
	/**
	 * returns a new text that ends in an exclamation mark
	 */
	shout(): this;
	/**
	 * returns a new text that ends in a question mark
	 */
	ask(): this;
}

/**
 * Creates a writable text.
 * Formatting can be configured through the returned text object.
 * @example const aboutTrains = text`ich mag ${trains}`;
 * console.log(aboutTrains.write()); //=> ich mag Züge
 * @param template text parts
 * @param words Writable | Writable[] | string
 * @returns a writable text
 */
export function text<Props = void>(
	template: TemplateStringsArray,
	...words: (
		| SupportedTextTypes<Props>
		| SupportedTextTypes
		| (() => SupportedTextTypes<Props> | SupportedTextTypes)
		| ((props: Props) => SupportedTextTypes<Props> | SupportedTextTypes)
	)[]
): Text<Props> | Text {
	const create = textFactory<Props>(
		({ capitalizeFirstLetter, punctuation, shortForms, trimWhiteSpace }) => {
			return {
				write(props?: Props) {
					let text = '';
					template.forEach((part, i) => {
						text += part;
						if (words.length > i) {
							let word = words[i];
							if (!word) return;
							if (typeof word === 'function') {
								word = word(props);
							}
							if (Array.isArray(word)) {
								text += writeList(word);
							} else {
								text += asString(word, props);
							}
						}
					});
					if (shortForms) text = beautify(text);
					if (trimWhiteSpace) text = trim(text);
					if (capitalizeFirstLetter) text = capitalize(text);
					if (punctuation) text = text.replace(/[.,:;!?]?$/, punctuation);
					return text;
				},
			};
		}
	);
	return create({
		shortForms: true,
		trimWhiteSpace: true,
		capitalizeFirstLetter: false,
		punctuation: '',
	});
}

export function textFactory<Props>(
	writable: (
		args: FormattingOptions & SentenceFormattingOptions
	) => Writable<Props | void>
): (
	options: FormattingOptions & SentenceFormattingOptions
) => Text<Props | void> {
	return function create(
		args: FormattingOptions & SentenceFormattingOptions
	): Text<Props | void> {
		return {
			ask() {
				return create({ ...args, punctuation: '?' });
			},
			capitalization(t) {
				return create({ ...args, capitalizeFirstLetter: t === 'first' });
			},
			formatting({ shortForms, trimWhiteSpace }) {
				return create({ ...args, shortForms, trimWhiteSpace });
			},
			punctuation(punctuation) {
				return create({ ...args, punctuation });
			},
			shout() {
				return create({ ...args, punctuation: '!' });
			},
			...writable({ ...args }),
		};
	};
}

/**
 * do a few optimizations, like replacing "in dem" with "im"
 */
function beautify(text: string): string {
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
	let things: string[] = _words.map((w) => asString(w));

	if (!lastThing) return asString(emptyMessage);
	if (things.length === 0) return lastThing;

	return [things.join(', '), lastThing].join(' und ');
}

export function asString<Props>(
	word: Writable<Props> | Writable | string,
	props?: Props
): string {
	if (!word) return '';
	return typeof word === 'string' ? word : word.write(props);
}
