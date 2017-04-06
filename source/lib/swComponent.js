/* eslint-disable no-console */
import SwBlock from './swBlock.js'
import Promise from './promise.js'
const debug = require('debug')('nicosommi.gddify.swComponent')

export default class SwComponent {
  constructor (name, type, options) {
    this.name = name
    this.type = type
    this.options = options
    this.swBlocks = []
  }

  toJSON() {
    const newOptions = this.options
    delete newOptions.basePath
    let newBlocks = []
    if(this.swBlocks) {
      newBlocks = this.swBlocks.map(
        ({ name, type, version, options, sourceCodeFiles }) => {
          let newSourceCodeFiles = []
          if(sourceCodeFiles) {
            newSourceCodeFiles = sourceCodeFiles.map(
              ({ name, path, options }) => {
                const newOptions = options
                delete newOptions.basePath
                return {
                  name, path, options: newOptions
                }
              }
            )
          }
          
          const newOptions = options
          delete newOptions.basePath
          return ({
            name,
            type,
            version,
            options: newOptions,
            sourceCodeFiles: newSourceCodeFiles
          })
        }
      )
    }
    
    return {
      name: this.name,
      type: this.type,
      options: newOptions,
      swBlocks: newBlocks
    }
  }

  addSwBlock (swBlock) {
    const newOptions = Object.assign({}, swBlock.options, this.options) // passing options down through
    const newSwBlock = new SwBlock(swBlock.name, swBlock.type, swBlock.version, newOptions)
    newSwBlock.addSourceCodeFiles(swBlock.sourceCodeFiles)
    this.swBlocks.push(newSwBlock)
    return newSwBlock
  }

  addSwBlocks (swBlocks) {
    swBlocks.forEach(swBlock => this.addSwBlock(swBlock))
  }

  getMeta (name, type) {
    return Promise.all(
      this.swBlocks
      .filter(swBlock => {
        return (!name || name === swBlock.name)
          && (!type || type === swBlock.type)
      })
      .map(swBlock => {
        return swBlock.getMeta()
      })
    )
      .then(results => {
        return Promise.resolve({
          name: this.name,
          type: this.type,
          swBlocks: results
        })
      })
  }

  setMeta (metaObject) {
    return Promise.all(metaObject.swBlocks.map(swBlock => {
      const block = new SwBlock(swBlock.name, swBlock.type)
      return block.setMeta(swBlock)
    }))
  }

  synchronizeWith (rootBlock) {
    debug(`synchronize component started`)
    let promise

    // find this.swBlock
    const matchingSwBlocks = this.swBlocks.filter(swBlock => (swBlock.type === rootBlock.type))
    if (matchingSwBlocks && matchingSwBlocks.length > 0) {
      debug(`going through existing blocks`)
      promise = Promise.all(
        matchingSwBlocks.map(matchingSwBlock => matchingSwBlock.synchronizeWith(rootBlock))
      )
    } else {
      debug(`creating a new block named ${rootBlock.name} of type ${rootBlock.type}`)
      const newOptions = Object.assign({}, this.options, rootBlock.options)
      const newSwBlock = this.addSwBlock({
        name: rootBlock.name,
        type: rootBlock.type,
        version: '0.0.0',
        options: newOptions,
        sourceCodeFiles: []
      })
      promise = newSwBlock.synchronizeWith(rootBlock)
    }

    return promise
  }

  clean (dirtyPhs) {
    const promises = this.swBlocks.map(swBlock => swBlock.clean(dirtyPhs))
    return Promise.all(promises)
  }
}
