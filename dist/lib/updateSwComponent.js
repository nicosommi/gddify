'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.__RewireAPI__ = exports.__ResetDependency__ = exports.__set__ = exports.__Rewire__ = exports.__GetDependency__ = exports.__get__ = undefined;

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _geneJs = require('gene-js');

var _semver = require('semver');

var _semver2 = _interopRequireDefault(_semver);

var _chalk = require('chalk');

var _chalk2 = _interopRequireDefault(_chalk);

var _promise = require('./promise.js');

var _promise2 = _interopRequireDefault(_promise);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _fsExtra = require('fs-extra');

var _fsExtra2 = _interopRequireDefault(_fsExtra);

var _glob = require('glob');

var _glob2 = _interopRequireDefault(_glob);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

// import inquirer from "inquirer"

var writeJson = _get__('Promise').promisify(_get__('fs').writeJson);
var glob = _get__('Promise').promisify(_get__('Glob'));

var buildSwComponent = Symbol('buildSwComponent');
var getNewerBlocks = Symbol('getNewerBlocks');
var updateFrom = Symbol('updateFrom');
var saveConfiguration = Symbol('saveConfiguration');
var addSourceCodeFile = Symbol('addSourceCodeFile');
var filterBlocks = Symbol('filterBlocks');

var UpdateSwComponent = function () {
  function UpdateSwComponent(targetSwComponentJson) {
    _classCallCheck(this, UpdateSwComponent);

    if (!targetSwComponentJson.options) {
      targetSwComponentJson.options = {};
    }

    this.targetSwComponent = this[buildSwComponent](targetSwComponentJson);
  }

  _createClass(UpdateSwComponent, [{
    key: buildSwComponent,
    value: function value(jsonObject) {
      var result = new (_get__('SwComponent'))(jsonObject.name, jsonObject.type, jsonObject.options);
      result.addSwBlocks(jsonObject.swBlocks);
      return result;
    }
  }, {
    key: filterBlocks,
    value: function value(blocks, name, type) {
      var result = blocks;
      if (name) {
        result = result.filter(function (block) {
          return block.name === name;
        });
      }

      if (type) {
        result = result.filter(function (block) {
          return block.type === type;
        });
      }
      return result;
    }
  }, {
    key: getNewerBlocks,
    value: function value(component, name, type) {
      var result = [];
      var newerBlocks = this[filterBlocks](component.swBlocks, name, type);

      // TODO: use a Set on result
      newerBlocks.forEach(function (swBlock) {
        var index = void 0;
        var found = result.find(function (targetBlock, i) {
          index = i;
          return targetBlock.type === swBlock.type;
        });
        if (!found) {
          result.push(swBlock);
        } else if (_get__('semver').gt(swBlock.version, found.version)) {
          result.splice(index, 1, swBlock);
        }
      });
      return result;
    }
  }, {
    key: addSourceCodeFile,
    value: function value(sourceCodeFilePath, name, type) {
      var blockFound = this.targetSwComponent.swBlocks.find(function (block) {
        return block.name === name && block.type === type;
      });
      var sourceCodeFileJson = { name: sourceCodeFilePath, path: sourceCodeFilePath };
      if (!blockFound) {
        var version = '0.0.0';
        blockFound = this.targetSwComponent.addSwBlock({ name: name, type: type, version: version, sourceCodeFiles: [sourceCodeFileJson] });
      } else {
        var sourceCodeFileFound = blockFound.sourceCodeFiles.find(function (file) {
          return file.path === sourceCodeFileJson.path;
        });
        if (!sourceCodeFileFound) {
          blockFound.addSourceCodeFile(sourceCodeFileJson);
        } else {
          console.log(_get__('chalk').magenta('File ' + sourceCodeFilePath + ' already exists, omitted'));
        }
      }
    }
  }, {
    key: 'increment',
    value: function increment(release, name, type) {
      console.log(_get__('chalk').green('Incrementing the release...'));
      var blocks = this[filterBlocks](this.targetSwComponent.swBlocks, name, type);
      blocks.forEach(function (block) {
        block.version = _get__('semver').inc(block.version, release);
      });
      return this[saveConfiguration](this.targetSwComponent).then(function () {
        return console.log(_get__('chalk').green('Increment finished.'));
      });
    }
  }, {
    key: 'jsonification',
    value: function jsonification(source, destination) {
      return _get__('writeJson')(destination, require(source), { spaces: 2 });
    }
  }, {
    key: 'addFile',
    value: function addFile(filePath, name, type) {
      console.log(_get__('chalk').green('Beginning addition of a single file...'));
      this[addSourceCodeFile](filePath, name, type);
      return this[saveConfiguration](this.targetSwComponent).then(function () {
        return console.log(_get__('chalk').green('Addfile finished.'));
      });
    }
  }, {
    key: 'add',
    value: function add(pattern, name, type) {
      var _this = this;

      console.log(_get__('chalk').green('Beginning addition...'));
      return _get__('glob')(pattern).then(function (files) {
        files.forEach(function (filePath) {
          _this[addSourceCodeFile](filePath, name, type);
        });
        return _get__('Promise').resolve();
      }).then(function () {
        return _this[saveConfiguration](_this.targetSwComponent);
      }).then(function () {
        return console.log(_get__('chalk').green('Add finished.'));
      });
    }
  }, {
    key: 'update',
    value: function update(name, type) {
      console.log(_get__('chalk').green('Beginning update...'));
      this.addSource('./');
      var sources = this.targetSwComponent.options.sources;

      return this[updateFrom](name, type, sources).then(function () {
        console.log(_get__('chalk').green('Update finished.'));
        return _get__('Promise').resolve();
      });
    }
  }, {
    key: 'refresh',
    value: function refresh(name, type) {
      console.log(_get__('chalk').green('Beginning refresh...'));
      return this[updateFrom](name, type, ['./']).then(function () {
        console.log(_get__('chalk').green('Refresh finished.'));
        return _get__('Promise').resolve();
      });
    }
  }, {
    key: updateFrom,
    value: function value(name, type, sources) {
      var _this2 = this;

      return _get__('Promise').mapSeries(sources, function (source) {
        console.log(_get__('chalk').magenta('Reading from ' + source + '...'));
        return _this2.synchronize(source, name, type);
      }).then(function () {
        console.log(_get__('chalk').green('Everything updated from all sources.'));
      });
    }
  }, {
    key: saveConfiguration,
    value: function value(newConfiguration) {
      console.log(_get__('chalk').magenta('Writing configuration...'));
      return _get__('writeJson')(_get__('path').normalize(this.targetSwComponent.options.basePath + '/swComponent.json'), newConfiguration, { spaces: 2 });
    }
  }, {
    key: 'synchronize',
    value: function synchronize(sourcePath, name, type) {
      var _this3 = this;

      console.log(_get__('chalk').green('Generation begins...'));
      var rootBasePath = this.targetSwComponent.options.basePath + '/' + sourcePath;
      var rootSwComponentJson = require(_get__('path').normalize(rootBasePath + '/swComponent.json'));
      rootSwComponentJson.options.basePath = rootBasePath;

      console.log(_get__('chalk').magenta('Synchronization begins...'));
      return this.synchronizeWith(sourcePath, rootSwComponentJson, name, type).then(function (newJson) {
        return _this3[saveConfiguration](newJson).then(function () {
          console.log(_get__('chalk').green('All done.'));
          return _get__('Promise').resolve();
        });
      }, function (error) {
        var message = error.message || error;
        console.log(_get__('chalk').red('ERROR: ' + message));
        return _get__('Promise').resolve();
      });
    }
  }, {
    key: 'addSource',
    value: function addSource(fromPath) {
      if (!this.targetSwComponent.options.sources) {
        this.targetSwComponent.options.sources = [fromPath];
      } else {
        var existingSource = this.targetSwComponent.options.sources.find(function (currentSource) {
          return currentSource === fromPath;
        });
        if (!existingSource) {
          this.targetSwComponent.options.sources.push(fromPath);
        }
      }
    }
  }, {
    key: 'inquireBlock',
    value: function inquireBlock(block) {
      // / TBD: there are issues with paths and ph contents to think about yet
      return _get__('Promise').resolve(block);
      // const found = this.targetSwComponent.swBlocks.find(potentialMatch => (potentialMatch.type === block.type))
      // console.log(chalk.green(`inquirer found is ${found}`))
      // if(!found) {
      // 	return block.getMeta()
      // 		.then(metaBlock => {
      // 			return Promise.mapSeries(
      // 				metaBlock.sourceCodeFiles,
      // 				sourceCodeFile => {
      // 					console.log(chalk.green(`inquirer going through keys`), { sourceCodeFile })
      // 					return Promise.mapSeries(
      // 						Object.keys(sourceCodeFile.replacements),
      // 						replacementKey => {
      // 							const replacementObject = sourceCodeFile.replacements[replacementKey]
      // 							console.log(chalk.green(`inquirer replacement object`, {replacementObject}))
      // 							if(replacementObject) {
      // 								const questions = [
      // 									{
      // 										message: `What do you want to put as the value in the replacement named '${replacementKey}' for the file ${sourceCodeFile.path}?`,
      // 										type: "input",
      // 										name: "value",
      // 										default: replacementObject.value
      // 									},
      // 									{
      // 										message: `And for it's regex?`,
      // 										type: "input",
      // 										name: "regex",
      // 										default: replacementObject.regex
      // 									}
      // 								]
      //
      // 								return inquirer.prompt(questions)
      // 									.then(answers => {
      // 										const originalSourceCodeFile = block.sourceCodeFiles.find(scf => (scf.path === sourceCodeFile.path))
      // 										if(originalSourceCodeFile) {
      // 											if(!originalSourceCodeFile.options) {
      // 												originalSourceCodeFile.options = {}
      // 											}
      // 											if(!originalSourceCodeFile.options.replacements) {
      // 												originalSourceCodeFile.options.replacements = {}
      // 											}
      // 											if(!originalSourceCodeFile.options.replacements[replacementKey]) {
      // 												originalSourceCodeFile.options.replacements[replacementKey] = {}
      // 											}
      // 											const replacement = originalSourceCodeFile.options.replacements[replacementKey]
      // 											replacement.value = answers.value
      // 											replacement.regex = answers.regex
      // 											console.log(chalk.green(`all right replacements set`, { originalSourceCodeFile }))
      // 										} else {
      // 											console.log(chalk.red(`replacement originalSourceCodeFile not found`, { sourceCodeFile, answers }))
      // 										}
      // 										return Promise.resolve()
      // 									})
      // 							} else {
      // 								return Promise.resolve()
      // 							}
      // 						}
      // 					)
      // 				}
      // 			)
      // 		})
      // } else {
      // 	return Promise.resolve()
      // }
    }
  }, {
    key: 'jsonificate',
    value: function jsonificate(block) {
      var _this4 = this;

      console.log(_get__('chalk').magenta('Jsonificate block begun...'));
      if (block.options && block.options.jsonification && Array.isArray(block.options.jsonification)) {
        return _get__('Promise').mapSeries(block.options.jsonification, function (jsonificateFile) {
          var sourceCodeFile = block.sourceCodeFiles.find(function (scf) {
            return jsonificateFile.target === scf.name;
          });
          if (sourceCodeFile) {
            console.log('dire', { from: _this4.targetSwComponent.options.basePath + '/' + sourceCodeFile.path, to: _this4.targetSwComponent.options.basePath + '/' + jsonificateFile.to });
            return _this4.jsonification(_this4.targetSwComponent.options.basePath + '/' + sourceCodeFile.path, _this4.targetSwComponent.options.basePath + '/' + jsonificateFile.to);
          } else {
            console.log(_get__('chalk').yellow('WARNING: jsonification file not found on block ' + block.name + '-' + block.type + ' jsonification target ' + jsonificateFile.target));
            return _get__('Promise').resolve();
          }
        }).then(function () {
          console.log(_get__('chalk').magenta('Jsonificate block ended.'));
          return _get__('Promise').resolve();
        });
      } else {
        return _get__('Promise').resolve();
      }
    }
  }, {
    key: 'synchronizeWith',
    value: function synchronizeWith(fromPath, rootSwComponentJson, name, type) {
      var _this5 = this;

      console.log(_get__('chalk').green('building objects and picking newer blocks'));
      var rootSwComponent = this[buildSwComponent](rootSwComponentJson);
      var newerBlocks = this[getNewerBlocks](rootSwComponent, name, type);

      console.log(_get__('chalk').magenta('synchronizing old blocks'));
      return _get__('Promise').mapSeries(newerBlocks, function (swBlock) {
        console.log(_get__('chalk').green('About to update block ' + swBlock.type + ' to version ' + swBlock.version + '... '));
        var syncPromise = _this5.inquireBlock(swBlock).then(function () {
          return _this5.targetSwComponent.synchronizeWith(swBlock);
        }).then(function () {
          return _this5.jsonificate(swBlock);
        });
        return _get__('Promise').resolve(syncPromise).reflect();
      }).then(function (inspections) {
        var errorCount = 0;
        inspections.forEach(function (inspection) {
          if (!inspection.isFulfilled()) {
            errorCount++;
            console.log(_get__('chalk').yellow(inspection.reason()));
          }
        });
        if (errorCount) {
          return _get__('Promise').reject(new Error('Error/Warnings occurred during synchronization.'));
        } else {
          console.log(_get__('chalk').green('Component ' + _this5.targetSwComponent.name + ' updated.'));
          console.log(_get__('chalk').magenta('Adding the new source...'));
          _this5.addSource(fromPath);
          return _get__('Promise').resolve(_this5.targetSwComponent);
        }
      });
    }
  }, {
    key: 'clean',
    value: function clean(dirtyPhs) {
      console.log(_get__('chalk').green('Beginning compile...'));
      return this.targetSwComponent.clean(dirtyPhs).then(function () {
        console.log(_get__('chalk').green('Compile finished.'));
        return _get__('Promise').resolve();
      });
    }
  }]);

  return UpdateSwComponent;
}();

exports.default = UpdateSwComponent;
var _RewiredData__ = {};
var _RewireAPI__ = {};

(function () {
  function addPropertyToAPIObject(name, value) {
    Object.defineProperty(_RewireAPI__, name, {
      value: value,
      enumerable: false,
      configurable: true
    });
  }

  addPropertyToAPIObject('__get__', _get__);
  addPropertyToAPIObject('__GetDependency__', _get__);
  addPropertyToAPIObject('__Rewire__', _set__);
  addPropertyToAPIObject('__set__', _set__);
  addPropertyToAPIObject('__reset__', _reset__);
  addPropertyToAPIObject('__ResetDependency__', _reset__);
  addPropertyToAPIObject('__with__', _with__);
})();

function _get__(variableName) {
  return _RewiredData__ === undefined || _RewiredData__[variableName] === undefined ? _get_original__(variableName) : _RewiredData__[variableName];
}

function _get_original__(variableName) {
  switch (variableName) {
    case 'Promise':
      return _promise2.default;

    case 'fs':
      return _fsExtra2.default;

    case 'Glob':
      return _glob2.default;

    case 'SwComponent':
      return _geneJs.SwComponent;

    case 'semver':
      return _semver2.default;

    case 'chalk':
      return _chalk2.default;

    case 'writeJson':
      return writeJson;

    case 'glob':
      return glob;

    case 'path':
      return _path2.default;
  }

  return undefined;
}

function _assign__(variableName, value) {
  if (_RewiredData__ === undefined || _RewiredData__[variableName] === undefined) {
    return _set_original__(variableName, value);
  } else {
    return _RewiredData__[variableName] = value;
  }
}

function _set_original__(variableName, _value) {
  switch (variableName) {}

  return undefined;
}

function _update_operation__(operation, variableName, prefix) {
  var oldValue = _get__(variableName);

  var newValue = operation === '++' ? oldValue + 1 : oldValue - 1;

  _assign__(variableName, newValue);

  return prefix ? newValue : oldValue;
}

function _set__(variableName, value) {
  if ((typeof variableName === 'undefined' ? 'undefined' : _typeof(variableName)) === 'object') {
    Object.keys(variableName).forEach(function (name) {
      _RewiredData__[name] = variableName[name];
    });
  } else {
    return _RewiredData__[variableName] = value;
  }
}

function _reset__(variableName) {
  delete _RewiredData__[variableName];
}

function _with__(object) {
  var rewiredVariableNames = Object.keys(object);
  var previousValues = {};

  function reset() {
    rewiredVariableNames.forEach(function (variableName) {
      _RewiredData__[variableName] = previousValues[variableName];
    });
  }

  return function (callback) {
    rewiredVariableNames.forEach(function (variableName) {
      previousValues[variableName] = _RewiredData__[variableName];
      _RewiredData__[variableName] = object[variableName];
    });
    var result = callback();

    if (!!result && typeof result.then == 'function') {
      result.then(reset).catch(reset);
    } else {
      reset();
    }

    return result;
  };
}

var _typeOfOriginalExport = typeof UpdateSwComponent === 'undefined' ? 'undefined' : _typeof(UpdateSwComponent);

function addNonEnumerableProperty(name, value) {
  Object.defineProperty(UpdateSwComponent, name, {
    value: value,
    enumerable: false,
    configurable: true
  });
}

if ((_typeOfOriginalExport === 'object' || _typeOfOriginalExport === 'function') && Object.isExtensible(UpdateSwComponent)) {
  addNonEnumerableProperty('__get__', _get__);
  addNonEnumerableProperty('__GetDependency__', _get__);
  addNonEnumerableProperty('__Rewire__', _set__);
  addNonEnumerableProperty('__set__', _set__);
  addNonEnumerableProperty('__reset__', _reset__);
  addNonEnumerableProperty('__ResetDependency__', _reset__);
  addNonEnumerableProperty('__with__', _with__);
  addNonEnumerableProperty('__RewireAPI__', _RewireAPI__);
}

exports.__get__ = _get__;
exports.__GetDependency__ = _get__;
exports.__Rewire__ = _set__;
exports.__set__ = _set__;
exports.__ResetDependency__ = _reset__;
exports.__RewireAPI__ = _RewireAPI__;