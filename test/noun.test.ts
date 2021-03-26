import { adjective } from '../src/adjective';
import { noun } from '../src/noun';
import { sentence } from '../src/textHelper';

test('generates declinable word by providing it with a template string', () => {
	const a = noun('der see, die seen, des sees');
	expect(a.accusative().write()).toBe('einen See');

	const b = noun('das Meer,-e,-s');
	expect(b.genitive().plural().write()).toBe('der Meere');
});

test('generates correct form', () => {
	// test words from wikipedia:
	// https://de.wikipedia.org/wiki/Deutsche_Grammatik#Bildung_von_Wortformen:_Deklination
	let testWords = [
		{
			nom_sg: 'der Berg',
			nom_pl: 'die Berge',
			acc_sg: 'den Berg',
			acc_pl: 'die Berge',
			gen_sg: 'des Berges',
			gen_pl: 'der Berge',
			dat_sg: 'dem Berg',
			dat_pl: 'den Bergen',
		},
		{
			nom_sg: 'das Bild',
			nom_pl: 'die Bilder',
			acc_sg: 'das Bild',
			acc_pl: 'die Bilder',
			gen_sg: 'des Bildes',
			gen_pl: 'der Bilder',
			dat_sg: 'dem Bild',
			dat_pl: 'den Bildern',
		},
		{
			nom_sg: 'die Kraft',
			nom_pl: 'die Kräfte',
			acc_sg: 'die Kraft',
			acc_pl: 'die Kräfte',
			gen_sg: 'der Kraft',
			gen_pl: 'der Kräfte',
			dat_sg: 'der Kraft',
			dat_pl: 'den Kräften',
		},
		{
			nom_sg: 'das Schaf',
			nom_pl: 'die Schafe',
			acc_sg: 'das Schaf',
			acc_pl: 'die Schafe',
			gen_sg: 'des Schafs',
			gen_pl: 'der Schafe',
			dat_sg: 'dem Schaf',
			dat_pl: 'den Schafen',
		},
		{
			nom_sg: 'der Boden',
			nom_pl: 'die Böden',
			acc_sg: 'den Boden',
			acc_pl: 'die Böden',
			gen_sg: 'des Bodens',
			gen_pl: 'der Böden',
			dat_sg: 'dem Boden',
			dat_pl: 'den Böden',
		},
		{
			nom_sg: 'die Mutter',
			nom_pl: 'die Mütter',
			acc_sg: 'die Mutter',
			acc_pl: 'die Mütter',
			gen_sg: 'der Mutter',
			gen_pl: 'der Mütter',
			dat_sg: 'der Mutter',
			dat_pl: 'den Müttern',
		},
		{
			nom_sg: 'der Jäger',
			nom_pl: 'die Jäger',
			acc_sg: 'den Jäger',
			acc_pl: 'die Jäger',
			gen_sg: 'des Jägers',
			gen_pl: 'der Jäger',
			dat_sg: 'dem Jäger',
			dat_pl: 'den Jägern',
		},
		{
			nom_sg: 'der Bär',
			nom_pl: 'die Bären',
			acc_sg: 'den Bären',
			acc_pl: 'die Bären',
			gen_sg: 'des Bären',
			gen_pl: 'der Bären',
			dat_sg: 'dem Bären',
			dat_pl: 'den Bären',
		},
		{
			nom_sg: 'die Meinung',
			nom_pl: 'die Meinungen',
			acc_sg: 'die Meinung',
			acc_pl: 'die Meinungen',
			gen_sg: 'der Meinung',
			gen_pl: 'der Meinungen',
			dat_sg: 'der Meinung',
			dat_pl: 'den Meinungen',
		},
		{
			nom_sg: 'der Staat',
			nom_pl: 'die Staaten',
			acc_sg: 'den Staat',
			acc_pl: 'die Staaten',
			gen_sg: 'des Staates',
			gen_pl: 'der Staaten',
			dat_sg: 'dem Staat',
			dat_pl: 'den Staaten',
		},
		{
			nom_sg: 'der Name',
			nom_pl: 'die Namen',
			acc_sg: 'den Namen',
			acc_pl: 'die Namen',
			gen_sg: 'des Namens',
			gen_pl: 'der Namen',
			dat_sg: 'dem Namen',
			dat_pl: 'den Namen',
		},
		{
			nom_sg: 'das Radio',
			nom_pl: 'die Radios',
			acc_sg: 'das Radio',
			acc_pl: 'die Radios',
			gen_sg: 'des Radios',
			gen_pl: 'der Radios',
			dat_sg: 'dem Radio',
			dat_pl: 'den Radios',
		},
		{
			nom_sg: 'die Kamera',
			nom_pl: 'die Kameras',
			acc_sg: 'die Kamera',
			acc_pl: 'die Kameras',
			gen_sg: 'der Kamera',
			gen_pl: 'der Kameras',
			dat_sg: 'der Kamera',
			dat_pl: 'den Kameras',
		},
		// edge case:
		{
			nom_sg: 'das Herz',
			nom_pl: 'die Herzen',
			acc_sg: 'das Herz',
			acc_pl: 'die Herzen',
			gen_sg: 'des Herzen',
			gen_pl: 'der Herzen',
			dat_sg: 'dem Herzen',
			dat_pl: 'den Herzen',
		},
	];
	testWords.forEach(
		({ acc_pl, acc_sg, dat_pl, dat_sg, gen_pl, gen_sg, nom_pl, nom_sg }) => {
			let word = noun(`${nom_sg}, ${nom_pl}, ${gen_sg}`).specific();

			expect(word.write()).toEqual(nom_sg);
			expect(word.accusative().write()).toEqual(acc_sg);
			expect(word.dative().write()).toEqual(dat_sg);
			expect(word.genitive().write()).toEqual(gen_sg);

			word = word.plural();
			expect(word.write()).toEqual(nom_pl);
			expect(word.accusative().write()).toEqual(acc_pl);
			expect(word.dative().write()).toEqual(dat_pl);
			expect(word.genitive().write()).toEqual(gen_pl);
		}
	);
});

test('throws error on wrong template syntax', () => {
	expect(() => noun('auto')).toThrow();
	expect(() => noun('')).toThrow();
	expect(() => noun('das auto')).toThrow();
	expect(() => noun('das auto, die autos')).toThrow();
	expect(() => noun('auto,autos,autos')).toThrow();
});

test('allows adding adjectives to nouns', () => {
	const ocean = noun('das Meer,-e,-s').attributes('rot', 'weit');
	expect(ocean.write()).toBe('ein rotes, weites Meer');
	expect(ocean.specific().write()).toBe('das rote, weite Meer');

	const stone = noun('der stein,-e,-s')
		.attributes(adjective('klein'))
		.specific();
	expect(stone.write()).toBe('der kleine Stein');

	const door = noun('die tür,-en,-').attributes('viel zu klein');

	expect(door.genitive().specific().write()).toBe('der viel zu kleinen Tür');

	const story = noun('die geschichte,-n,-');
	const humanity = noun('die menschheit,-en,-');

	expect(
		sentence`
			${story.unspecific().accusative().attributes('kurz')} 
			${humanity.genitive().specific()}
		`.write()
	).toBe('Eine kurze Geschichte der Menschheit.');
});
