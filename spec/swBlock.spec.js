import SwBlock from '../source/lib/swBlock.js'
import { SourceCodeFile } from 'gene-js'
import Promise from '../source/lib/promise.js'
import sinon from 'sinon'

describe('SwBlock', () => {
  let swBlock,
    name,
    type,
    options,
    version

  beforeEach(() => {
    name = 'fruitBasketBlock'
    type = 'basket'
    version = '0.0.1'
    options = {
      cleanPath: 'clean',
      basePath: ''
    }
    swBlock = new SwBlock(name, type, version, options)
  })

  describe('constructor(name, type, options)', () => {
    it('should set the source block name', () => {
      swBlock.name.should.equal(name)
    })

    it('should set the block type', () => {
      swBlock.type.should.equal(type)
    })

    it('should set the block version', () => {
      swBlock.version.should.equal(version)
    })

    it('should set the options if provided', () => {
      swBlock.options.should.eql(options)
    })
  })

  describe('(adding source files)', () => {
    describe('.addSourceCodeFile(source, clean, options)', () => {
      let sourceCodeFileName,
        path,
        clean

      beforeEach(() => {
        sourceCodeFileName = ''
        path = ''
        clean = ''
        swBlock.addSourceCodeFile({name: sourceCodeFileName, path, options})
      })

      it('should add the source file to the array', () => {
        swBlock.sourceCodeFiles.should.eql([new SourceCodeFile(sourceCodeFileName, path, options)])
      })

      it('should pass the option properties to the source code options along with the specific ones', () => {
        swBlock = new SwBlock(name, type, version, { aproperty: 1, onemore: 2 })
        swBlock.addSourceCodeFile({name: 'aname', path, clean, options: { onemore: 3, another: 4 }})
        swBlock.sourceCodeFiles[0].options.should.eql({ aproperty: 1, onemore: 2, another: 4 })
      })
    })

    describe('.addSourceCodeFiles(array)', () => {
      let inputArray,
        expectedArray

      beforeEach(() => {
        const firstElement = { name: 'firstElement', path: 'sourceCodeFileExample', options: {} }
        const secondElement = { name: 'secondElement', path: 'oneMoreSourceCodeFileExample', options: {} }
        inputArray = []
        inputArray.push(firstElement)
        inputArray.push(secondElement)

        expectedArray = []
        expectedArray.push(new SourceCodeFile(firstElement.name, firstElement.path, options))
        expectedArray.push(new SourceCodeFile(secondElement.name, secondElement.path, options))
        swBlock.addSourceCodeFiles(inputArray)
      })

      it('should add the source file to the array', () => {
        swBlock.sourceCodeFiles.should.eql(expectedArray)
      })
    })
  })

  describe('(methods)', () => {
    let inputArray,
      sourceSwBlock

    beforeEach(() => {
      const firstElement = { name: 'firstElement', path: 'sourceCodeFileExample', options: {} }
      const secondElement = { name: 'secondElement', path: 'oneMoreSourceCodeFileExample', options: {} }
      inputArray = []
      inputArray.push(firstElement)
      inputArray.push(secondElement)

      sourceSwBlock = new SwBlock('rootFruitBasketBlock', 'basket', '0.0.2', { basePath: '' })
      sourceSwBlock.addSourceCodeFiles(inputArray)
      swBlock.addSourceCodeFiles(inputArray)
    })

    describe('.synchronizeWith(rootSwBlock)', () => {
      let synchronizeSpy

      beforeEach(() => {
        synchronizeSpy = sinon.spy(() => Promise.resolve())
        SourceCodeFile.__Rewire__('synchronize', synchronizeSpy)
      })

      it('should call the synchronize method when synchronize sourceCodeFile', () => {
        return swBlock.synchronizeWith(sourceSwBlock)
          .then(() => {
            synchronizeSpy.callCount.should.equal(2)
            return Promise.resolve()
          })
      })

      it('should refresh the block version after synchronization', () => {
        swBlock.version.should.not.equal(sourceSwBlock.version)
        return swBlock.synchronizeWith(sourceSwBlock)
          .then(() => {
            swBlock.version.should.equal(sourceSwBlock.version)
            return Promise.resolve()
          })
      })

      it('should throw if there is no base path provided', () => {
        swBlock.options.basePath = undefined
        sourceSwBlock.addSourceCodeFile({
          name: 'thirdElement', path: 'apath/that/isLong/afile.js'
        })
        return swBlock.synchronizeWith(sourceSwBlock)
          .should.be.rejectedWith(/ERROR: there is no base path provided for the block fruitBasketBlock, so the new source code file thirdElement cannot be added\./)
      })

      it('should throw if there is no path provided on the source file', () => {
        swBlock.options.basePath = '/some/path'
        sourceSwBlock.addSourceCodeFile({
          name: 'thirdElement', path: undefined
        })
        return swBlock.synchronizeWith(sourceSwBlock)
          .should.be.rejectedWith(/ERROR: there is no path provided for the source file thirdElement on the block of name rootFruitBasketBlock and type basket. Please ammend that and try again\./)
      })

      it('should replace build the paths for the source file correctly', () => {
        swBlock.options.basePath = '/afolder/asecond/../adifferentpath'
        swBlock.options.cleanPath = '.clean-files'
        sourceSwBlock.addSourceCodeFile({
          name: 'thirdElement', path: 'abasepath/to/a/file.js'
        })
        return swBlock.synchronizeWith(sourceSwBlock)
          .then(() => {
            synchronizeSpy.callCount.should.equal(3)
            swBlock.sourceCodeFiles[2].should.eql(new SourceCodeFile('thirdElement', 'abasepath/to/a/file.js', options))
            return Promise.resolve()
          })
      })

      it('should throw if there are new files and there is no base path provided', () => {
        sourceSwBlock.addSourceCodeFile({
          name: 'thirdElement', path: 'apath/that/isLong/afile.js'
        })
        return swBlock.synchronizeWith(sourceSwBlock)
          .should.be.rejectedWith(/ERROR: there is no base path provided for the block fruitBasketBlock, so the new source code file thirdElement cannot be added./)
      })

      it('should throw if the root block is older than the destination', () => {
        sourceSwBlock.version = '0.0.0'
        return swBlock.synchronizeWith(sourceSwBlock)
          .should.be.rejectedWith(/The root block [a-zA-Z0-9\- .]* of type [a-zA-Z0-9\- .]* is older than the destination \([a-zA-Z0-9\- .]*\). Block synchronization aborted./)
      })
    })

    describe('.clean()', () => {
      let cleanToSpy

      beforeEach(() => {
        cleanToSpy = sinon.spy(() => Promise.resolve())
        SourceCodeFile.__Rewire__('cleanTo', cleanToSpy)
      })

      it('should provide the clean method', () => {
        return swBlock.clean()
          .then(() => {
            cleanToSpy.callCount.should.equal(2)
          })
      })
    })

    describe('.getMeta', () => {
      let getMetaSpy

      beforeEach(() => {
        getMetaSpy = sinon.spy(() => Promise.resolve(
          {
            replacements: {
              className: {
                regex: '/Banana/g',
                value: 'Banana'
              }
            },
            stamps: '/^(?!throwAway{1}).*$/'
          }
        ))
        SourceCodeFile.__Rewire__('getMeta', getMetaSpy)
        swBlock = new SwBlock(name, type, version)
        swBlock.addSourceCodeFiles([{ name: 'banana', path: 'banana.js' }, { name: 'banana2', path: 'banana2.js' }])
      })

      it('should allow to retrieve the meta information for all his block genes', () => {
        return swBlock.getMeta()
          .should.be.fulfilledWith({
            name,
            type,
            version,
            sourceCodeFiles: [
              {
                name: 'banana',
                path: 'banana.js',
                replacements: {
                  className: {
                    regex: '/Banana/g',
                    value: 'Banana'
                  }
                },
                stamps: '/^(?!throwAway{1}).*$/'
              },
              {
                name: 'banana2',
                path: 'banana2.js',
                replacements: {
                  className: {
                    regex: '/Banana/g',
                    value: 'Banana'
                  }
                },
                stamps: '/^(?!throwAway{1}).*$/'
              }
            ]
          })
      })
    })

    describe('.setMeta', () => {
      let setMetaSpy,
        firstSourceCodeFileJson,
        secondSourceCodeFileJson

      beforeEach(() => {
        setMetaSpy = sinon.spy(() => Promise.resolve())
        SourceCodeFile.__Rewire__('setMeta', setMetaSpy)
        firstSourceCodeFileJson = {
          name: 'banana',
          path: 'banana.js',
          replacements: {
            className: {
              regex: '/Banana/g',
              value: 'Banana'
            }
          },
          stamps: '/^(?!throwAway{1}).*$/'
        }

        secondSourceCodeFileJson = {
          name: 'banana',
          path: 'banana.js',
          replacements: {
            className: {
              regex: '/Orange/g',
              value: 'Orange'
            }
          },
          stamps: []
        }

        swBlock = new SwBlock(name, type, version)
        return swBlock.setMeta({
          sourceCodeFiles: [
            firstSourceCodeFileJson,
            secondSourceCodeFileJson
          ]
        })
      })

      it('should allow to set the meta for the first file', () => {
        sinon.assert.calledWith(setMetaSpy, firstSourceCodeFileJson.path, firstSourceCodeFileJson)
      })

      it('should allow to set the meta information for the second file', () => {
        sinon.assert.calledWith(setMetaSpy, secondSourceCodeFileJson.path, secondSourceCodeFileJson)
      })
    })
  })
})
