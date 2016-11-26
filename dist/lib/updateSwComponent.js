'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.__RewireAPI__ = exports.__ResetDependency__ = exports.__set__ = exports.__Rewire__ = exports.__GetDependency__ = exports.__get__ = undefined;

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

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
var move = _get__('Promise').promisify(_get__('fs').move);
var copy = _get__('Promise').promisify(_get__('fs').copy);
var glob = _get__('Promise').promisify(_get__('Glob'));

var buildSwComponent = Symbol('buildSwComponent');
var getNewerBlocks = Symbol('getNewerBlocks');
var updateFrom = Symbol('updateFrom');
var saveConfiguration = Symbol('saveConfiguration');
var addSourceCodeFile = Symbol('addSourceCodeFile');
var filterBlocks = Symbol('filterBlocks');
var ensureBlocks = Symbol('ensureBlocks');
var process = Symbol('process');

var UpdateSwComponent = function () {
  function UpdateSwComponent(targetSwComponentJson) {
    _classCallCheck(this, UpdateSwComponent);

    if (!targetSwComponentJson.options) {
      targetSwComponentJson.options = {};
    }

    this.targetSwComponent = this[buildSwComponent](targetSwComponentJson);
  }

  _createClass(UpdateSwComponent, [{
    key: _get__('buildSwComponent'),
    value: function value(jsonObject) {
      var result = new (_get__('SwComponent'))(jsonObject.name, jsonObject.type, jsonObject.options);
      result.addSwBlocks(jsonObject.swBlocks);
      return result;
    }
  }, {
    key: _get__('filterBlocks'),
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
    key: _get__('getNewerBlocks'),
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
    key: _get__('addSourceCodeFile'),
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
      var merge = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;

      // TODO: modularize and use babel cli to transform
      var content = require(source);
      if (merge) {
        var newContent = require(destination);
        Object.assign(content, newContent);
      }
      return _get__('writeJson')(destination, content, { spaces: 2 });
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

      return this[updateFrom](sources).then(function () {
        console.log(_get__('chalk').green('Update finished.'));
        return _get__('Promise').resolve();
      });
    }
  }, {
    key: 'refresh',
    value: function refresh(name, type) {
      console.log(_get__('chalk').green('Beginning refresh...'));
      return this[updateFrom]([{ path: './', name: name, type: type }]).then(function () {
        console.log(_get__('chalk').green('Refresh finished.'));
        return _get__('Promise').resolve();
      });
    }
  }, {
    key: _get__('updateFrom'),
    value: function value(sources) {
      var _this2 = this;

      return _get__('Promise').mapSeries(sources, function (source) {
        console.log(_get__('chalk').magenta('Reading from ' + source + '...'));
        return _this2.synchronize(source.path, source.name, source.type, { generate: false });
      }).then(function () {
        console.log(_get__('chalk').green('Everything updated from all sources.'));
      });
    }
  }, {
    key: _get__('saveConfiguration'),
    value: function value(newConfiguration) {
      console.log(_get__('chalk').magenta('Writing configuration...'));
      return _get__('writeJson')(_get__('path').normalize(this.targetSwComponent.options.basePath + '/swComponent.json'), newConfiguration, { spaces: 2 });
    }
  }, {
    key: 'addSource',
    value: function addSource(path, name, type) {
      var newSource = { path: path, name: name, type: type };
      if (!this.targetSwComponent.options.sources) {
        this.targetSwComponent.options.sources = [newSource];
      } else {
        var existingSource = this.targetSwComponent.options.sources.find(function (currentSource) {
          return currentSource.path === newSource.path && currentSource.name === newSource.name && currentSource.type === newSource.type;
        });

        if (!existingSource) {
          this.targetSwComponent.options.sources.push(newSource);
        }
      }
    }
  }, {
    key: 'replicateMeta',
    value: function replicateMeta(path, name, type) {
      // for each block
      // get meta
      // create block
      // initialize files with meta
    }
  }, {
    key: _get__('process'),
    value: function value(block, property, callTo) {
      var _this3 = this;

      console.log(_get__('chalk').magenta(property + ' block begun...'));
      if (block.options && block.options[property] && Array.isArray(block.options[property])) {
        return _get__('Promise').mapSeries(block.options[property], function (file) {
          var sourceCodeFile = block.sourceCodeFiles.find(function (scf) {
            return file.target === scf.name;
          });
          if (sourceCodeFile) {
            console.log(_get__('chalk').magenta(property + ' on file ' + _this3.targetSwComponent.options.basePath + '/' + sourceCodeFile.path + ' to ' + _this3.targetSwComponent.options.basePath + '/' + file.to + '...'));
            return callTo.call(_this3, _this3.targetSwComponent.options.basePath + '/' + sourceCodeFile.path, _this3.targetSwComponent.options.basePath + '/' + file.to);
          } else {
            console.log(_get__('chalk').yellow('WARNING: ' + property + ' file not found on block ' + block.name + '-' + block.type + ' with target ' + file.target));
            return _get__('Promise').resolve();
          }
        }).then(function () {
          console.log(_get__('chalk').magenta(property + ' block ended.'));
          return _get__('Promise').resolve();
        });
      } else {
        return _get__('Promise').resolve();
      }
    }
  }, {
    key: 'copyFile',
    value: function copyFile(source, to) {
      return _get__('copy')(source, to, { clobber: true });
    }
  }, {
    key: 'copy',
    value: function copy(block) {
      return this[process](block, 'copy', this.copyFile);
    }
  }, {
    key: 'jsonificate',
    value: function jsonificate(block) {
      return this[process](block, 'jsonification', this.jsonification);
    }
  }, {
    key: 'moveFile',
    value: function moveFile(source, to) {
      return _get__('move')(source, to, { clobber: true });
    }
  }, {
    key: 'move',
    value: function move(block) {
      return this[process](block, 'move', this.moveFile);
    }
  }, {
    key: 'inquireBlock',
    value: function inquireBlock(block) {
      return _get__('Promise').resolve(block);
    }
  }, {
    key: _get__('ensureBlocks'),
    value: function value(rootSwComponent, name, type) {
      var _this4 = this;

      console.log(_get__('chalk').yellow('ensureBlocks'));
      var rootBlocks = this[filterBlocks](rootSwComponent.swBlocks, name, type);
      rootBlocks.forEach(function (rootBlock) {
        var block = _this4.targetSwComponent.swBlocks.find(function (swBlock) {
          return (swBlock.name === rootBlock.name || !rootBlock.name) && (swBlock.type === rootBlock.type || !rootBlock.type);
        });
        if (!block) {
          block = { name: rootBlock.name, type: rootBlock.type, options: rootBlock.options, version: '0.0.0', sourceCodeFiles: rootBlock.sourceCodeFiles };
          _this4.targetSwComponent.addSwBlock(block);
        }
      });
    }
  }, {
    key: 'synchronize',
    value: function synchronize(sourcePath, name, type, options) {
      console.log(_get__('chalk').green('Generation begins...'));
      var rootBasePath = this.targetSwComponent.options.basePath + '/' + sourcePath;
      var rootSwComponentJson = require(_get__('path').normalize(rootBasePath + '/swComponent.json'));
      rootSwComponentJson.options.basePath = rootBasePath;

      console.log(_get__('chalk').magenta('Synchronization begins...'));
      return this.synchronizeWith(sourcePath, rootSwComponentJson, name, type, options).then(function () {
        console.log(_get__('chalk').green('All done.'));
        return _get__('Promise').resolve();
      }, function (error) {
        var message = error.message || error;
        console.log(_get__('chalk').red('ERROR: ' + message));
        return _get__('Promise').resolve();
      });
    }
  }, {
    key: 'synchronizeWith',
    value: function synchronizeWith(fromPath, rootSwComponentJson, name, type) {
      var _this5 = this;

      var options = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : { generate: true };

      console.log(_get__('chalk').green('building objects and picking newer blocks'));
      var rootSwComponent = this[buildSwComponent](rootSwComponentJson);
      if (options.generate) {
        this[ensureBlocks](rootSwComponent, name, type);
      }
      var newerBlocks = this[getNewerBlocks](rootSwComponent, name, type);

      console.log(_get__('chalk').magenta('synchronizing old blocks'));
      return rootSwComponent.getMeta().then(function (metaObject) {
        return _this5.targetSwComponent.setMeta(metaObject);
      }).then(function () {
        return _get__('Promise').mapSeries(newerBlocks, function (swBlock) {
          console.log(_get__('chalk').green('About to update block ' + swBlock.type + ' to version ' + swBlock.version + '... '));
          var syncPromise = _this5.inquireBlock(swBlock).then(function () {
            return _this5.targetSwComponent.synchronizeWith(swBlock);
          }).then(function () {
            return _this5.jsonificate(swBlock);
          }).then(function () {
            return _this5.move(swBlock);
          }).then(function () {
            return _this5.copy(swBlock);
          }).then(function () {
            console.log(_get__('chalk').magenta('About to write configuration... '));
            console.log(_get__('chalk').magenta('Adding the new source...'));
            _this5.addSource(fromPath, name, type);
            return _this5[saveConfiguration](_this5.targetSwComponent).then(function () {
              console.log(_get__('chalk').magenta('Configuration written  for type ' + swBlock.type + ' to version ' + swBlock.version + '... '));
            });
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
            return _get__('Promise').resolve(_this5.targetSwComponent);
          }
        });
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

var _RewiredData__ = Object.create(null);

var INTENTIONAL_UNDEFINED = '__INTENTIONAL_UNDEFINED__';
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
  if (_RewiredData__ === undefined || _RewiredData__[variableName] === undefined) {
    return _get_original__(variableName);
  } else {
    var value = _RewiredData__[variableName];

    if (value === INTENTIONAL_UNDEFINED) {
      return undefined;
    } else {
      return value;
    }
  }
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

    case 'copy':
      return copy;

    case 'move':
      return move;

    case 'buildSwComponent':
      return buildSwComponent;

    case 'filterBlocks':
      return filterBlocks;

    case 'getNewerBlocks':
      return getNewerBlocks;

    case 'addSourceCodeFile':
      return addSourceCodeFile;

    case 'updateFrom':
      return updateFrom;

    case 'saveConfiguration':
      return saveConfiguration;

    case 'process':
      return process;

    case 'ensureBlocks':
      return ensureBlocks;
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
    if (value === undefined) {
      _RewiredData__[variableName] = INTENTIONAL_UNDEFINED;
    } else {
      _RewiredData__[variableName] = value;
    }

    return function () {
      _reset__(variableName);
    };
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