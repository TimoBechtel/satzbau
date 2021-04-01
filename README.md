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
  - [Add adjectives](#Add-adjectives)
  - [Create synonyms](#Create-synonyms)
  - [Count words](#Count-words)
  - [Construct a sentence](#Construct-a-sentence)
  - [Pass properties to sentences](#Pass-properties-to-sentences)
  - [More examples](#More-examples)
- [Development](#Development)
- [Contact](#contact)
- [Contributing](#Contributing)

## About

satzbau allows you to generate natural sounding texts in German.

It allows you to:

- decline words (including articles and adjectives)
- define evenly distributed synonyms for words
- automatically render lists as text
- use a handy tagged template string syntax to format sentences (it's like magic 🪄)
- create dynamic sentences with properties

**It's pretty small and does not need a dictionary.**

However, it can't (yet):

- automatically detect the correct cases
- conjugate verbs

## Install

### NPM:

```sh
yarn install satzbau
```

## Usage

> Note: satzbau provides pure functions, meaning every function call will not change the object in-place, but instead return a new object.

satzbau is written in typescript, so I recommend to use typescript or an IDE that supports autocomplete for in-code documentation.

### Define words

```js
import { noun } from 'satzbau';

// provide it with a string, containing:
// 1. an article
// 2. the word in nominative singular, sg. plural and genitive singular
let phone = noun('das telefon, die telefone, des telefons');

// or if you're lazy:
phone = noun('das telefon,-e,-s');

console.log(phone.write()); // => "ein Telefon"
```

### Decline words

```js
console.log(phone.plural().specific().genitive().write()); // => "der Telefone"
```

### Add adjectives

```js
phone = phone.attributes('laut');

console.log(phone.dative().write()); // => "einem lauten Telefon"
```

### Create synonyms

```js
import { synonyms } from 'satzbau';

let mobilePhone = synonyms(
	noun('das mobiltelefon,-e,-s'),
	noun('das handy,-s,-s'),
	noun('das smartphone,-s,-s')
).attributes('klein');

console.log(mobilePhone.plural().genitive().write()); // => e.g. "der kleinen Mobiltelefone"
```

### Count words

```js
console.log(mobilePhone.count(3).write()); // drei kleine Mobiltelefone
console.log(mobilePhone.negated().write()); // kein kleines Handy
```

### Construct a sentence

```js
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
console.log(inMyBag.shout().write()); // -> Ich habe einen Schlüssel, ein kleines Handy und zwei Feuerzeuge im Rucksack!
```

### Pass properties to sentences

```js
const describeCloud = sentence`
	die Wolke sieht aus wie
	${({ cloud, adjective }) => (adjective ? cloud.attributes(adjective) : cloud)}
`;

console.log(
	describeCloud.write({
		cloud: noun('der pinguin,-e,-s'),
		adjective: 'fliegend',
	})
);
// => "Die Wolke sieht aus wie ein fliegender Pinguin."

console.log(describeCloud.shout().write({ cloud: noun('der affe,-en,-') }));
// => "Die Wolke sieht aus wie ein Affe!"
```

Note: For typescript, you need to provide types:

```ts
const describeCloud = sentence`
	die Wolke sieht aus wie
	${({ cloud, adjective }: { cloud: Noun; adjective?: string }) =>
		adjective ? cloud.attributes(adjective) : cloud}
`;
// or
const describeCloud = sentence<{ cloud: Noun; adjective?: string }>`
	die Wolke sieht aus wie
	${({ cloud, adjective }) => (adjective ? cloud.attributes(adjective) : cloud)}
`;
```

### More examples

```js
import {
	adjective,
	into,
	list,
	noun,
	sentence,
	synonyms,
	text,
	to,
	variants,
} from 'satzbau';

const color = synonyms(adjective('rot'), adjective('blau'), adjective('gelb'));

const car = synonyms(
	noun('das auto, die autos, des autos'),
	noun('der PKW, die PKWs, des PKWs'),
	noun('die karre, die karren, der karre')
)
	.specific()
	.attributes(color);

const train = synonyms(noun('der zug,züge,-s'), noun('die bahn,-en,-'));

const animals = [
	noun('der elefant,-en,-en').attributes('gutmütig'),
	noun('die maus,mäuse,-').attributes('weiß'),
	noun('der kakadu,-s,-s').attributes('lachend'),
];

const door = noun('die tür,-en,-').specific();

const move = variants('eilte', 'rannte', 'lief');

const heEnters = variants(
	sentence`er stieg ${(object) => into(object)}`,
	sentence`eilig betrat er ${(object) => object.accusative()}`,
	sentence`er öffnete ${door.accusative()} ${(object) => object.genitive()}`,
	sentence`er ${move} ${(object) => to(object)}`
);

console.log(heEnters.write(car));
console.log(heEnters.write(car));
console.log(heEnters.write(car));
console.log(heEnters.write(train));

console.log(sentence`${animals} erwarteten ihn bereits`.write());
console.log(
	text`
		${sentence`
			${list(animals).any()}
		`.ask()}
		${sentence`er wusste es nicht mehr so genau...`}
	`.write()
);

/*
	Output:
	
	Er öffnete die Tür des blauen Autos.
	Er eilte zum roten Wagen.
	Er stieg in den gelben PKW.
	Er rannte zu einer Bahn.
	Ein gutmütiger Elefant, eine weiße Maus und ein lachender Kakadu erwarteten ihn bereits.
	Ein gutmütiger Elefant, eine weiße Maus oder ein lachender Kakadu? Er wusste es nicht mehr so genau...
*/
```

Again, provide types when using typescript:

```ts
const heEnters = variants<Noun>(
	sentence`er stieg ${(object) => into(object)}`,
	sentence`eilig betrat er ${(object) => object.accusative()}`,
	sentence`er öffnete ${door.accusative()} ${(object) => object.genitive()}`,
	sentence<Noun>`er ${move} ${(object) => to(object)}`
	// notice, how we need to provide the type explicitly in the last sentence
	// this is because "move" has no properties and typescript defaults to "void"
);
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
