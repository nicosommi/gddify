"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _incognito = require("incognito");

var _incognito2 = _interopRequireDefault(_incognito);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var File = function () {
	function File(path) {
		_classCallCheck(this, File);

		(0, _incognito2.default)(this).path = path;
		(0, _incognito2.default)(this).replacements = {};
		(0, _incognito2.default)(this).ignoredStamps = [];
	}

	_createClass(File, [{
		key: "replacing",
		value: function replacing(replacements) {
			(0, _incognito2.default)(this).replacements = replacements;
		}
	}, {
		key: "ignoringStamps",
		value: function ignoringStamps(ignoredStamps) {
			(0, _incognito2.default)(this).ignoredStamps = ignoredStamps;
		}
	}, {
		key: "path",
		get: function get() {
			return (0, _incognito2.default)(this).path;
		}
	}, {
		key: "replacements",
		get: function get() {
			return (0, _incognito2.default)(this).replacements;
		}
	}, {
		key: "ignoredStamps",
		get: function get() {
			return (0, _incognito2.default)(this).ignoredStamps;
		}
	}]);

	return File;
}();

exports.default = File;