import UpdateSwComponent from '../source/lib/updateSwComponent.js'
import sinon from 'sinon'
import path from 'path'
import Promise from '../source/lib/promise.js'

describe('UpdateSwComponent', () => {
  let constructorSpy,
    synchronizeWithSpy,
    cleanSpy,
    addSwBlocksSpy,
    addSwBlockSpy,
    getMetaSpy,
    setMetaSpy,
    updateSwComponent,
    name,
    type,
    swComponentJson,
    options,
    writeJsonSpy

  class SwComponent {
    constructor () {
      this.options = arguments[2]
      constructorSpy.apply(this, arguments)
    }

    toJSON() {
      return this
    }

    synchronizeWith () {
      return synchronizeWithSpy.apply(this, arguments)
    }

    getMeta () {
      return getMetaSpy.apply(this, arguments)
    }

    setMeta () {
      return setMetaSpy.apply(this, arguments)
    }

    clean () {
      return cleanSpy.apply(this, arguments)
    }

    // FIXME: improve testing -> do not mock unnecesary things like addSwBlock, it changes the behavior

    addSwBlocks () {
      return addSwBlocksSpy.apply(this, arguments)
    }

    addSwBlock () {
      return addSwBlockSpy.apply(this, arguments)
    }
  }

  beforeEach(
    () => {
      constructorSpy = sinon.spy(() => Promise.resolve())
      synchronizeWithSpy = sinon.spy(() => Promise.resolve())
      cleanSpy = sinon.spy(() => Promise.resolve())
      getMetaSpy = sinon.spy(() => Promise.resolve())
      setMetaSpy = sinon.spy(() => Promise.resolve())
      addSwBlockSpy = sinon.spy(() => Promise.resolve())
      addSwBlocksSpy = sinon.spy(
        function addSwBlocksSpyMethod () {
          this.swBlocks = [
            { name: 'blockname', type: 'type1', version: '0.0.1' },
            { name: 'blockname', type: 'type2', version: '0.0.1' },
            { name: 'blockname', type: 'type2', version: '0.0.1' },
            { name: 'blockname', type: 'type3', version: '0.0.1' },
            { name: 'blockname', type: 'type4', version: '0.0.1' }
          ]
        }
      )
      name = 'aname'
      type = 'atype'
      options = {}
      swComponentJson = {
        name,
        type,
        options: {
          basePath: '/abase/path',
          cleanPath: 'clean-path'
        },
        swBlocks: []
      }
      UpdateSwComponent.__Rewire__('SwComponent', SwComponent)
      updateSwComponent = new UpdateSwComponent(swComponentJson)
      
      writeJsonSpy = sinon.spy(() => Promise.resolve())
      UpdateSwComponent.__Rewire__('writeJson', writeJsonSpy)
    }
  )

  describe('constructor', () => {
    it('should build a sw component class', () => {
      constructorSpy.calledWith({
        name, type, options
      }).should.be.true
    })
  })

  describe('.synchronize(path[, name, type, options])', () => {
    let options;
    let source;
    let targetName;

    beforeEach(() => {
      name = 'anewname'
      type = 'anewtype'
      targetName = 'targetNAme'
      source = `./fixtures/root`
      addSwBlocksSpy = sinon.spy(
        function addSwBlocksSpyMethod () {
          this.swBlocks = [
            { name: 'blockname', type: 'type4', version: '0.0.2' },
            { name: 'blockname', type: 'type1', version: '0.0.1' },
            { name: 'blockname', type: 'type2', version: '0.0.1' },
            { name: 'blockname', type: 'type3', version: '0.0.1' },
            { name: 'blockname', type: 'type3', version: '0.2.1' },
            { name: 'blockname', type: 'type4', version: '0.0.1' }
          ]
        }
      )

      swComponentJson = {
        name,
        type,
        options: {
          cleanPath: 'clean-path'
        },
        swBlocks: []
      }

      updateSwComponent = new UpdateSwComponent(swComponentJson)

      updateSwComponent.synchronizeWith = sinon.spy(() => Promise.resolve())

      options = {}

      return updateSwComponent.synchronize(source, name, type, targetName, options)
    })

    it('should call synchronizeWith', () => {
      sinon.assert.calledWith(
        updateSwComponent.synchronizeWith,
        source,
        require(`${__dirname}/../fixtures/root/swComponent.json`),
        targetName,
        name,
        type,
        options
      )
    })
  })

  describe('.replicate', () => {
    let blockName,
      blockType,
      targetName

    beforeEach(function beforeEachBody() {
      blockName = 'blockName'
      blockType = 'blockType'
      targetName = 'targetName'
      addSwBlockSpy = sinon.spy(() => Promise.resolve())
      addSwBlocksSpy = sinon.spy(
        function addSwBlocksSpyMethod () {
          this.swBlocks = [
            {
              name: blockName, type: blockType, version: '0.0.1', options: {},
              sourceCodeFiles: [
                {
                  name: 'afilepath.js',
                  path: `${blockName}/afilepath.js`
                }
              ]
            },
            {
              name: 'anotherblock', type: 'anothertype', version: '0.0.2', options: {},
              sourceCodeFiles: [
                {
                  name: 'anotherblock/file.js',
                  path: 'anotherblock/file.js'
                }
              ]
            }
          ]
        }
      )

      this.swComponentJson = {
        name,
        type,
        options: {}
      }

      this.updateSwComponent = new UpdateSwComponent(this.swComponentJson)
      // this.updateSwComponent.synchronize = sinon.spy(() => Promise.resolve())
      return this.updateSwComponent.replicate(blockName, blockType, targetName)
    })

    it('should create a new block with the appropiate values', function testBody() {
      const expected = {
        name: targetName, type: blockType, version: '0.0.1', options: {},
        sourceCodeFiles: [
          {
            name: 'afilepath.js',
            path: `${targetName}/afilepath.js`
          }
        ]
      }
      const actual = this.updateSwComponent.targetSwComponent
      sinon.assert.calledWith(addSwBlockSpy, expected)
    })

    it.skip('should generate the proper files for that new block')
  })

  describe('.update', () => {
    let blockName,
      blockType

    beforeEach(() => {
      blockName = 'blockName'
      blockType = 'blockType'
      swComponentJson = {
        name,
        type,
        options: {
          basePath: `${__dirname}/../fixtures/testSource`,
          sources: [
            {path: '1', name: blockName, type: blockType},
            {path: '2', name: 'name2', type: 'type2'}
          ]
        }
      }
      updateSwComponent = new UpdateSwComponent(swComponentJson)
      updateSwComponent.synchronize = sinon.spy(() => Promise.resolve())
      return updateSwComponent.update(blockName, blockType)
    })

    it('should call synchronize for each source plus one because of the refresh', () => {
      sinon.assert.callCount(updateSwComponent.synchronize, 3)
    })

    it('should call synchronize with the appropiate parameters', () => {
      sinon.assert.calledWith(updateSwComponent.synchronize, '1', '1', 'blockName', 'blockType', { generate: false })
    })
  })

  describe('.refresh', () => {
    let blockName,
      blockType

    beforeEach(() => {
      blockName = 'blockName'
      blockType = 'blockType'
      swComponentJson = {
        name,
        type,
        options: {
          basePath: `${__dirname}/../fixtures/testSource`,
          sources: ['1', '2']
        }
      }
      updateSwComponent = new UpdateSwComponent(swComponentJson)
      updateSwComponent.synchronize = sinon.spy(() => Promise.resolve())
      return updateSwComponent.refresh(blockName, blockType)
    })

    it('should call synchronize just once', () => {
      sinon.assert.callCount(updateSwComponent.synchronize, 1)
    })
  })

  describe('jsonification', () => {
    describe('(use case: js to json)', () => {
      let readFileSpy,
        jsObject,
        destination,
        source

      beforeEach(() => {
        destination = `${__dirname}/../fixtures/adestination.json`
        source = `${__dirname}/../fixtures/jsonLikeJs.js`
        jsObject = require(source)

        updateSwComponent = new UpdateSwComponent(swComponentJson)
        return updateSwComponent.jsonification(source, destination)
      })

      it('should take a js object form a file and put a json into the destination', () => {
        sinon.assert.calledWithExactly(writeJsonSpy, destination, jsObject, { spaces: 2 })
      })
    })

    describe('(use case: merge)', () => {
      let jsObject,
        destination,
        source,
        expectation

      beforeEach(() => {
        destination = `${__dirname}/../fixtures/adestinationWithData.json`
        source = `${__dirname}/../fixtures/jsonLikeJs.js`
        jsObject = require(source)

        expectation = require(destination)

        Object.assign(expectation, jsObject)

        updateSwComponent = new UpdateSwComponent(swComponentJson)
        return updateSwComponent.jsonification(source, destination, true)
      })

      it('should allow to preserve current additional data that already on the target', () => {
        sinon.assert.calledWith(writeJsonSpy, destination, expectation, { spaces: 2 })
      })
    })
  })

  describe('move', () => {
    let moveSpy,
      destination,
      source

    beforeEach(() => {
      destination = `../fixtures/afiledestination.json`
      source = `../fixtures/afile.js`
      moveSpy = sinon.spy()
      UpdateSwComponent.__Rewire__('move', moveSpy)

      const block = {
        options: {
          move: [
            {
              target: 'afile',
              to: destination
            }
          ]
        },
        sourceCodeFiles: [
          {
            name: 'afile',
            path: source
          }
        ]
      }

      updateSwComponent = new UpdateSwComponent(swComponentJson)
      return updateSwComponent.move(block)
    })

    it('should take a file and move it into the destination', () => {
      const cwd = process.cwd()
      sinon.assert.calledWith(moveSpy, `${cwd}/${source}`, `${cwd}/${destination}`, { clobber: true })
    })
  })

  describe('copy', () => {
    let copySpy,
      destination,
      source

    beforeEach(() => {
      destination = `../fixtures/afiledestination.json`
      source = `../fixtures/afile.js`
      copySpy = sinon.spy()
      UpdateSwComponent.__Rewire__('copy', copySpy)

      const block = {
        options: {
          copy: [
            {
              target: 'afile',
              to: destination
            }
          ]
        },
        sourceCodeFiles: [
          {
            name: 'afile',
            path: source
          }
        ]
      }

      updateSwComponent = new UpdateSwComponent(swComponentJson)
      return updateSwComponent.copy(block)
    })

    it('should take a file and move it into the destination', () => {
      const cwd = process.cwd()
      sinon.assert.calledWith(copySpy, `${cwd}/${source}`, `${cwd}/${destination}`, { clobber: true })
    })
  })

  describe('increment', () => {
    let expectedJson

    beforeEach(() => {
      addSwBlocksSpy = sinon.spy(
        function addSwBlocksSpyMethod () {
          this.swBlocks = [
            { name: 'blockname', type: 'type4', version: '0.0.0', sourceCodeFiles: [] }
          ]
        }
      )

      swComponentJson = {
        options: {},
        swBlocks: [
          {
            name: 'blockname',
            type: 'type4',
            version: '0.0.0',
            sourceCodeFiles: []
          }
        ]
      }

      UpdateSwComponent.__Rewire__('SwComponent', SwComponent)

      updateSwComponent = new UpdateSwComponent(swComponentJson)
    })

    describe('patch', () => {
      beforeEach(() => {
        expectedJson = {
          options: {},
          swBlocks: [
            {
              name: 'blockname',
              type: 'type4',
              version: '0.0.1',
              sourceCodeFiles: []
            }
          ]
        }
        return updateSwComponent.increment('patch', 'blockname', 'type4')
      })
      it('should increase the patch version number', () => {
        sinon.assert.calledWith(writeJsonSpy, path.normalize(`${process.cwd()}/swComponent.json`), expectedJson, { spaces: 2 })
      })
    })
  })

  describe('.add and .addFile', () => {
    let addSourceCodeFileSpy,
      blockName,
      blockType

    beforeEach(() => {
      blockName = 'blockName'
      blockType = 'blockType'

      name = 'anewname'
      type = 'anewtype'

      swComponentJson = {
        name,
        type,
        options: {}
      }

      UpdateSwComponent.__Rewire__('writeJson', sinon.spy(() => Promise.resolve()))

      updateSwComponent = new UpdateSwComponent(swComponentJson)
    })

    describe('(when the block exists)', () => {
      beforeEach(() => {
        addSourceCodeFileSpy = sinon.spy()
        updateSwComponent.targetSwComponent.swBlocks = [{
          name: blockName,
          type: blockType,
          addSourceCodeFile: addSourceCodeFileSpy,
          sourceCodeFiles: [{
            path: `${__dirname}/../fixtures/testSource/example.js`
          }]
        }]
      })

      describe('(when file does not exists in block)', () => {
        describe('.addFile', () => {
          beforeEach(() => {
            updateSwComponent.targetSwComponent.swBlocks[0].sourceCodeFiles = []
            return updateSwComponent.addFile(`${__dirname}/../fixtures/testSource/example.js`, blockName, blockType)
          })

          it('should call addSourceCodeFile', () => {
            sinon.assert.callCount(addSourceCodeFileSpy, 1)
          })

          it('should not add the block', () => {
            sinon.assert.callCount(addSwBlockSpy, 0)
          })
        })

        describe('.add', () => {
          beforeEach(() => {
            updateSwComponent.targetSwComponent.swBlocks[0].sourceCodeFiles = []
            return updateSwComponent.add(`${__dirname}/../fixtures/testSource/*.js`, blockName, blockType)
          })

          it('should call addSourceCodeFile', () => {
            sinon.assert.callCount(addSourceCodeFileSpy, 1)
          })

          it('should not add the block', () => {
            sinon.assert.callCount(addSwBlockSpy, 0)
          })
        })
      })

      describe('(when file exists in block)', () => {
        beforeEach(() => {
          return updateSwComponent.addFile(`${__dirname}/../fixtures/testSource/example.js`, blockName, blockType)
        })

        it('should call not addSourceCodeFile if it already exists', () => {
          sinon.assert.callCount(addSourceCodeFileSpy, 0)
        })
      })
    })

    describe('(when the block does not exists)', () => {
      let newBlock

      beforeEach(() => {
        addSourceCodeFileSpy = sinon.spy()
        newBlock = {
          addSourceCodeFile: addSourceCodeFileSpy
        }
        addSwBlockSpy = sinon.spy(() => Promise.resolve(newBlock))
        updateSwComponent = new UpdateSwComponent(swComponentJson)
        updateSwComponent.targetSwComponent.swBlocks = [{
          sourceCodeFiles: []
        }]

        return updateSwComponent.addFile(`${__dirname}/../fixtures/testSource/example.js`, blockName, blockType)
      })

      it('should not call addSourceCodeFile because is built right there', () => {
        sinon.assert.callCount(addSourceCodeFileSpy, 0)
      })

      it('should add the block', () => {
        sinon.assert.callCount(addSwBlockSpy, 1)
      })
    })
  })

  describe('.synchronizeWith(path, root, targetName, name, type, options)', () => {
    describe('(with default options)', () => {
      let rootSwComponentJson,
        metaObject,
        blocks

      beforeEach(() => {
        blocks = [{ name: 'blockname', type: 'type4', version: '0.0.2' },
        { name: 'blockname', type: 'type1', version: '0.0.1' },
        { name: 'blockname', type: 'type2', version: '0.0.1' },
        { name: 'blockname', type: 'type3', version: '0.0.1' },
        { name: 'blockname', type: 'type3', version: '0.2.1' },
        { name: 'blockname', type: 'type4', version: '0.0.1' }]
        name = 'anewname'
        type = 'anewtype'
        addSwBlocksSpy = sinon.spy(
          function addSwBlocksSpyMethod () {
            this.swBlocks = blocks
          }
        )
        rootSwComponentJson = {
          name,
          type,
          swBlocks: []
        }

        metaObject = { name: 'example' }

        getMetaSpy = sinon.spy(() => Promise.resolve(metaObject))
        setMetaSpy = sinon.spy(() => Promise.resolve())

        updateSwComponent.targetSwComponent.swBlocks = []

        return updateSwComponent.synchronizeWith('fromhere', rootSwComponentJson)
      })

      it('should generate all blocks from the origin, and not just one per type', () => {
        sinon.assert.callCount(addSwBlockSpy, 6)
      })

      it('should call the setMeta on the target with the getMeta from the root', () => {
        sinon.assert.calledWith(setMetaSpy, metaObject)
      })

      it('should call the swBlock synchronization method with the right arguments', () => {
        sinon.assert.calledWith(synchronizeWithSpy, { name: 'blockname', type: 'type3', version: '0.2.1' })
      })

      it('should call the swBlock synchronization method with the right arguments', () => {
        sinon.assert.neverCalledWith(synchronizeWithSpy, { name: 'blockname', type: 'type3', version: '0.0.1' })
      })

      it('should call the swBlock synchronization method with the right arguments', () => {
        synchronizeWithSpy.callCount.should.equal(4)
      })

      it('should build the root sw component accordingly', () => {
        constructorSpy.calledWith({
          name, type, options
        }).should.be.true
      })

      it('should build the root sw component before calling synchronize', () => {
        sinon.assert.callOrder(constructorSpy, constructorSpy, addSwBlocksSpy, synchronizeWithSpy)
      })
    })

    describe('(with generation false)', () => {
      let rootSwComponentJson,
        metaObject,
        blocks,
        options

      beforeEach(() => {
        blocks = [
          { name: 'blockname', type: 'type4', version: '0.0.2' },
          { name: 'blockname', type: 'type1', version: '0.0.1' },
          { name: 'blockname', type: 'type3', version: '0.2.1' },
          { name: 'blockname', type: 'type3', version: '0.2.1' }
        ]
        name = 'anewname'
        type = 'anewtype'
        addSwBlocksSpy = sinon.spy(
          function addSwBlocksSpyMethod () {
            this.swBlocks = blocks
          }
        )
        rootSwComponentJson = {
          name,
          type,
          swBlocks: [
            { name: 'blockname', type: 'type3', version: '0.2.1' }
          ]
        }

        metaObject = { name: 'example' }

        getMetaSpy = sinon.spy(() => Promise.resolve(metaObject))
        setMetaSpy = sinon.spy(() => Promise.resolve())

        updateSwComponent.targetSwComponent.swBlocks = []

        options = {
          generate: false
        }

        return updateSwComponent.synchronizeWith('fromhere', rootSwComponentJson, undefined, undefined, options)
      })

      it('should not add blocks on the target', () => {
        sinon.assert.callCount(addSwBlockSpy, 0)
      })
    })
  })

  describe('.clean()', () => {
    beforeEach(() => {
      updateSwComponent.clean()
    })

    describe('(given a source sw component structure and a target sw component structure)', () => {
      it('should call the swBlock clean method with the right arguments', () => {
        cleanSpy.calledWith({
          name, type, options
        }).should.be.true
      })
    })
  })
})
