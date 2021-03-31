import { Noun } from './noun';
import { Writable } from './text';

export function within(word: Noun): Writable {
	return {
		write() {
			return `in ${word.dative().write()}`;
		},
	};
}

export function into(word: Noun): Writable {
	return {
		write() {
			return `in ${word.accusative().write()}`;
		},
	};
}

export function to(word: Noun): Writable {
	return {
		write() {
			return `zu ${word.dative().write()}`;
		},
	};
}
