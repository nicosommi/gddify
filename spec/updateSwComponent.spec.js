import UpdateSwComponent from "../es6/lib/updateSwComponent.js";
import sinon from "sinon";

describe("UpdateSwComponent", () => {
	let constructorSpy,
		synchronizeWithSpy,
		cleanSpy,
		addSwBlocksSpy,
		updateSwComponent,
		name,
		type,
		swComponentJson,
		options;

	class SwComponent {
		constructor() {
			this.options = arguments[2];
			constructorSpy.apply(this, arguments);
		}

		synchronizeWith() {
			return synchronizeWithSpy.apply(this, arguments);
		}

		clean() {
			cleanSpy.apply(this, arguments);
		}

		addSwBlocks() {
			addSwBlocksSpy.apply(this, arguments);
		}
	}

	beforeEach(
		() => {
			constructorSpy = sinon.spy(() => Promise.resolve());
			synchronizeWithSpy = sinon.spy(() => Promise.resolve());
			cleanSpy = sinon.spy(() => Promise.resolve());
			addSwBlocksSpy = sinon.spy(
				function addSwBlocksSpyMethod() {
					this.swBlocks = [
						{ name: "blockname", type: "type1", version: "0.0.1" },
						{ name: "blockname", type: "type2", version: "0.0.1" },
						{ name: "blockname", type: "type2", version: "0.0.1" },
						{ name: "blockname", type: "type3", version: "0.0.1" },
						{ name: "blockname", type: "type4", version: "0.0.1" }
					];
				}
			);
			name = "aname";
			type = "atype";
			options = {};
			swComponentJson = {
				name,
				type,
				swBlocks: []
			};
			UpdateSwComponent.__Rewire__("SwComponent", SwComponent);
			updateSwComponent = new UpdateSwComponent(swComponentJson, "/abase/path", "clean-path");
		}
	);

	describe("constructor", () => {
		it("should build a sw component class", () => {
			constructorSpy.calledWith({ name, type, options }).should.be.true;
		});
	});

	describe(".synchronize(path[, name, type])", () => {
		beforeEach(() => {
			name = "anewname";
			type = "anewtype";
			addSwBlocksSpy = sinon.spy(
				function addSwBlocksSpyMethod() {
					this.swBlocks = [
						{ name: "blockname", type: "type4", version: "0.0.2" },
						{ name: "blockname", type: "type1", version: "0.0.1" },
						{ name: "blockname", type: "type2", version: "0.0.1" },
						{ name: "blockname", type: "type3", version: "0.0.1" },
						{ name: "blockname", type: "type3", version: "0.2.1" },
						{ name: "blockname", type: "type4", version: "0.0.1" }
					];
				}
			);

			swComponentJson = {
				name,
				type,
				swBlocks: []
			};

			updateSwComponent = new UpdateSwComponent(swComponentJson, `${__dirname}/../fixtures`, "clean-path");

			updateSwComponent.synchronizeWith = sinon.spy(() => Promise.resolve());

			return updateSwComponent.synchronize("./root");
		});

		it("should call synchronizeWith", () => {
			sinon.assert.callCount(updateSwComponent.synchronizeWith, 1);
		});
	});

	describe(".synchronizeWith(path, root)", () => {
		let rootSwComponentJson;

		beforeEach(() => {
			name = "anewname";
			type = "anewtype";
			addSwBlocksSpy = sinon.spy(
				function addSwBlocksSpyMethod() {
					this.swBlocks = [
						{ name: "blockname", type: "type4", version: "0.0.2" },
						{ name: "blockname", type: "type1", version: "0.0.1" },
						{ name: "blockname", type: "type2", version: "0.0.1" },
						{ name: "blockname", type: "type3", version: "0.0.1" },
						{ name: "blockname", type: "type3", version: "0.2.1" },
						{ name: "blockname", type: "type4", version: "0.0.1" }
					];
				}
			);
			rootSwComponentJson = {
				name,
				type,
				swBlocks: []
			};

			swComponentJson = {
				name,
				type,
				swBlocks: []
			};

			return updateSwComponent.synchronizeWith("fromhere", rootSwComponentJson);
		});

		describe("(given a source sw component structure and a target sw component structure)", () => {
			it("should call the swBlock synchronization method with the right arguments", () => {
				sinon.assert.calledWith(synchronizeWithSpy, { name: "blockname", type: "type3", version: "0.2.1" });
			});

			it("should call the swBlock synchronization method with the right arguments", () => {
				sinon.assert.neverCalledWith(synchronizeWithSpy, { name: "blockname", type: "type3", version: "0.0.1" });
			});

			it("should call the swBlock synchronization method with the right arguments", () => {
				synchronizeWithSpy.callCount.should.equal(4);
			});

			it("should build the root sw component accordingly", () => {
				constructorSpy.calledWith({ name, type, options }).should.be.true;
			});

			it("should build the root sw component before calling synchronize", () => {
				sinon.assert.callOrder(constructorSpy, constructorSpy, addSwBlocksSpy, synchronizeWithSpy);
			});
		});
	});

	describe(".clean()", () => {
		beforeEach(() => {
			updateSwComponent.clean();
		});

		describe("(given a source sw component structure and a target sw component structure)", () => {
			it("should call the swBlock clean method with the right arguments", () => {
				cleanSpy.calledWith({ name, type, options }).should.be.true;
			});
		});
	});
});
