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
			constructorSpy.apply(this, arguments);
		}

		synchronizeWith() {
			synchronizeWithSpy.apply(this, arguments);
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
			constructorSpy = sinon.spy();
			synchronizeWithSpy = sinon.spy();
			cleanSpy = sinon.spy();
			addSwBlocksSpy = sinon.spy(
				function addSwBlocksSpyMethod() {
					this.swBlocks = [
						{ type: "type1" },
						{ type: "type2" },
						{ type: "type3" }
					];
				}
			);
			name = "aname";
			type = "atype";
			options = {};
			swComponentJson = {
				name,
				type,
				swBlocks: [
					{ type: "type1" },
					{ type: "type2" },
					{ type: "type2" },
					{ type: "type3" },
					{ type: "type4" }
				]
			};
			UpdateSwComponent.__Rewire__("SwComponent", SwComponent);
			updateSwComponent = new UpdateSwComponent(swComponentJson);
		}
	);

	describe("constructor", () => {
		it("should build a sw component class", () => {
			constructorSpy.calledWith({ name, type, options }).should.be.true;
		});
	});

	describe(".synchronizeWith(rootSwComponent)", () => {
		let rootSwComponentJson;

		beforeEach(() => {
			name = "anewname";
			type = "anewtype";
			addSwBlocksSpy = sinon.spy(
				function addSwBlocksSpyMethod() {
					this.swBlocks = [
						{ type: "type4" },
						{ type: "type1" },
						{ type: "type2" },
						{ type: "type3" },
						{ type: "type3" },
						{ type: "type4" }
					];
				}
			);
			rootSwComponentJson = {
				name,
				type,
				swBlocks: [
					{ type: "type4" },
					{ type: "type1" },
					{ type: "type2" },
					{ type: "type3" },
					{ type: "type3" },
					{ type: "type4" }
				]
			};
			updateSwComponent.synchronizeWith(rootSwComponentJson);
		});

		describe("(given a source sw component structure and a target sw component structure)", () => {
			it("should call the swBlock synchronization method with the right arguments", () => {
				synchronizeWithSpy.calledWith({ name, type, options }).should.be.true;
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
