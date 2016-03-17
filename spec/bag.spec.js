import Bag from "../es6/lib/bag.js";
import fs from "fs";
import chai from "chai";
chai.should();

describe("Bag", () => {
	let bag;

	beforeEach(() => {
		bag = new Bag("bag name");
	});

	describe("(object description)", () => {
		it("should have a name", () => {
			bag.name.should.equal("bag name");
		});
	});

	describe("(file deletion)", () => {
		beforeEach(() => {
			bag.add("lib/file.js");
		});

		it("should allow to remove a file from a bag by name", () => {
			bag.delete("lib/file.js");
			bag.files.size.should.equal(0);
		});

		it("should allow to remove an unexisting file from a bag by name", () => {
			(() => {
				bag.delete("lib/anotherFile.js");
			}).should.not.throw();
		});
	});

	describe("(file addition)", () => {
		it("should allow to add a file to the bag", () => {
			bag.add("lib/myFile.js");
			bag.files.has("lib/myFile.js").should.be.true;
		});

		it("should allow to add a root", () => {
			bag.root = "lib/root.js";
			bag.root.should.equal("lib/root.js");
		});
	});

	describe(".generate", () => {

		describe("(when new files/content)", () => {
			let filledFileContents,
				emptyFileNewContents,
				emptyFileOriginalContents;

			beforeEach(done => {
				bag.root = `${__dirname}/../fixtures/filledFile.js`;
				bag.add(`${__dirname}/../fixtures/emptyFile.js`);
				emptyFileOriginalContents = fs.readFileSync(`${__dirname}/../fixtures/emptyFile.js`, {encoding: "utf8"});
				bag.generate(() => {
					filledFileContents = fs.readFileSync(`${__dirname}/../fixtures/filledFile.js`, {encoding: "utf8"});
					emptyFileNewContents = fs.readFileSync(`${__dirname}/../fixtures/emptyFile.js`, {encoding: "utf8"});
					done();
				});
			});

			afterEach(() => {
				fs.writeFileSync(`${__dirname}/../fixtures/emptyFile.js`, emptyFileOriginalContents, {encoding: "utf8"});
			});

			it("should allow to generate targets from a file source as the template", () => {
				emptyFileNewContents.should.equal(filledFileContents);
			});
		});

		describe("(when existing targets)", () => {
			let filledFileContents,
				existingFileNewContents,
				existingFileOriginalContents;

			beforeEach(done => {
				bag.root = `${__dirname}/../fixtures/filledFile.js`;
				bag.add("fixtures/existingOldTarget.js");
				existingFileOriginalContents = fs.readFileSync(`${__dirname}/../fixtures/existingOldTarget.js`, {encoding: "utf8"});
				bag.generate(() => {
					filledFileContents = fs.readFileSync(`${__dirname}/../fixtures/existingNewTarget.js`, {encoding: "utf8"});
					existingFileNewContents = fs.readFileSync(`${__dirname}/../fixtures/existingOldTarget.js`, {encoding: "utf8"});
					done();
				});
			});

			afterEach(() => {
				fs.writeFileSync(`${__dirname}/../fixtures/existingOldTarget.js`, existingFileOriginalContents, {encoding: "utf8"});
			});

			it("should allow to refresh targets if they exists from a file source as a template", () => {
				existingFileNewContents.should.equal(filledFileContents);
			});
		});
	});

	describe(".replacing", () => {
		let concreteFileContents,
			emptyFileNewContents,
			emptyFileOriginalContents;

		beforeEach(done => {
			bag.root = `${__dirname}/../fixtures/filledFile.js`;
			bag.add(`${__dirname}/../fixtures/emptyFile.js`)
				.replacing({
					"Example": "Orange"
				});
			emptyFileOriginalContents = fs.readFileSync(`${__dirname}/../fixtures/emptyFile.js`, {encoding: "utf8"});
			bag.generate(() => {
				concreteFileContents = fs.readFileSync(`${__dirname}/../fixtures/replacedFile.js`, {encoding: "utf8"});
				emptyFileNewContents = fs.readFileSync(`${__dirname}/../fixtures/emptyFile.js`, {encoding: "utf8"});
				done();
			});
		});

		afterEach(() => {
			fs.writeFileSync(`${__dirname}/../fixtures/emptyFile.js`, emptyFileOriginalContents, {encoding: "utf8"});
		});

		it("should execute replacements on a file", () => {
			emptyFileNewContents.should.equal(concreteFileContents);
		});
	});

	describe(".ignoringStamps", () => {
		let concreteFileContents,
			emptyFileNewContents,
			emptyFileOriginalContents;

		beforeEach(done => {
			bag.root = `${__dirname}/../fixtures/filledFile.js`;
			bag.add(`${__dirname}/../fixtures/emptyFile.js`)
				.ignoringStamps(["constructor"]);
			emptyFileOriginalContents = fs.readFileSync(`${__dirname}/../fixtures/emptyFile.js`, {encoding: "utf8"});
			bag.generate(() => {
				concreteFileContents = fs.readFileSync(`${__dirname}/../fixtures/stampIgnoredFile.js`, {encoding: "utf8"});
				emptyFileNewContents = fs.readFileSync(`${__dirname}/../fixtures/emptyFile.js`, {encoding: "utf8"});
				done();
			});
		});

		afterEach(() => {
			fs.writeFileSync(`${__dirname}/../fixtures/emptyFile.js`, emptyFileOriginalContents, {encoding: "utf8"});
		});

		it("should ignore selected stamps", () => {
			emptyFileNewContents.should.equal(concreteFileContents);
		});
	});

	describe(".clean", () => {
		let filledFileContents,
			cleanFileContents,
			emptyFileOriginalContents;

		beforeEach(done => {
			bag.root = `${__dirname}/../fixtures/filledFile.js`;
			bag.add(`${__dirname}/../fixtures/emptyFile.js`, `${__dirname}/../fixtures/cleanFileGenerated.js`)
				.replacing({
					"Example": "Orange"
				});
			emptyFileOriginalContents = fs.readFileSync(`${__dirname}/../fixtures/emptyFile.js`, {encoding: "utf8"});
			bag.generate(() => {
				bag.clean(() => {
					filledFileContents = fs.readFileSync(`${__dirname}/../fixtures/cleanFileGenerated.js`, {encoding: "utf8"});
					cleanFileContents = fs.readFileSync(`${__dirname}/../fixtures/cleanFile.js`, {encoding: "utf8"});
					done();
				});
			});
		});

		afterEach(() => {
			fs.writeFileSync(`${__dirname}/../fixtures/emptyFile.js`, emptyFileOriginalContents, {encoding: "utf8"});
		});

		it("should generate files with no special blocks on them", () => {
			filledFileContents.should.equal(cleanFileContents);
		});
	});
});
