import { SwComponent } from 'gene-js'
import semver from 'semver'
import chalk from 'chalk'
import Promise from './promise.js'
import path from 'path'
import fs from 'fs-extra'
import Glob from 'glob'
// import inquirer from "inquirer"

const writeJson = Promise.promisify(fs.writeJson)
const move = Promise.promisify(fs.move)
const copy = Promise.promisify(fs.copy)
const glob = Promise.promisify(Glob)

const buildSwComponent = Symbol('buildSwComponent')
const getNewerBlocks = Symbol('getNewerBlocks')
const updateFrom = Symbol('updateFrom')
const saveConfiguration = Symbol('saveConfiguration')
const addSourceCodeFile = Symbol('addSourceCodeFile')
const filterBlocks = Symbol('filterBlocks')
const ensureBlocks = Symbol('ensureBlocks')
const process = Symbol('process')

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
    if (!blockFound) {
      const version = '0.0.0'
      blockFound = this.targetSwComponent.addSwBlock({name, type, version, sourceCodeFiles: [sourceCodeFileJson]})
    } else {
      const sourceCodeFileFound = blockFound.sourceCodeFiles.find(file => (file.path === sourceCodeFileJson.path))
      if (!sourceCodeFileFound) {
        blockFound.addSourceCodeFile(sourceCodeFileJson)
      } else {
        console.log(chalk.magenta(`File ${sourceCodeFilePath} already exists, omitted`))
      }
    }
  }

  increment (release, name, type) {
    console.log(chalk.green('Incrementing the release...'))
    const blocks = this[filterBlocks](this.targetSwComponent.swBlocks, name, type)
    blocks.forEach(
      block => {
        block.version = semver.inc(block.version, release)
      }
    )
    return this[saveConfiguration](this.targetSwComponent)
      .then(() => console.log(chalk.green('Increment finished.')))
  }

  jsonification (source, destination, merge = false) {
    require('babel-register')
    let content = require(source)
    if (merge) {
      let newContent = require(destination)
      Object.assign(content, newContent)
    }
    return writeJson(destination, content, { spaces: 2 })
  }

  addFile (filePath, name, type) {
    console.log(chalk.green('Beginning addition of a single file...'))
    this[addSourceCodeFile](filePath, name, type)
    return this[saveConfiguration](this.targetSwComponent)
      .then(() => console.log(chalk.green('Addfile finished.')))
  }

  add (pattern, name, type) {
    console.log(chalk.green('Beginning addition...'))
    return glob(pattern)
      .then((files) => {
        files.forEach(
          filePath => {
            this[addSourceCodeFile](filePath, name, type)
          }
        )
        return Promise.resolve()
      })
      .then(() => this[saveConfiguration](this.targetSwComponent))
      .then(() => console.log(chalk.green('Add finished.')))
  }

  update (name, type) {
    console.log(chalk.green('Beginning update...'))
    this.addSource('./')
    const sources = this.targetSwComponent.options.sources

    return this[updateFrom](sources)
      .then(() => {
        console.log(chalk.green('Update finished.'))
        return Promise.resolve()
      })
  }

  refresh (name, type) {
    console.log(chalk.green('Beginning refresh...'))
    return this[updateFrom]([{path: './', name, type}])
      .then(() => {
        console.log(chalk.green('Refresh finished.'))
        return Promise.resolve()
      })
  }

  [ updateFrom ] (sources) {
    return Promise.mapSeries(
      sources,
      source => {
        console.log(chalk.magenta(`Reading from ${source}...`))
        return this.synchronize(source.path, source.name, source.type, { generate: false })
      }
    )
      .then(() => {
        console.log(chalk.green('Everything updated from all sources.'))
      })
  }

  [ saveConfiguration ] (newConfiguration) {
    console.log(chalk.magenta('Writing configuration...'))
    return writeJson(path.normalize(`${this.targetSwComponent.options.basePath}/swComponent.json`), newConfiguration, { spaces: 2 })
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
    console.log(chalk.magenta(`${property} block begun...`))
    if (block.options && block.options[property] && Array.isArray(block.options[property])) {
      return Promise.mapSeries(
        block.options[property],
        file => {
          const sourceCodeFile = block.sourceCodeFiles.find(scf => file.target === scf.name)
          if (sourceCodeFile) {
            console.log(chalk.magenta(`${property} on file ${this.targetSwComponent.options.basePath}/${sourceCodeFile.path} to ${this.targetSwComponent.options.basePath}/${file.to}...`))
            return callTo.call(this, `${this.targetSwComponent.options.basePath}/${sourceCodeFile.path}`, `${this.targetSwComponent.options.basePath}/${file.to}`)
          } else {
            console.log(chalk.yellow(`WARNING: ${property} file not found on block ${block.name}-${block.type} with target ${file.target}`))
            return Promise.resolve()
          }
        }
      )
      .then(() => {
        console.log(chalk.magenta(`${property} block ended.`))
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

  [ensureBlocks] (rootSwComponent, name, type) {
    console.log(chalk.yellow('ensureBlocks'))
    const rootBlocks = this[filterBlocks](rootSwComponent.swBlocks, name, type)
    rootBlocks.forEach(
      rootBlock => {
        let block = this.targetSwComponent.swBlocks.find(
          swBlock => ((swBlock.name === rootBlock.name || !rootBlock.name) && (swBlock.type === rootBlock.type || !rootBlock.type))
        )
        if (!block) {
          block = { name: rootBlock.name, type: rootBlock.type, options: rootBlock.options, version: '0.0.0', sourceCodeFiles: rootBlock.sourceCodeFiles }
          this.targetSwComponent.addSwBlock(block)
        }
      }
    )
  }

  synchronize (sourcePath, name, type, options) {
    console.log(chalk.green('Generation begins...'))
    const rootBasePath = `${this.targetSwComponent.options.basePath}/${sourcePath}`
    const rootSwComponentJson = require(path.normalize(`${rootBasePath}/swComponent.json`))
    rootSwComponentJson.options.basePath = rootBasePath

    console.log(chalk.magenta('Synchronization begins...'))
    return this.synchronizeWith(sourcePath, rootSwComponentJson, name, type, options)
      .then(() => {
        console.log(chalk.green('All done.'))
        return Promise.resolve()
      },
      error => {
        const message = error.message || error
        console.log(chalk.red(`ERROR: ${message}`))
        return Promise.resolve()
      })
  }

  synchronizeWith (fromPath, rootSwComponentJson, name, type, options = { generate: true }) {
    console.log(chalk.green('building objects and picking newer blocks'))
    const rootSwComponent = this[buildSwComponent](rootSwComponentJson)
    if(options.generate) {
      this[ensureBlocks](rootSwComponent, name, type)
    }
    const newerBlocks = this[getNewerBlocks](rootSwComponent, name, type)

    console.log(chalk.magenta('synchronizing old blocks'))
    return rootSwComponent.getMeta()
      .then(metaObject => this.targetSwComponent.setMeta(metaObject))
      .then(() => {
        return Promise.mapSeries(
          newerBlocks,
          swBlock => {
            console.log(chalk.green(`About to update block ${swBlock.type} to version ${swBlock.version}... `))
            const syncPromise = this.inquireBlock(swBlock)
              .then(() => this.targetSwComponent.synchronizeWith(swBlock))
              .then(() => this.jsonificate(swBlock))
              .then(() => this.move(swBlock))
              .then(() => this.copy(swBlock))
              .then(
                () => {
                  console.log(chalk.magenta(`About to write configuration... `))
                  console.log(chalk.magenta('Adding the new source...'))
                  this.addSource(fromPath, name, type)
                  return this[saveConfiguration](this.targetSwComponent)
                    .then(() => {
                      console.log(chalk.magenta(`Configuration written  for type ${swBlock.type} to version ${swBlock.version}... `))
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
                console.log(chalk.yellow(inspection.reason()))
              }
            }
          )
          if (errorCount) {
            return Promise.reject(new Error('Error/Warnings occurred during synchronization.'))
          } else {
            console.log(chalk.green(`Component ${this.targetSwComponent.name} updated.`))
            return Promise.resolve(this.targetSwComponent)
          }
        })
      })
  }

  clean (dirtyPhs) {
    console.log(chalk.green('Beginning compile...'))
    return this.targetSwComponent.clean(dirtyPhs)
      .then(() => {
        console.log(chalk.green('Compile finished.'))
        return Promise.resolve()
      })
  }
}
