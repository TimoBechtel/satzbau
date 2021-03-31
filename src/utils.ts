export function capitalize(word: string): string {
	if (!word) return word;
	return word[0].toUpperCase() + word.slice(1);
}

/**
 * trims whitespace and line breaks
 */
export function trim(text: string) {
	return text
		.replace(/[\n\r]/g, '')
		.replace(/[\s\t]+/g, ' ')
		.trim();
}

export function pick<T>(list: T[]): T {
	return list[Math.floor(Math.random() * list.length)];
}
