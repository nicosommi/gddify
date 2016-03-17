"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _incognito = require("incognito");

var _incognito2 = _interopRequireDefault(_incognito);

var _placeholderJs = require("placeholder-js");

var _placeholderJs2 = _interopRequireDefault(_placeholderJs);

var _flowsync = require("flowsync");

var _flowsync2 = _interopRequireDefault(_flowsync);

var _file = require("./file.js");

var _file2 = _interopRequireDefault(_file);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Bag = function () {
	function Bag(name) {
		_classCallCheck(this, Bag);

		(0, _incognito2.default)(this).name = name;
		(0, _incognito2.default)(this).files = new Map([]);
	}

	_createClass(Bag, [{
		key: "add",
		value: function add(filePath, cleanFilePath) {
			var file = new _file2.default(filePath, cleanFilePath);
			(0, _incognito2.default)(this).files.set(filePath, file);
			return file;
		}
	}, {
		key: "delete",
		value: function _delete(filePath) {
			(0, _incognito2.default)(this).files.delete(filePath);
		}
	}, {
		key: "generate",
		value: function generate(callback) {
			var _this = this;

			_flowsync2.default.eachSeries(Array.from(this.files), function (fileEntry, nextFile) {
				var filePath = fileEntry[0];
				var fileObject = fileEntry[1];
				_placeholderJs2.default.refresh(filePath).replacing(fileObject.replacements).ignoringStamps(fileObject.ignoredStamps).with(_this.root, function () {
					nextFile();
				});
			}, function () {
				callback();
			});
		}
	}, {
		key: "clean",
		value: function clean(callback) {
			_flowsync2.default.eachSeries(Array.from(this.files), function (fileEntry, nextFile) {
				var filePath = fileEntry[0];
				var fileObject = fileEntry[1];
				_placeholderJs2.default.using(filePath).cleanTo(fileObject.cleanFilePath, function () {
					nextFile();
				});
			}, function () {
				callback();
			});
		}
	}, {
		key: "root",
		get: function get() {
			return (0, _incognito2.default)(this).root;
		},
		set: function set(value) {
			(0, _incognito2.default)(this).root = value;
		}
	}, {
		key: "files",
		get: function get() {
			return (0, _incognito2.default)(this).files;
		}
	}, {
		key: "name",
		get: function get() {
			return (0, _incognito2.default)(this).name;
		}
	}]);

	return Bag;
}();

exports.default = Bag;