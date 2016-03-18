"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _clone = require("clone");

var _clone2 = _interopRequireDefault(_clone);

var _placeholderJs = require("placeholder-js");

var _placeholderJs2 = _interopRequireDefault(_placeholderJs);

var _path = require("path");

var _path2 = _interopRequireDefault(_path);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var addGene = Symbol("addGene");

var Godify = function () {
	function Godify() {
		_classCallCheck(this, Godify);

		this.genes = [];
	}

	_createClass(Godify, [{
		key: addGene,
		value: function value(source, growth, clean, optionsObject) {
			var options = (0, _clone2.default)(optionsObject, false);
			this.genes.push({
				source: source,
				growth: growth,
				clean: clean,
				options: options
			});
		}
	}, {
		key: "add",
		value: function add(source, growth, clean, optionsObject) {
			var _this = this;

			if (Array.isArray(source)) {
				source.forEach(function (sourceGene) {
					var geneFileName = _path2.default.basename(sourceGene);
					_this[addGene](sourceGene, growth + "/" + geneFileName, clean + "/" + geneFileName, optionsObject);
				});
			} else {
				this[addGene](source, growth, clean, optionsObject);
			}
		}
	}, {
		key: "generate",
		value: function generate() {
			return Promise.all(this.genes.map(function (gene) {
				return new Promise(function (resolve, reject) {
					var options = gene.options;
					if (!options.replacements) {
						options.replacements = {};
					}

					if (!options.ignoringStamps) {
						options.ignoringStamps = [];
					}

					var ph = _placeholderJs2.default.refresh(gene.growth);

					if (options.delimiters) {
						ph.withThisDelimiters(options.delimiters.start, options.delimiters.end);
					}

					ph.replacing(options.replacements).ignoringStamps(options.ignoringStamps).with(gene.source, function (errors) {
						if (errors) {
							reject(errors);
						} else {
							resolve();
						}
					});
				});
			}));
		}
	}, {
		key: "clean",
		value: function clean() {
			return Promise.all(this.genes.map(function (gene) {
				return new Promise(function (resolve, reject) {
					var options = gene.options;
					var ph = _placeholderJs2.default.using(gene.growth);

					if (options.delimiters) {
						ph.withThisDelimiters(options.delimiters.start, options.delimiters.end);
					}

					ph.cleanTo(gene.clean, function (errors) {
						if (errors) {
							reject(errors);
						} else {
							resolve();
						}
					});
				});
			}));
		}
	}]);

	return Godify;
}();

exports.default = Godify;