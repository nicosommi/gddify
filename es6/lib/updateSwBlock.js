import { SwBlock } from "gene-js";

const buildSwBlock = Symbol("buildSwBlock");

export default class UpdateSwBlock {
	constructor(targetSwBlockJson) {
		this.targetSwBlock = this[buildSwBlock](targetSwBlockJson);
	}

	[buildSwBlock](jsonObject) {
		const result = new SwBlock(jsonObject.name, jsonObject.type, jsonObject.options);
		result.addSourceCodeFiles(jsonObject.sourceCodeFiles);
		return result;
	}

	synchronizeWith(rootSwBlockJson) {
		this.rootSwBlock = this[buildSwBlock](rootSwBlockJson);
		return this.targetSwBlock.synchronizeWith(this.rootSwBlock);
	}

	clean(dirtyPhs) {
		return this.targetSwBlock.clean(dirtyPhs);
	}
}
