import godify from "../es6/lib/godify.js";
import Bag from "../es6/lib/bag.js";
import chai from "chai";
chai.should();

describe("Godify", () => {
	describe("(bag picking)", () => {
		it("should pick an unexisting new bag", () => {
			godify("unexistingBag").should.be.instanceOf(Bag);
		});

		it("should pick an existing bag", () => {
			const newBag = godify("newBag");
			godify("newBag").should.equal(newBag);
		});

		it("should allow to pick a new bag with no name for quick ops", () => {
			godify().should.be.instanceOf(Bag);
		});
	});
});
