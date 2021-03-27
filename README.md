<h1 align="center">🏗 <br/> Satzbau</h1>
<h3 align="center">natural language generation tool for german</h3>
<p align="center"><i><code>/ˈzatsˌbaʊ/</code>, german: "sentence construction"</i></p>
<p align="center">
  <a href="#" target="_blank">
    <img alt="License: MIT" src="https://img.shields.io/badge/License-MIT-yellow.svg" />
  </a>
</p>
<p align="center">
  ·
  <a href="https://github.com/TimoBechtel/satzbau/issues">Report Bug / Request Feature</a>
  ·
</p>

## Table of Contents

- [About](#About)
- [Installation](#Install)
- [Usage](#Usage)
  - [Define words](#Define-words)
  - [Decline words](#Decline-words)
  - [Create synonyms](#Create-synonyms)
  - [Count words](#Count-words)
  - [Construct a sentence](#Construct-a-sentence)
  - [More examples](#More-examples)
- [Development](#Development)
- [Contact](#contact)
- [Contributing](#Contributing)

## About

A tool for generating natural sounding texts in german.

It allows you to:

- decline words (including articles and adjectives)
- define evenly distributed synonyms for words
- automatically render lists as text
- a handy template string syntax to format sentences
- create template functions to render advances sentences

**It's pretty small and does not need a dictionary.**

However, it can't (yet):

- automatically detect cases
- conjugate verbs

## Install

### NPM:

```sh
yarn install satzbau
```

## Usage

> Note: Every function is pure, meaning every function call will not change the object in-place, but instead return a new object.

### Define words

```ts
import { noun } from 'satzbau';

// provide it with a string, containing:
// 1. an article
// 2. the word in nominative singular, plural and genitive singular
let phone = noun('das telefon, die telefone, des telefons');

// or if you're lazy:
phone = noun('das telefon,-e,-s');

console.log(phone.write()); // => "ein Telefon"
```

### Decline words

```ts
console.log(phone.plural().specific().genitive().write()); // => "der Telefone"
```

### Add adjectives

```ts
phone = phone.attributes('laut');

console.log(phone.dative().write()); // => "einem lauten Telefon"
```

### Create synonyms

```ts
import { synonyms } from 'satzbau';

let mobilePhone = synonyms(
	noun('das mobiltelefon,-e,-s'),
	noun('das handy,-s,-s'),
	noun('das smartphone,-s,-s')
).attributes('klein');

console.log(mobilePhone.plural().genitive().write()); // => e.g. "der kleinen Mobiltelefone"
```

### Count words

```ts
console.log(mobilePhone.count(3).write()); // drei kleine Mobiltelefone
console.log(mobilePhone.negated().write()); // kein kleines Handy
```

### Construct a sentence

```ts
const items = [
	noun('der schlüssel,-,-s'),
	mobilePhone,
	noun('das feuerzeug,-e,-s').count(2),
];
const bag = synonyms(
	noun('die tasche,-n,-'),
	noun('der rucksack, rucksäcke, -s')
);
const inMyBag = sentence`
	Ich habe ${items.map((i) => i.accusative())}
	in ${bag.specific().dative()}
`;

console.log(inMyBag.write()); // -> Ich habe einen Schlüssel, ein kleines Mobiltelefon und zwei Feuerzeuge in der Tasche.
console.log(inMyBag.write()); // -> Ich habe einen Schlüssel, ein kleines Handy und zwei Feuerzeuge im Rucksack.
```

### More examples

```ts
import { adjective, noun, sentence, synonyms, variants } from 'satzbau';

const color = synonyms(
	adjective('rot'),
	adjective('blau'),
	adjective('gelb'),
	adjective('grün')
);

const car = synonyms(
	noun('das auto, die autos, des autos'),
	noun('der PKW, die PKWs, des PKWs'),
	noun('der wagen, die wagen, des wagens'),
	noun('die karre, die karren, der karre')
)
	.specific()
	.attributes(color);

const animals = [
	noun('der elefant,-en,-en').attributes('gutmütig'),
	noun('die maus,mäuse,-').attributes('weiß'),
	noun('der kakadu,-s,-s').attributes('lachend'),
];

const door = noun('die tür,-en,-').specific();

const move = variants('eilte', 'rannte', 'lief');

const heEntersCar = variants(
	sentence`er stieg in ${car.accusative()}`,
	sentence`eilig betrat er ${car.accusative()}`,
	sentence`er öffnete ${door.accusative()} ${car.genitive()}`,
	sentence`er ${move} zu ${car.dative()}`
);

console.log(heEntersCar.write());
console.log(heEntersCar.write());
console.log(heEntersCar.write());
console.log(heEntersCar.write());
console.log(heEntersCar.write());

console.log(sentence`${animals} erwarteten ihn bereits...`.write());

/*
	Output:
	
	Er öffnete die Tür des grünen Autos.
	Er eilte zum roten Wagen.
	Er stieg in den gelben PKW.
	Eilig betrat er die blaue Karre.
	Er lief zum roten Auto.
	Ein gutmütiger Elefant, eine weiße Maus und ein lachender Kakadu erwarteten ihn bereits...
*/
```

## Development

### Run tests

```sh
yarn run test
```

## Contact

👤 **Timo Bechtel**

- Website: https://timobechtel.com
- Twitter: [@TimoBechtel](https://twitter.com/TimoBechtel)
- GitHub: [@TimoBechtel](https://github.com/TimoBechtel)

## 🤝 Contributing

Contributions, issues and feature requests are welcome!<br />

1. Check [issues](https://github.com/TimoBechtel/satzbau/issues)
1. Fork the Project
1. Create your Feature Branch (`git checkout -b feat/AmazingFeature`)
1. Test your changes `yarn run test`
1. Commit your Changes (`git commit -m 'feat: add amazingFeature'`)
1. Push to the Branch (`git push origin feat/AmazingFeature`)
1. Open a Pull Request

### Commit messages

This project uses semantic-release for automated release versions. So commits in this project follow the [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0-beta.2/) guidelines. I recommend using [commitizen](https://github.com/commitizen/cz-cli) for automated commit messages.

## Show your support

Give a ⭐️ if this project helped you!

---

_This README was generated with ❤️ by [readme-md-generator](https://github.com/kefranabg/readme-md-generator)_
