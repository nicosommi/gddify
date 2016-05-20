import { SwComponent } from 'gene-js'
import semver from 'semver'
import chalk from 'chalk'
import Promise from './promise.js'
import path from 'path'
import fs from 'fs-extra'
import Glob from 'glob'
// import inquirer from "inquirer"

const writeJson = Promise.promisify(fs.writeJson)
const glob = Promise.promisify(Glob)

const buildSwComponent = Symbol('buildSwComponent')
const getNewerBlocks = Symbol('getNewerBlocks')
const updateFrom = Symbol('updateFrom')
const saveConfiguration = Symbol('saveConfiguration')
const addSourceCodeFile = Symbol('addSourceCodeFile')
const filterBlocks = Symbol('filterBlocks')

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

  jsonification (source, destination) {
    return writeJson(destination, require(source), { spaces: 2 })
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
        return this.synchronize(source.path, source.name, source.type)
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

  synchronize (sourcePath, name, type) {
    console.log(chalk.green('Generation begins...'))
    const rootBasePath = `${this.targetSwComponent.options.basePath}/${sourcePath}`
    const rootSwComponentJson = require(path.normalize(`${rootBasePath}/swComponent.json`))
    rootSwComponentJson.options.basePath = rootBasePath

    console.log(chalk.magenta('Synchronization begins...'))
    return this.synchronizeWith(sourcePath, rootSwComponentJson, name, type)
      .then(newJson => {
        return this[saveConfiguration](newJson)
          .then(() => {
            console.log(chalk.green('All done.'))
            return Promise.resolve()
          })
      }, error => {
        const message = error.message || error
        console.log(chalk.red(`ERROR: ${message}`))
        return Promise.resolve()
      })
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

  inquireBlock (block) {
    // / TBD: there are issues with paths and ph contents to think about yet
    return Promise.resolve(block)
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

  jsonificate (block) {
    console.log(chalk.magenta(`Jsonificate block begun...`))
    if (block.options && block.options.jsonification && Array.isArray(block.options.jsonification)) {
      return Promise.mapSeries(
        block.options.jsonification,
        jsonificateFile => {
          const sourceCodeFile = block.sourceCodeFiles.find(scf => jsonificateFile.target === scf.name)
          if (sourceCodeFile) {
            console.log('dire', {from: `${this.targetSwComponent.options.basePath}/${sourceCodeFile.path}`, to: `${this.targetSwComponent.options.basePath}/${jsonificateFile.to}`})
            return this.jsonification(`${this.targetSwComponent.options.basePath}/${sourceCodeFile.path}`, `${this.targetSwComponent.options.basePath}/${jsonificateFile.to}`)
          } else {
            console.log(chalk.yellow(`WARNING: jsonification file not found on block ${block.name}-${block.type} jsonification target ${jsonificateFile.target}`))
            return Promise.resolve()
          }
        }
      )
      .then(() => {
        console.log(chalk.magenta(`Jsonificate block ended.`))
        return Promise.resolve()
      })
    } else {
      return Promise.resolve()
    }
  }

  synchronizeWith (fromPath, rootSwComponentJson, name, type) {
    console.log(chalk.green('building objects and picking newer blocks'))
    const rootSwComponent = this[buildSwComponent](rootSwComponentJson)
    const newerBlocks = this[getNewerBlocks](rootSwComponent, name, type)

    console.log(chalk.magenta('synchronizing old blocks'))
    return Promise.mapSeries(
      newerBlocks,
      swBlock => {
        console.log(chalk.green(`About to update block ${swBlock.type} to version ${swBlock.version}... `))
        const syncPromise = this.inquireBlock(swBlock)
          .then(() => this.targetSwComponent.synchronizeWith(swBlock))
          .then(() => this.jsonificate(swBlock))
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
          console.log(chalk.magenta('Adding the new source...'))
          this.addSource(fromPath, name, type)
          return Promise.resolve(this.targetSwComponent)
        }
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
