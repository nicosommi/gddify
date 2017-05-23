import SwComponent from './swComponent.js'
import semver from 'semver'
import Promise from './promise.js'
import path from 'path'
import fs from 'fs-extra'
import Glob from 'glob'

const writeJson = Promise.promisify(fs.writeJson)
const move = Promise.promisify(fs.move)
const copy = Promise.promisify(fs.copy)
const readFile = Promise.promisify(fs.readFile)
const glob = Promise.promisify(Glob)

const buildSwComponent = Symbol('buildSwComponent')
const getNewerBlocks = Symbol('getNewerBlocks')
const updateFrom = Symbol('updateFrom')
const saveConfiguration = Symbol('saveConfiguration')
const addSourceCodeFile = Symbol('addSourceCodeFile')
const filterBlocks = Symbol('filterBlocks')
const ensureBlocks = Symbol('ensureBlocks')
const process = Symbol('process')
const getCwd = Symbol('getCwd')

const debug = require('debug')('nicosommi.gddify.updateSwComponent')

export default class UpdateSwComponent {
  constructor (targetSwComponentJson) {
    if (!targetSwComponentJson.options) {
      targetSwComponentJson.options = {}
    }

    this.targetSwComponent = this[buildSwComponent](targetSwComponentJson)
  }

  [ buildSwComponent ] (jsonObject) {
    const result = new SwComponent(jsonObject.name, jsonObject.type, jsonObject.options)
    result.addSwBlocks(jsonObject.swBlocks)
    return result
  }

  [ filterBlocks ] (blocks, name, type) {
    let result = blocks
    if (name) {
      result = result.filter(block => block.name === name)
    }

    if (type) {
      result = result.filter(block => block.type === type)
    }
    return result
  }

  [ getNewerBlocks ] (component, name, type) {
    const result = []
    const newerBlocks = this[filterBlocks](component.swBlocks, name, type)

    // TODO: use a Set on result
    newerBlocks
      .forEach(
        (swBlock) => {
          let index
          const found = result.find((targetBlock, i) => {
            index = i
            return (targetBlock.type === swBlock.type)
          })
          if (!found) {
            result.push(swBlock)
          } else if (semver.gt(swBlock.version, found.version)) {
            result.splice(index, 1, swBlock)
          }
        }
    )
    return result
  }

  [ addSourceCodeFile ] (sourceCodeFilePath, name, type) {
    let blockFound = this.targetSwComponent.swBlocks.find(block => (block.name === name && block.type === type))
    const sourceCodeFileJson = { name: sourceCodeFilePath, path: sourceCodeFilePath }
    debug(`About to add file ${sourceCodeFilePath}...`)
    if (!blockFound) {
      const version = '0.0.0'
      blockFound = this.targetSwComponent.addSwBlock({name, type, version, sourceCodeFiles: [sourceCodeFileJson]})
      debug(`added by creating a new block ${name} / ${type} (name / type)`)
    } else {
      const sourceCodeFileFound = blockFound.sourceCodeFiles.find(file => (file.path === sourceCodeFileJson.path))
      if (!sourceCodeFileFound) {
        blockFound.addSourceCodeFile(sourceCodeFileJson)
        debug(`added on the existing block ${name} / ${type} (name / type)`)
      } else {
        debug(`File ${sourceCodeFilePath} already exists, omitted`)
      }
    }
  }

  replicate (name, type, targetName) {
    debug('Replicating a new block...', { name, type, targetName })
    const rootBasePath = `${this[getCwd]()}/`
    const rootSwComponentJson = require(path.normalize(`${rootBasePath}/swComponent.json`))
    rootSwComponentJson.options.basePath = rootBasePath
    return this.synchronizeWith('./', rootSwComponentJson, targetName, name, type, { generate: true })
      .then(() => {
        debug('All done.')
        return Promise.resolve()
      },
      error => {
        const message = error.message || error
        debug(`ERROR: ${message}`)
        return Promise.resolve()
      })
  }

  increment (release, name, type) {
    debug('Incrementing the release...')
    const blocks = this[filterBlocks](this.targetSwComponent.swBlocks, name, type)
    blocks.forEach(
      block => {
        block.version = semver.inc(block.version, release)
      }
    )
    return this[saveConfiguration](this.targetSwComponent)
      .then(() => debug('Increment finished.'))
  }

  jsonification (source, destination, merge = false) {
    return readFile(source, "utf8")
      .then(
        code => {
          let content = eval(require("babel-core").transform(code, {
            presets: ["babel-preset-stage-2"],
            sourceRoot: `${__dirname}/../..`
          }).code)

          if (merge) {
            let newContent = require(destination)
            Object.assign(content, newContent)
          }

          return writeJson(destination, content, { spaces: 2 })
        }
      )
  }

  addFile (filePath, name, type) {
    debug('Beginning addition of a single file...')
    this[addSourceCodeFile](filePath, name, type)
    return this[saveConfiguration](this.targetSwComponent)
      .then(() => debug('Addfile finished.'))
  }

  add (pattern, name, type) {
    debug('Beginning addition...')
    return glob(pattern)
      .then((files) => {
        debug('Pattern matched files', { files })
        files.forEach(
          filePath => {
            debug('Iterate on', { filePath })
            this[addSourceCodeFile](filePath, name, type)
          }
        )
        return Promise.resolve()
      })
      .then(() => this[saveConfiguration](this.targetSwComponent))
      .then(() => debug('Add finished.'))
  }

  update (name, type) {
    debug('Beginning update...')
    this.addSource('./')
    const sources = this.targetSwComponent.options.sources

    return this[updateFrom](sources)
      .then(() => {
        debug('Update finished.')
        return Promise.resolve()
      })
  }

  refresh (name, type) {
    debug('Beginning refresh...')
    return this[updateFrom]([{path: './', name, type}])
      .then(() => {
        debug('Refresh finished.')
        return Promise.resolve()
      })
  }

  [ updateFrom ] (sources) {
    return Promise.mapSeries(
      sources,
      source => {
        debug(`Reading from ${source}...`)
        return this.synchronize(source.path, source.path, source.name, source.type, { generate: false })
      }
    )
      .then(() => {
        debug('Everything updated from all sources.')
      })
  }

  [ saveConfiguration ] (newConfiguration) {
    debug('Writing configuration...')
    const basePath = this[getCwd]()
    return writeJson(path.normalize(`${basePath}/swComponent.json`), newConfiguration.toJSON(), { spaces: 2 })
  }

  addSource (path, name, type) {
    const newSource = { path, name, type }
    if (!this.targetSwComponent.options.sources) {
      this.targetSwComponent.options.sources = [newSource]
    } else {
      const existingSource = this.targetSwComponent.options.sources.find(
        currentSource => {
          return (currentSource.path === newSource.path && currentSource.name === newSource.name && currentSource.type === newSource.type)
        }
      )

      if (!existingSource) {
        this.targetSwComponent.options.sources.push(newSource)
      }
    }
  }

  replicateMeta (path, name, type) {
    // for each block
    // get meta
    // create block
    // initialize files with meta
  }

  [process] (block, property, callTo) {
    debug(`${property} block begun...`)
    if (block.options && block.options[property] && Array.isArray(block.options[property])) {
      return Promise.mapSeries(
        block.options[property],
        file => {
          const sourceCodeFile = block.sourceCodeFiles.find(scf => file.target === scf.name)
          if (sourceCodeFile) {
            const cwd = this[getCwd]()
            debug(`${property} on file ${cwd}/${sourceCodeFile.path} to ${cwd}/${file.to}...`)
            return callTo.call(this, `${cwd}/${sourceCodeFile.path}`, `${cwd}/${file.to}`)
          } else {
            debug(`WARNING: ${property} file not found on block ${block.name}-${block.type} with target ${file.target}`)
            return Promise.resolve()
          }
        }
      )
      .then(() => {
        debug(`${property} block ended.`)
        return Promise.resolve()
      })
    } else {
      return Promise.resolve()
    }
  }

  copyFile (source, to) {
    return copy(source, to, { clobber: true })
  }

  copy (block) {
    return this[process](block, 'copy', this.copyFile)
  }

  jsonificate (block) {
    return this[process](block, 'jsonification', this.jsonification)
  }

  moveFile (source, to) {
    return move(source, to, { clobber: true })
  }

  move (block) {
    return this[process](block, 'move', this.moveFile)
  }

  inquireBlock (block) {
    return Promise.resolve(block)
  }

  [ensureBlocks] (rootSwComponent, targetName, name, type) {
    debug('ensureBlocks', { targetName, name, type })
    const rootBlocks = this[filterBlocks](rootSwComponent.swBlocks, name, type)
    debug('rootBlocks', { rootBlocks })
    rootBlocks.forEach(
      rootBlock => {
        debug('finding blocks', { rootBlock, targetName, name, type })
        let block = this.targetSwComponent.swBlocks.find(
          swBlock => ((swBlock.name === targetName || !targetName) && (swBlock.type === rootBlock.type || !rootBlock.type))
        )
        if (!block) {
          debug('not found block', {targetName, type})
          let sourceCodeFiles = []
          if (rootBlock.sourceCodeFiles) {
            debug('replacing ', { name, targetName })
            sourceCodeFiles = rootBlock.sourceCodeFiles.map(
              ({name: sourceCodeFileName, path}) => ({ name: sourceCodeFileName, path: path.replace(name, targetName)})
            )
          }

          block = {
            name: targetName,
            type: rootBlock.type,
            version: rootBlock.version,
            options: rootBlock.options,
            sourceCodeFiles
          }
          this.targetSwComponent.addSwBlock(block)
        } else {
          debug('found block', {targetName, type, block})
        }
      }
    )
  }

  [ getCwd ] () {
    return require('process').cwd()
  }

  synchronize (sourcePath, name, type, targetName, options) {
    debug('Generation begins...'), { sourcePath }
    const rootBasePath = `${this[getCwd]()}/${sourcePath}`
    const rootSwComponentJson = require(path.normalize(`${rootBasePath}/swComponent.json`))
    rootSwComponentJson.options.basePath = rootBasePath

    debug('Synchronization begins...')
    return this.synchronizeWith(sourcePath, rootSwComponentJson, targetName, name, type, options)
      .then(() => {
        debug('All done.')
        return Promise.resolve()
      },
      error => {
        const message = error.message || error
        debug(`ERROR: ${message}`)
        return Promise.resolve()
      })
  }

  synchronizeWith (fromPath, rootSwComponentJson, targetName, name, type, options = { generate: true }) {
    debug('building objects and picking newer blocks')
    const rootSwComponent = this[buildSwComponent](rootSwComponentJson)
    if(options.generate) {
      this[ensureBlocks](rootSwComponent, targetName, name, type)
    }
    const newerBlocks = this[getNewerBlocks](rootSwComponent, name, type)

    debug('synchronizing old blocks')
    return rootSwComponent.getMeta(name, type)
      .then(metaObject => this.targetSwComponent.setMeta(metaObject))
      .then(() => {
        return Promise.mapSeries(
          newerBlocks,
          swBlock => {
            debug(`About to update block ${swBlock.type} to version ${swBlock.version}... `)
            const syncPromise = this.inquireBlock(swBlock)
              .then(() => this.targetSwComponent.synchronizeWith(swBlock))
              .then(() => this.jsonificate(swBlock))
              .then(() => this.move(swBlock))
              .then(() => this.copy(swBlock))
              .then(
                () => {
                  debug(`About to write configuration... `)
                  debug('Adding the new source...')
                  this.addSource(fromPath, name, type)
                  return this[saveConfiguration](this.targetSwComponent)
                    .then(() => {
                      debug(`Configuration written  for type ${swBlock.type} to version ${swBlock.version}... `)
                    })
                }
              )
            return Promise.resolve(syncPromise).reflect()
          }
        )
        .then((inspections) => {
          let errorCount = 0
          inspections.forEach(
            inspection => {
              if (!inspection.isFulfilled()) {
                errorCount++
                debug(inspection.reason())
              }
            }
          )
          if (errorCount) {
            return Promise.reject(new Error('Error/Warnings occurred during synchronization.'))
          } else {
            debug(`Component ${this.targetSwComponent.name} updated.`)
            return Promise.resolve(this.targetSwComponent)
          }
        })
      })
  }

  clean (dirtyPhs) {
    debug('Beginning compile...')
    return this.targetSwComponent.clean(dirtyPhs)
      .then(() => {
        debug('Compile finished.')
        return Promise.resolve()
      })
  }
}
