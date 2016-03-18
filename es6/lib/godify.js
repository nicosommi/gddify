import clone from "clone";
import Ph from "placeholder-js";
import path from "path";

const addGene = Symbol("addGene");

export default class Godify {
	constructor() {
		this.genes = [];
	}

	[addGene](source, growth, clean, optionsObject) {
		const options = clone(optionsObject, false);
		this.genes.push(
			{
				source,
				growth,
				clean,
				options
			}
		);
	}

	add(source, growth, clean, optionsObject) {
		if(Array.isArray(source)) {
			source.forEach(
				sourceGene => {
					const geneFileName = path.basename(sourceGene);
					this[addGene](sourceGene, `${growth}/${geneFileName}`, `${clean}/${geneFileName}`, optionsObject);
				}
			);
		} else {
			this[addGene](source, growth, clean, optionsObject);
		}
	}

	generate() {
		return Promise.all(
			this.genes.map(
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
			this.genes.map(
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
