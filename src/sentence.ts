import { SupportedTextTypes, text, Text } from './text';

/**
 * Creates a writable sentence.
 *
 * Alias to `text` with capitalization and punctuation already set.
 * Formatting can be configured through the returned text object.
 * @example const aboutTrains = sentence`ich mag ${train.plural()}`;
 * constole.log(aboutTrains.shout().write()) // -> Ich mag Züge!
 * @returns a writable sentence
 */
export function sentence<Props = void>(
	template: TemplateStringsArray,
	...words: (
		| SupportedTextTypes<Props>
		| SupportedTextTypes
		| (() => SupportedTextTypes<Props> | SupportedTextTypes)
		| ((props: Props) => SupportedTextTypes<Props> | SupportedTextTypes)
	)[]
): Text<Props> | Text {
	const writableText = text(template, ...words);
	return writableText.capitalization('first').punctuation('.');
}
