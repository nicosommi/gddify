# Gddify.js [![npm version](https://img.shields.io/npm/v/gdd.svg)](https://www.npmjs.com/package/gdd) [![license type](https://img.shields.io/npm/l/gdd.svg)](https://github.com/nicosommi/gdd.git/blob/master/LICENSE) [![npm downloads](https://img.shields.io/npm/dm/gdd.svg)](https://www.npmjs.com/package/gdd) ![ECMAScript 6 & 5](https://img.shields.io/badge/ECMAScript-6%20/%205-red.svg)

It makes it easy to work with the GDD approach.
Compose software components by putting blocks togheter and updating them whenever you want.
Ah yeah, and with no development effort for generators and template creation.
Read more on [http://nicosommi.com](http://nicosommi.com)

## Usage examples
### Prerequisites
```shell
npm init
npm i gdd --save-dev
```
After that, add this line in your scripts section of your package.json:
```javascript
"scripts": {
	"gdd": "gdd"
}
```
And you're ready to proceed with the first generation.

### Generation / Creation / Source addition
#### From the registered public sw component ng (node, angular, es6, browserify, express, bootstrap, jquery, etc.):
```shell
npm run gdd generate -- --from-registered ng
```
And there you are, you have a fully functional webapp.

#### From your private component repo:
```shell
npm run gdd generate -- --from https://github.com/me/myotherproject
```
#### From your private component path:
```shell
npm run gdd generate -- --from ../myotherproject
```

### Update
```shell
npm run gdd update
```
With this you will pull all of your block to the latest version according to the sources that they have configured.
Gdd compares using the semver package.

### Compile
```shell
npm run gdd compile
```
This will clean up your component to the configured folder.

### Publish / increment
```shell
npm run gdd increment [patch] -- --name myblock
npm run gdd increment minor -- --name myblock
npm run gdd increment major -- --name myblock
```
This will increase the version of your block named myblock in one path release (default), minor release, or major release respectively. You can also do that manually on the swComponent.json file on your project root folder.
Gddify uses the semver package to check version numbers.

## How it works
Basically, it creates and maintains a swComponent.json on the project roots with the information related to your project and their sources.
Using that, it implements the [GDD approach](http://nicosommi.com), based on gene, block and component information provided by other GDD projects out there.

With gdd you will be able to create and compose projects from your other projects or from projects on the repo.

*Use cases? A lot.*
Microservices, project bootstrapping, scaffolding, among others.

*Is this different than yeoman? Absolutely.*
Gddify is a development process aspect/practice that you can attach to your development process, more like TDD/BDD. It's true that you may accomplish with gdd the same stuff that you previously did with yeoman, and it does not require ANY effort on building up a generator, it uses meta information provided by the source code files by following the development process aspect.

*Does gdd use any template language to build concrete files? No.*
Read more why [here](http://nicosommi.com).

*There is any advatange by using this approach? A lot.*
For example, you can test everything you do with no rare/template code, just regular development in your well known main source code language.
No more question/wizard development.
The impact for technology decisions and package-lock is now minimized.
There are more advatanges, keep reading [here](http://nicosommi.com).

*Can I use gdd on other languages different than javascript? Yes.*
It's language agnostic. You will need node.js installed in order to run it, but it can contain any kind of components. Java, C#, PHP, Ruby, etc.

*There is a repo with known packages? Yes.*
Currently it's built-in inside this package. As the community grows and contributes there will be an official repo. If you want to submit your project to be in the repo, feel free to open a new issue or create a new PR.

*Can I install gdd globally? Yes.*
But, please, don't. Read why [here](http://nicosommi.com/?p=518).

# Quality and Compatibility

[![Build Status](https://travis-ci.org/nicosommi/gdd.png?branch=master)](https://travis-ci.org/nicosommi/gdd) [![Coverage Status](https://coveralls.io/repos/nicosommi/gdd/badge.svg)](https://coveralls.io/r/nicosommi/gdd)  [![bitHound Score](https://www.bithound.io/github/nicosommi/gdd/badges/score.svg)](https://www.bithound.io/github/nicosommi/gdd)  [![Dependency Status](https://david-dm.org/nicosommi/gdd.png?theme=shields.io)](https://david-dm.org/nicosommi/gdd?theme=shields.io) [![Dev Dependency Status](https://david-dm.org/nicosommi/gdd/dev-status.svg)](https://david-dm.org/nicosommi/gdd?theme=shields.io#info=devDependencies)

*Every build and release is automatically tested on the following platforms:*

![node 0.12.x](https://img.shields.io/badge/node-0.12.x-brightgreen.svg) ![node 0.11.x](https://img.shields.io/badge/node-0.11.x-brightgreen.svg) ![node 0.10.x](https://img.shields.io/badge/node-0.10.x-brightgreen.svg)
![iojs 2.x.x](https://img.shields.io/badge/iojs-2.x.x-brightgreen.svg) ![iojs 1.x.x](https://img.shields.io/badge/iojs-1.x.x-brightgreen.svg)

# Installation

Copy and paste the following command into your terminal to install Gddify:

```
npm install gdd --save-dev
```

# How to Contribute

You can submit your ideas through our [issues system](https://github.com/nicosommi/gdd/issues), or make the modifications yourself and submit them to us in the form of a [GitHub pull request](https://help.github.com/articles/using-pull-requests/).

Also I accept [donations](http://nicosommi.com). Since this was done by me for free, and I REALLY need donations.

## Running Tests

It's easy to run the test suite locally, and *highly recommended* if you're using Gddify.js on a platform we aren't automatically testing for.

```
npm test
```
