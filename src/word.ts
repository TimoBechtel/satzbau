import { Article } from './noun';
import { Writable } from './textHelper';

export interface WithArticleType {
	article: (type: Article) => this;
}

export interface Declinable extends Writable {
	plural: () => this;
	singular: () => this;
	accusative: () => this;
	genitive: () => this;
	dative: () => this;
	nominative: () => this;
}
