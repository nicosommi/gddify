# Godify.js [![npm version](https://img.shields.io/npm/v/godify.svg)](https://www.npmjs.com/package/godify) [![license type](https://img.shields.io/npm/l/godify.svg)](https://github.com/nicosommi/godify.git/blob/master/LICENSE) [![npm downloads](https://img.shields.io/npm/dm/godify.svg)](https://www.npmjs.com/package/godify) ![ECMAScript 6 & 5](https://img.shields.io/badge/ECMAScript-6%20/%205-red.svg)

It makes it easy to work with the god approach.
It relies on placeholder-js.
You can manage your concrete files with no additional effort for template maintenance.
Read more on [http://nicosommi.com](http://nicosommi.com)

```javascript
import godify from "godify";

godify("FruitBag").root = "lib/appleRootClass.js";
godify("FruitBag")
	.add("lib/appleClass.js", "dist/appleClass.js");

godify("FruitBag")
	.add("lib/grapeClass.js", "dist/grapeClass.js")
	.replacing({
		"apple": "grape",
		"Apple": "Grape"
	});

godify("FruitBag")
	.add("lib/bananaClass.js", "dist/bananaClass.js")
	.replacing({
		"apple": "banana",
		"Apple": "Banana"
	})
	.ignoringStamps(["extractSeed"]);

godify.generate(() => {
	// right on, now you have all your fruits
	// make sure that you customize their dynamic place holder contents
});

godify.clean(() => {
	// ok, now you have clean fruits to use on your dist folder
	// ready to eat
});
```

# Quality and Compatibility

[![Build Status](https://travis-ci.org/nicosommi/godify.png?branch=master)](https://travis-ci.org/nicosommi/godify) [![Coverage Status](https://coveralls.io/repos/nicosommi/godify/badge.svg)](https://coveralls.io/r/nicosommi/godify)  [![bitHound Score](https://www.bithound.io/github/nicosommi/godify/badges/score.svg)](https://www.bithound.io/github/nicosommi/godify)  [![Dependency Status](https://david-dm.org/nicosommi/godify.png?theme=shields.io)](https://david-dm.org/nicosommi/godify?theme=shields.io) [![Dev Dependency Status](https://david-dm.org/nicosommi/godify/dev-status.svg)](https://david-dm.org/nicosommi/godify?theme=shields.io#info=devDependencies)

*Every build and release is automatically tested on the following platforms:*

![node 0.12.x](https://img.shields.io/badge/node-0.12.x-brightgreen.svg) ![node 0.11.x](https://img.shields.io/badge/node-0.11.x-brightgreen.svg) ![node 0.10.x](https://img.shields.io/badge/node-0.10.x-brightgreen.svg)
![iojs 2.x.x](https://img.shields.io/badge/iojs-2.x.x-brightgreen.svg) ![iojs 1.x.x](https://img.shields.io/badge/iojs-1.x.x-brightgreen.svg)

# Installation

Copy and paste the following command into your terminal to install Godify:

```
npm install godify --save
```

## Import / Require

```
// ES6
import godify from "godify";
```

```
// ES5
var godify = require("godify");
```

# How to Contribute

See something that could use improvement? Have a great feature idea? We listen!

You can submit your ideas through our [issues system](https://github.com/nicosommi/godify/issues), or make the modifications yourself and submit them to us in the form of a [GitHub pull request](https://help.github.com/articles/using-pull-requests/).

We always aim to be friendly and helpful.

## Running Tests

It's easy to run the test suite locally, and *highly recommended* if you're using Godify.js on a platform we aren't automatically testing for.

```
npm test
```

# TODO
## pending
* support BUSINESS projects (and allows microservice dev)
    add support for git/http based roots
    so you CAN refresh their local roots when they want
## V2
* glob support
