import _ from "incognito";
import clone from "clone";
import Ph from "placeholder-js";

export default class Godify {
	constructor() {
		_(this).genes = [];
	}

	add(source, growth, clean, optionsObject) {
		const options = clone(optionsObject, false);
		_(this).genes.push(
			{
				source,
				growth,
				clean,
				options
			}
		);
	}

	generate() {
		return Promise.all(
			_(this).genes.map(
				gene => {
					return new Promise(
						(resolve, reject) => {
							const options = gene.options;
							if(!options.replacements) {
								options.replacements = {};
							}

							if(!options.ignoringStamps) {
								options.ignoringStamps = [];
							}

							const ph = Ph.refresh(gene.growth);

							if(options.delimiters) {
								ph.withThisDelimiters(options.delimiters.start, options.delimiters.end);
							}

							ph.replacing(options.replacements)
							.ignoringStamps(options.ignoringStamps)
							.with(gene.source,
								(errors) => {
									if(errors) {
										reject(errors);
									} else {
										resolve();
									}
								}
							);
						}
					);
				}
			)
		);
	}

	clean() {
		return Promise.all(
			_(this).genes.map(
				gene => {
					return new Promise(
						(resolve, reject) => {
							const options = gene.options;
							const ph = Ph.using(gene.growth);

							if(options.delimiters) {
								ph.withThisDelimiters(options.delimiters.start, options.delimiters.end);
							}

							ph.cleanTo(gene.clean,
								(errors) => {
									if(errors) {
										reject(errors);
									} else {
										resolve();
									}
								}
							);
						}
					);
				}
			)
		);
	}
}
