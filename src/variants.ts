import { Adjective, adjectiveSynonyms, isAdjective } from './adjective';
import { isNoun, Noun, nounSynonyms } from './noun';
import { asString, Writable } from './textHelper';
import { pick } from './utils';

/**
 * Creates a declinable word with different synonyms.
 * It works just like a single word, only that
 * it chooses a different synonym every time it is rendered.
 * @example
 * const car = synonyms(
 *      noun('das auto,autos,autos'),
 *      noun('der wagen,wagen,wagens')
 * );
 * console.log(car.dative().plural().write());
 * @param words
 * @returns declinable word
 */
export function synonyms(...words: Noun[]): Noun;
export function synonyms(...words: Adjective[]): Adjective;
export function synonyms(...words: (Noun | Adjective)[]): Noun | Adjective {
	if (isAdjective(words[0]))
		return adjectiveSynonyms(...(words as Adjective[]));
	if (isNoun(words[0])) return nounSynonyms(...(words as Noun[]));
	return;
}

/**
 * Creates a writable text node.
 * It chooses a different variant each time it is rendered.
 * @param words
 * @returns writable text node
 */
export function variants(...words: (Writable | string)[]): Writable {
	const next = variantPicker(words);
	return {
		write: () => asString(next()),
	};
}

export function variantPicker<T>(variants: T[]): () => T {
	let remaining = [...variants];
	return () => {
		let picked = pick(remaining);
		remaining = remaining.filter((r) => r !== picked);
		if (remaining.length === 0) remaining = [...variants];
		return picked;
	};
}
