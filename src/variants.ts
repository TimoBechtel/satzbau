import { Adjective, adjectiveFactory, isAdjective } from './adjective';
import { isNoun, Noun, nounFactory } from './noun';
import { asString, Writable } from './textHelper';
import { pick } from './utils';

/**
 * Creates a declinable word with different synonyms.
 *
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

export function adjectiveSynonyms(...adjectives: Adjective[]): Adjective {
	const next = variantPicker(adjectives);
	const create = adjectiveFactory(
		({ articleType, gender, grammaticalCase, grammaticalNumber }) => ({
			write() {
				let adj = next();
				if (articleType) adj = adj.article(articleType);
				if (gender) adj = adj.gender(gender);
				if (grammaticalCase) adj = adj[grammaticalCase]();
				if (grammaticalNumber)
					adj = grammaticalNumber === 'p' ? adj.plural() : adj.singular();
				return adj.write();
			},
		})
	);
	return create();
}

export function nounSynonyms(...words: Noun[]): Noun {
	const next = variantPicker(words);
	const create = nounFactory(
		({
			attributes,
			articleType,
			grammaticalCase,
			grammaticalNumber,
			count,
		}) => ({
			write() {
				let word = next();
				if (grammaticalCase) word = word[grammaticalCase]();
				if (grammaticalNumber)
					word = grammaticalNumber === 's' ? word.singular() : word.plural();
				if (articleType) word = word.article(articleType);
				if (attributes.length > 0) word = word.attributes(...attributes);
				if (count) word = word.count(count);
				return word.write();
			},
		})
	);
	return create();
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
