import Bag from "./bag.js";

const bags = new Map([]);

export default function godify (name) {
	let bag;

	if(name) {
		if(bags.has(name)) {
			bag = bags.get(name);
		} else {
			bag = new Bag(name);
			bags.set(name, bag);
		}
	} else {
		bag = new Bag();
	}

	return bag;
}
