import UpdateSwBlock from '../source/lib/updateSwBlock.js'
import sinon from 'sinon'

describe('UpdateSwBlock', () => {
  let constructorSpy,
    synchronizeWithSpy,
    cleanSpy,
    addSourceCodeFilesSpy,
    updateSwBlock,
    name,
    type,
    options

  class SwBlock {
    constructor () {
      constructorSpy.apply(this, arguments)
    }

    synchronizeWith () {
      synchronizeWithSpy.apply(this, arguments)
    }

    clean () {
      cleanSpy.apply(this, arguments)
    }

    addSourceCodeFiles () {
      addSourceCodeFilesSpy.apply(this, arguments)
    }
  }

  beforeEach(
    () => {
      constructorSpy = sinon.spy()
      synchronizeWithSpy = sinon.spy()
      cleanSpy = sinon.spy()
      addSourceCodeFilesSpy = sinon.spy()
      name = 'aname'
      type = 'atype'
      options = {}
      UpdateSwBlock.__Rewire__('SwBlock', SwBlock)
      updateSwBlock = new UpdateSwBlock({ name, type, options})
    }
  )

  describe('constructor', () => {
    it('should build a sw block class', () => {
      constructorSpy.calledWith({ name, type, options}).should.be.true
    })
  })

  describe('.synchronizeWith(rootSwBlock)', () => {
    let rootSwBlock

    beforeEach(() => {
      name = 'anewname'
      type = 'anewtype'
      rootSwBlock = new UpdateSwBlock({ name, type, options})
      updateSwBlock.synchronizeWith(rootSwBlock)
    })

    describe('(given a source sw block structure and a target sw block structure)', () => {
      it('should call the swBlock synchronization method with the right arguments', () => {
        synchronizeWithSpy.calledWith({ name, type, options}).should.be.true
      })

      it('should build the root sw block accordingly', () => {
        constructorSpy.calledWith({ name, type, options}).should.be.true
      })

      it('should build the root sw block before calling synchronize', () => {
        sinon.assert.callOrder(constructorSpy, synchronizeWithSpy)
      })
    })
  })

  describe('.clean()', () => {
    beforeEach(() => {
      updateSwBlock.clean()
    })

    describe('(given a source sw component structure and a target sw component structure)', () => {
      it('should call the swBlock clean method with the right arguments', () => {
        cleanSpy.calledWith({ name, type, options}).should.be.true
      })
    })
  })
})
