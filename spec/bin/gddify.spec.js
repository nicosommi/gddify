import gddify from "../../es6/bin/gddify.js";

// TBD

describe("gddify", () => {

	beforeEach(() => {
		gddify.__Rewire__("yargs", {});
	});

	describe("(commands)", () => {
		describe("generate", () => {
			it("should take the swComponent.js from the project root");
		});
	});
});
