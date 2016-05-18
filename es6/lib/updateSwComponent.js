/* eslint-disable no-console */
import { SwComponent } from "gene-js";
import semver from "semver";
import chalk from "chalk";
import Promise from "./promise.js";
import path from "path";
import fs from "fs-extra";

const writeFile = Promise.promisify(fs.writeFile);

const buildSwComponent = Symbol("buildSwComponent");
const getMinifiedSwComponent = Symbol("getMinifiedSwComponent");

export default class UpdateSwComponent {
	constructor(targetSwComponentJson, basePath, cleanPath) {
		if(!targetSwComponentJson.options) {
			targetSwComponentJson.options = {};
		}

		targetSwComponentJson.options.basePath = basePath;
		targetSwComponentJson.options.cleanPath = cleanPath;
		this.targetSwComponent = this[buildSwComponent](targetSwComponentJson);
	}

	[buildSwComponent](jsonObject) {
		const result = new SwComponent(jsonObject.name, jsonObject.type, jsonObject.options);
		result.addSwBlocks(jsonObject.swBlocks);
		return result;
	}

	[getMinifiedSwComponent](component, name, type) {
		const result = [];
		if(name) {
			component.swBlocks = component.swBlocks.filter(swBlock => swBlock.name === name);
		}

		if(type) {
			component.swBlocks = component.swBlocks.filter(swBlock => swBlock.type === type);
		}

		component.swBlocks
			.forEach(
				(swBlock) => {
					let index;
					const found = result.find((targetBlock, i) => {
						index = i;
						return (targetBlock.type === swBlock.type);
					});
					if(!found) {
						result.push(swBlock);
					} else if(semver.gt(swBlock.version, found.version)) {
						result.splice(index, 1, swBlock);
					}
				}
			);
		return result;
	}

	update(name, type) {
		console.log(chalk.magenta("Beginning update..."));
		const sources = this.targetSwComponent.options.sources;
		sources.push("./");

		return Promise.all(
			sources.map(
				source => {
					console.log(chalk.magenta(`Reading from ${source}...`));
					return this.synchronize(source, name, type);
				}
			)
		)
		.then(() => {
			console.log(chalk.green("Everything updated from all sources."));
		});
	}

	synchronize(sourcePath, name, type) {
		console.log(chalk.magenta("Generation begins..."));
		const rootBasePath = `${this.targetSwComponent.options.basePath}/${sourcePath}`;
		const rootSwComponentJson = require(path.normalize(`${rootBasePath}/swComponent.json`));
		rootSwComponentJson.options.basePath = rootBasePath;

		console.log(chalk.magenta("Synchronization begins..."));
		return this.synchronizeWith(sourcePath, rootSwComponentJson, name, type)
			.then(newJson => {
				console.log(chalk.magenta("Writing configuration..."));
				return writeFile(path.normalize(`${this.targetSwComponent.options.basePath}/swComponent.json`), JSON.stringify(newJson, null, "\t"))
				.then(() => {
					console.log(chalk.green("All done."));
					return Promise.resolve();
				});
			}, error => {
				const message = error.message || error;
				console.log(chalk.red(`ERROR: ${message}`));
				return Promise.resolve();
			});
	}

	synchronizeWith(fromPath, rootSwComponentJson, name, type) {
		console.log(chalk.magenta("building objects and picking newer blocks"));
		const rootSwComponent = this[buildSwComponent](rootSwComponentJson);
		const newerBlocks = this[getMinifiedSwComponent](rootSwComponent, name, type);

		console.log(chalk.magenta("synchronizing old blocks"));
		return Promise.map(
			newerBlocks,
			swBlock => {
				console.log(chalk.green(`About to update block ${swBlock.type} to version ${swBlock.version}... `));
				const syncPromise = this.targetSwComponent.synchronizeWith(swBlock);
				return Promise.resolve(syncPromise).reflect();
			},
			{ concurrency: 1 }
		)
		.then((inspections) => {
			let errorCount = 0;
			inspections.forEach(
				inspection => {
					if(!inspection.isFulfilled()) {
						errorCount++;
						console.log(chalk.yellow(inspection.reason()));
					}
				}
			);
			if(errorCount) {
				return Promise.reject(new Error("Error/Warnings occurred during synchronization."));
			} else {
				console.log(chalk.green(`Component ${this.targetSwComponent.name} updated.`));
				console.log(chalk.magenta("Adding the new source..."));
				if(!this.targetSwComponent.options.sources) {
					this.targetSwComponent.options.sources = [fromPath];
				} else {
					const existingSource = this.targetSwComponent.options.sources.find(currentSource => (currentSource === fromPath));
					if(!existingSource) {
						this.targetSwComponent.options.sources.push(fromPath);
					}
				}
				this.targetSwComponent.options.sources = this.targetSwComponent.options.sources;
				return Promise.resolve(this.targetSwComponent);
			}
		});
	}

	clean(dirtyPhs) {
		return this.targetSwComponent.clean(dirtyPhs);
	}
}
