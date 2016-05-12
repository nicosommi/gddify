import { SwComponent } from "gene-js";
import path from "path";

const buildSwComponent = Symbol("buildSwComponent");

export default class UpdateSwComponent {
	constructor(targetSwComponentJson) {
		this.targetSwComponent = this[buildSwComponent](targetSwComponentJson);
	}

	[buildSwComponent](jsonObject) {
		const result = new SwComponent(jsonObject.name, jsonObject.type, jsonObject.options);
		result.addSwBlocks(jsonObject.swBlocks);
		return result;
	}

	synchronizeWith(rootSwComponentJson) {
		const rootSwComponent = this[buildSwComponent](rootSwComponentJson);
		const typesOfBlocks = [];
		rootSwComponent.swBlocks
			.forEach(
				(swBlock) => {
					const found = typesOfBlocks.find(targetBlock => (targetBlock.type === swBlock.type));
					if(!found) {
						typesOfBlocks.push(swBlock);
					}
				}
			);

		return Promise.all(
			typesOfBlocks.map(
				swBlock => {
					return this.targetSwComponent.synchronizeWith(swBlock);
				}
			)
		).then(() => {
			const replacer = (key, value) => {
				if(typeof value === "string") {
					return value.replace(path.normalize(this.targetSwComponent.options.basePath), "${basePath}");
				} else {
					return value;
				}
			};

			process.stdout.write(`\nCopy this into your component.js\n${JSON.stringify(this.targetSwComponent, replacer, "\t")}`);
		});
	}

	clean(dirtyPhs) {
		return this.targetSwComponent.clean(dirtyPhs);
	}
}
