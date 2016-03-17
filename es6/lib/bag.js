import _ from "incognito";
import Ph from "placeholder-js";
import flowsync from "flowsync";
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
