<!-- ph replacements -->
<!-- name, /gddify/g, gddify -->
<!-- namePascal, /Gddify/g, Gddify -->
<!-- endph -->
<!-- ph ignoringStamps -->
<!-- endph -->
<!-- ph title -->
# Gddify [![npm version](https://img.shields.io/npm/v/gddify.svg)](https://www.npmjs.com/package/gddify) [![license type](https://img.shields.io/npm/l/gddify.svg)](https://github.com/nicosommi/gddify.git/blob/master/LICENSE) [![npm downloads](https://img.shields.io/npm/dm/gddify.svg)](https://www.npmjs.com/package/gddify) ![ECMAScript 6 & 5](https://img.shields.io/badge/ECMAScript-6%20/%205-red.svg) [![js-standard-style](https://img.shields.io/badge/code%20style-standard-brightgreen.svg)](http://standardjs.com/)
<!-- endph -->

<!-- ph description -->
It makes it easy to work with the GDD approach.
Compose software components by putting blocks togheter and updating them whenever you want.
Ah yeah, and with no development effort for generators and template creation.
Thinked with the SRP in mind, this is ideal for microservices.
It let's you minimize the maintenance effort at almost no additional cost.
It's also useful for scaffolding and quality assurance across your company, among other things.
Read more on [http://nicosommi.com](http://nicosommi.com)
<!-- endph -->

<!-- ph usagesAndExamples -->
## Quickstart / Cookbook for a node.js library
```shell
npm i -g gddify

mkdir myproject
cd myproject
npm init

npm i git://github.com/nicosommi/gene-js.git

gddify generate --from ./node_modules/gene-js

npm i
```
Then, customize the package.js file at your own taste (replacements, place holders and stamps).

Then, run
```shell
gddify refresh

npm test
```

And there you go, a node.js library with es6, test, watch, a LICENSE, a README.md, a .gitignore, and more things to come soon.

## Usage & examples
### Prerequisites per project
```shell
mkdir myproject
cd myproject
npm init
npm i gddify --save-dev
```
After that, add this line in your scripts section of your package.json:
```json
"scripts": {
	"gddify": "gddify"
}
```
And you're ready to proceed with your first generation.

Oh yeah you can also use it globally, it's easier, but [I don't like it](http://nicosommi.com/?p=518) for most cases. Just like this:
```shell
npm i -g gddify
```

### Generation / Creation / Source addition
#### Create
```shell
npm install git://github.com/nicosommi/gddify.git
gddify generate --from ./node_modules/gddify
```
And there you are, you have a fully functional webapp. But hey, don't get me wrong. That webapp is just a GDD developed web application. It can be anything from any repo that was created following GDD.

Also, you can generate just some blocks with type filtering (or name filtering):
```shell
gddify generate --from ./.sources/gddify --type runtime
```

The project-local option (and all will be with this format):
```shell
npm run gddify generate -- --from node_modules/webapp
```

### Update
```shell
gddify update
```
With this you will pull all of your block to the latest version according to the sources that they have configured.
Gdd compares using the semver package.

Update also supports type and name filtering.

### Refresh
```shell
gddify refresh
```
This is just an update from the local project. Also supports filtering.

### Compile
```shell
gddify compile
```
This will clean up your component's meta data and it will throw the files into the configured folder.

### Add
```shell
gddify add --name mycomponent --type tasks --glob "./tasks/**/*"
```
This adds all files that matches the glob into a component named mycomponent of type tasks (create or append).

### Add file
```shell
gddify addfile --name mycomponent --type tasks --path "./tasks/build.js"
```
This adds that file into a component named mycomponent of type tasks (create or append).

### Increment
```shell
gddify increment --name mycomponent --type tasks --release "patch"
gddify increment --name mycomponent --type tasks --release "minor"
gddify increment --name mycomponent --type tasks --release "major"
```
This increments the version component named mycomponent of type tasks using the release type (according to [semver](http://semver.npmjs.com/)).
It's particularly useful when you want to allow other blocks to be refreshed/updated.

<!-- endph -->
<!-- ph howItWorks -->
## How it works
Basically, it creates and maintains a swComponent.json on the project roots with the information related to your project and their sources.
Using that, it implements the [GDD approach](http://nicosommi.com), based on gene, block and component information provided by other GDD projects out there.

With gdd you will be able to create and compose projects from your other projects or from projects on the repo.

## F.A.Q.
*Use cases? A lot.*  
Microservices, project bootstrapping, scaffolding (and with updates), among others.

*Is it hard to learn? Not at all.*  
It's intuitive.  
It's just common sense.  
Nothing else that the commands here and understanding the GDD approach.  
As this is a change in your current workflow it may be uncomfortable at the beginning, but you get used to it.
The most advanced task you will need to do is to create a regular expressions.  
But come on, if you want to be called a developer or even an advanced text-processor user, you should know how to create a regular expression! In complex cases it requires to think the regular expression very well, as well as how many place holders and stamps to include, to ignore, etc.  
If you don't know what that is go [here](http://nicosommi.com).

*Is this different than yeoman? Absolutely.*  
Gddify is a tool for applying a development process aspect/practice that you can attach to your development process, like TDD/BDD (but with a different purpose). It's true that you may accomplish with GDD the same stuff that you previously did with yeoman, and it does not require ANY effort on building up a generator, it just requires you to provide meta information in the source code files by following the development process aspect. So in this way, you can just completely avoid efforts building up templates and generators, testing them properly, and creating complex updating processes. Also there are many other uses cases.

*Does gdd use any template language to build concrete files? No.*  
You don't have to *learn* anything special. Read more why [here](http://nicosommi.com).

*There is any advatange by using this approach? A lot.*  
For example, you can test everything you do with no rare/template code, just regular development in your well known main source code language.
No more reinventing the wheel everytime.
No more question/wizard development.
No vendor-lock learning curve.
The impact for technology decisions and package/stack/vendor-lock is now minimized (if you do GDD correctly).
Reduces the work overhead on complex architectures.
There are more advatanges, keep reading [here](http://nicosommi.com).

*Can I use gdd on other languages different than javascript? Yes.*  
It's language agnostic. You will need node.js installed in order to run it, but it can contain any kind of components. Java, C#, PHP, Ruby, etc.

*There is a repo with known packages? No.*
You can just use any repo or even folder that contains a valid swComponent.json file!

*Can I install gdd globally? Yes.*  

*Can I use it already? Yes.*  
But as it's still on a early-early-early version, so you should use it carefully, taking care of committing all your changes before running gddify, so you can always stash them after that. It's not rock solid yet but it has a high test coverage and it follow good practices for the source code (js standard). Also, on complex cases you will need to do some stuff manually yet.

*There are requirements to use gddify? Yes.*  
Gddify requires node.js and your commitment to the GDD approach to be really useful.

*What happens with files with no comment support? We use a intermmediate file.*  
For example, for package.json, you can maintain a package.js that, using the provided jsonification command, compiles that js to package.json automatically. You can see how it's done by looking the swComponent.json for this repo.  
You can configure blocks to jsonificate, copy or move their files after the synchronization occurs.

*How can I get help/support/new features? Contact me.*  
You can either send me an email to nicosommi@gmail.com or visit my company website http://www.integracionesagiles.com
I'm an enterpreneur and a open source developer.

<!-- endph -->
<!-- ph qualityAndCompatibility -->
# Quality and Compatibility

[![Build Status](https://travis-ci.org/nicosommi/gddify.png?branch=master)](https://travis-ci.org/nicosommi/gddify) [![Coverage Status](https://coveralls.io/repos/nicosommi/gddify/badge.svg)](https://coveralls.io/r/nicosommi/gddify)  [![bitHound Score](https://www.bithound.io/github/nicosommi/gddify/badges/score.svg)](https://www.bithound.io/github/nicosommi/gddify)  [![Dependency Status](https://david-dm.org/nicosommi/gddify.png?theme=shields.io)](https://david-dm.org/nicosommi/gddify?theme=shields.io) [![Dev Dependency Status](https://david-dm.org/nicosommi/gddify/dev-status.svg)](https://david-dm.org/nicosommi/gddify?theme=shields.io#info=devDependencies)

*Every build and release is automatically tested on the following platforms:*

![node 5.x](https://img.shields.io/badge/node-5.x-brightgreen.svg)
![node 6.x](https://img.shields.io/badge/node-6.x-brightgreen.svg)
<!-- endph -->
<!-- ph installation -->
# Installation

Local
```
npm install gddify --save-dev
```
Global
```
npm install -g gddify
```

<!-- endph -->
<!-- stamp contribute -->
# How to Contribute

You can submit your ideas through our [issues system](https://github.com/nicosommi/gddify/issues), or make the modifications yourself and submit them to us in the form of a [GitHub pull request](https://help.github.com/articles/using-pull-requests/).

Also I accept [donations](http://nicosommi.com). If this component helps you out, it will be enough for me, but if you want to show me how much did it helped you by giving me some money, it will be great for me and my dog, who wants to eat. But seriously I rely on that to keep going with the development.
I also offer [services](http://integracionesagiles.com) like consultation, development help, mentoring, etc.
<!-- endstamp -->
<!-- stamp runningtests -->
## Running Tests

It's easy to run the test suite locally, and *highly recommended* if you're using gddify on a platform we aren't automatically testing for.

```
npm test
```
<!-- endstamp -->
