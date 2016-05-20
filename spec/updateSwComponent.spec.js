import UpdateSwComponent from '../source/lib/updateSwComponent.js'
import sinon from 'sinon'
import path from 'path'

describe('UpdateSwComponent', () => {
  let constructorSpy,
    synchronizeWithSpy,
    cleanSpy,
    addSwBlocksSpy,
    addSwBlockSpy,
    getMetaSpy,
    updateSwComponent,
    name,
    type,
    swComponentJson,
    options

  class SwComponent {
    constructor () {
      this.options = arguments[2]
      constructorSpy.apply(this, arguments)
    }

    synchronizeWith () {
      return synchronizeWithSpy.apply(this, arguments)
    }

    getMeta () {
      return getMetaSpy.apply(this, arguments)
    }

    clean () {
      return cleanSpy.apply(this, arguments)
    }

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
    }
  )

  describe('constructor', () => {
    it('should build a sw component class', () => {
      constructorSpy.calledWith({
        name, type, options
      }).should.be.true
    })
  })

  describe('.synchronize(path[, name, type])', () => {
    beforeEach(() => {
      name = 'anewname'
      type = 'anewtype'
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
          basePath: `${__dirname}/../fixtures`,
          cleanPath: 'clean-path'
        },
        swBlocks: []
      }

      updateSwComponent = new UpdateSwComponent(swComponentJson)

      updateSwComponent.synchronizeWith = sinon.spy(() => Promise.resolve())

      return updateSwComponent.synchronize('./root')
    })

    it('should call synchronizeWith', () => {
      sinon.assert.callCount(updateSwComponent.synchronizeWith, 1)
    })
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
          sources: [{path: '1', name: blockName, type: blockType}, {path: '2', name: 'name2', type: 'type2'}]
        }
      }
      updateSwComponent = new UpdateSwComponent(swComponentJson)
      updateSwComponent.synchronize = sinon.spy(() => Promise.resolve())
      return updateSwComponent.update(blockName, blockType)
    })

    it('should call synchronizeWith for each source plus one because of the refresh', () => {
      sinon.assert.callCount(updateSwComponent.synchronize, 3)
    })

    it('should call synchronizeWith for each source plus one because of the refresh', () => {
      sinon.assert.calledWith(updateSwComponent.synchronize, '1', 'blockName', 'blockType')
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

    it('should call synchronizeWith just once', () => {
      sinon.assert.callCount(updateSwComponent.synchronize, 1)
    })
  })

  describe('jsonification', () => {
    let writeJsonSpy,
      jsObject,
      destination,
      source

    beforeEach(() => {
      destination = `${__dirname}/../fixtures/adestination.json`
      source = `${__dirname}/../fixtures/jsonLikeJs.js`
      jsObject = require(source)
      writeJsonSpy = sinon.spy()
      UpdateSwComponent.__Rewire__('writeJson', writeJsonSpy)

      updateSwComponent = new UpdateSwComponent(swComponentJson)
      return updateSwComponent.jsonification(source, destination)
    })

    it('should take a js object form a file and put a json into the destination', () => {
      sinon.assert.calledWith(writeJsonSpy, destination, jsObject, { spaces: 2 })
    })
  })

  describe('increment', () => {
    let writeJsonSpy,
      expectedJson

    beforeEach(() => {
      writeJsonSpy = sinon.spy(() => Promise.resolve())
      UpdateSwComponent.__Rewire__('writeJson', writeJsonSpy)

      addSwBlocksSpy = sinon.spy(
        function addSwBlocksSpyMethod () {
          this.swBlocks = [
            { name: 'blockname', type: 'type4', version: '0.0.0', sourceCodeFiles: [] }
          ]
        }
      )

      swComponentJson = {
        options: {
          basePath: `${__dirname}/../fixtures/testSource`
        },
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
          options: {
            basePath: `${__dirname}/../fixtures/testSource`
          },
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
        sinon.assert.calledWith(writeJsonSpy, path.normalize(`${__dirname}/../fixtures/testSource/swComponent.json`), expectedJson, { spaces: 2 })
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

  describe('.synchronizeWith(path, root)', () => {
    let rootSwComponentJson

    beforeEach(() => {
      name = 'anewname'
      type = 'anewtype'
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
      rootSwComponentJson = {
        name,
        type,
        swBlocks: []
      }

      swComponentJson = {
        name,
        type,
        swBlocks: []
      }

      return updateSwComponent.synchronizeWith('fromhere', rootSwComponentJson)
    })

    describe('(given a source sw component structure and a target sw component structure)', () => {
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
