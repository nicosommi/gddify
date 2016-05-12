import _ from "incognito";
import Ph from "gene-js";
import flowsync from "flowsync";
import Promise from "./promise.js";
import File from "./file.js";

export default class Bag {
	constructor(name) {
		_(this).name = name;
		_(this).files = new Map([]);
	}

	add(filePath, cleanFilePath) {
		const file = new File(filePath, cleanFilePath);
		_(this).files.set(filePath, file);
		return file;
	}

	delete(filePath) {
		_(this).files.delete(filePath);
	}

	quickGenerate(root, target, options) {
		if(!options) {
			options = {};
		}

		return new Promise((resolve, reject) => {
			if(!options.replacements) {
				options.replacements = {};
			}

			if(!options.ignoringStamps) {
				options.ignoringStamps = [];
			}

			let ph = Ph.refresh(target);

			if(options.delimiters) {
				ph.withThisDelimiters(options.delimiters.start, options.delimiters.end);
			}

			ph.replacing(options.replacements)
				.ignoringStamps(options.ignoringStamps)
				.with(root,
					(errors) => {
						if(errors) {
							reject(errors);
						} else {
							resolve();
						}
					}
				);
		});
	}

	quickClean(root, target, options) {
		if(!options) {
			options = {};
		}

		return new Promise((resolve, reject) => {
			if(!options.replacements) {
				options.replacements = {};
			}

			if(!options.ignoringStamps) {
				options.ignoringStamps = [];
			}

			let ph = Ph.using(root);

			if(options.delimiters) {
				ph.withThisDelimiters(options.delimiters.start, options.delimiters.end);
			}

			ph.cleanTo(target,
				(errors) => {
					if(errors) {
						reject(errors);
					} else {
						resolve();
					}
				}
			);
		});
	}

	generate(callback) {
		flowsync.eachSeries(Array.from(this.files),
			(fileEntry, nextFile) => {
				const filePath = fileEntry[0];
				const fileObject = fileEntry[1];
				Ph.refresh(filePath)
					.replacing(fileObject.replacements)
					.ignoringStamps(fileObject.ignoredStamps)
					.with(this.root, () => {
						nextFile();
					});
			}, () => {
				callback();
			});
	}

	clean(callback) {
		flowsync.eachSeries(Array.from(this.files),
			(fileEntry, nextFile) => {
				const filePath = fileEntry[0];
				const fileObject = fileEntry[1];
				Ph.using(filePath)
					.cleanTo(fileObject.cleanFilePath, () => {
						nextFile();
					});
			}, () => {
				callback();
			});
	}

	get root() {
		return _(this).root;
	}

	set root(value) {
		_(this).root = value;
	}

	get files() {
		return _(this).files;
	}

	get name() {
		return _(this).name;
	}
}
