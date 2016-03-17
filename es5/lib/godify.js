"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.default = godify;

var _bag = require("./bag.js");

var _bag2 = _interopRequireDefault(_bag);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var bags = new Map([]);

function godify(name) {
	var bag = void 0;

	if (name) {
		if (bags.has(name)) {
			bag = bags.get(name);
		} else {
			bag = new _bag2.default(name);
			bags.set(name, bag);
		}
	} else {
		bag = new _bag2.default();
	}

	return bag;
}