<h1 align="center">🏗 <br/> Satzbau</h1>
<h3 align="center">natural language generator for german</h3>
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
- [Test](#run-tests)
- [Contact](#contact)
- [Contributing](#Contributing)

## About

A tool to generate natural german texts.

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

### Define words

```ts
import { noun } from 'satzbau';

// provide it with a string, containing:
// 1. an article
// 2. the word in nominative singular, plural and genitive singular
const phone = noun('das telefon, die telefone, des telefons');

// or if you're lazy:
const phone = noun('das telefon,-e,-s');
```

### Example

```ts
import { noun, sentence, synonyms } from 'satzbau';

cconst car = synonyms(
	noun('das auto, die autos, des autos'),
	noun('der PKW, die PKWs, des PKWs'),
	noun('der wagen, die wagen, des wagens'),
	noun('die karre, die karren, der karre')
).specific();

const animals = [
	noun('der elefant,-en,-en'),
	noun('die maus,mäuse,-'),
	noun('der kakadu,-s,-s'),
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
	Eilig betrat er den Wagen.
	Er stieg in die Karre.
	Er öffnete die Tür des PKWs.
	Er rannte zu dem Auto.
	Er öffnete die Tür des Wagens.
	Ein Elefant, eine Maus und ein Kakadu erwarteten ihn bereits...
*/
```

## Run tests

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
