#! /usr/bin/env node
/* eslint-disable no-console */
import { argv } from "yargs";
import Liftoff from "liftoff";
import UpdateSwComponent from "../lib/updateSwComponent.js";
import path from "path";
import chalk from "chalk";
import fs from "fs-extra";
import Promise from "../lib/promise.js";

const ensureFile = Promise.promisify(fs.ensureFile);

const Gddify = new Liftoff({
	cwd: argv.cwd,
	processTitle: "gddify",
	moduleName: "gddify",
	configName: "swComponent.json"
});

Gddify.launch({}, invoke);

export default function invoke(env) {
	// console.log("invoke reached", { env, argv, path: `${argv.cwd}/${argv.from}/swComponent.json` });
	let command;
	if(argv._.length > 0) {
		command = argv._[0];
	} else {
		command = "help";
	}

	const targetSwComponentPath = path.normalize(`${env.cwd}/swComponent.json`);
	const basePath = env.cwd;
	const cleanPath = `.gdd-clean`;

	console.log(chalk.magenta("Command execution begins..."));

	ensureFile(targetSwComponentPath)
		.then(() => {
			console.log(chalk.magenta("Target file ensured..."));
			const targetSwComponentJson = require(targetSwComponentPath);
			const updateSwComponent = new UpdateSwComponent(targetSwComponentJson, basePath, cleanPath);

			switch(command) {
				case "generate":
					updateSwComponent.synchronize(argv.from, argv.name, argv.type);
				break;
				case "update":
					updateSwComponent.update(argv.name, argv.type);
				break;
				case "compile":
					console.log(chalk.magenta("Update begins..."));
					updateSwComponent.clean([ "gddifyph" ]);
				break;
				default:
					console.log(chalk.red("Invalid command. Use gddify [generate|update|compile|increment]. "));
				break;
			}
		});
}
