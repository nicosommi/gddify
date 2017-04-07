import invoke from '../../source/bin/gddify.js'
import sinon from 'sinon'

describe('gddify', () => {
  let env,
    argv,
    synchronizeSpy,
    updateSpy,
    refreshSpy,
    addFileSpy,
    addSpy,
    cleanSpy,
    jsonificationSpy,
    incrementSpy,
    replicateSpy

  class UpdateSwComponent {
    synchronize () {
      return synchronizeSpy.apply(this, arguments)
    }

    update () {
      return updateSpy.apply(this, arguments)
    }

    refresh () {
      return refreshSpy.apply(this, arguments)
    }

    jsonification () {
      return jsonificationSpy.apply(this, arguments)
    }

    addFile () {
      return addFileSpy.apply(this, arguments)
    }

    add () {
      return addSpy.apply(this, arguments)
    }

    clean () {
      return cleanSpy.apply(this, arguments)
    }

    increment () {
      return incrementSpy.apply(this, arguments)
    }

    replicate () {
      return replicateSpy.apply(this, arguments)
    }
  }

  beforeEach(() => {
    const returnPromise = () => Promise.resolve()
    synchronizeSpy = sinon.spy(returnPromise)
    updateSpy = sinon.spy(returnPromise)
    refreshSpy = sinon.spy(returnPromise)
    addFileSpy = sinon.spy(returnPromise)
    addSpy = sinon.spy(returnPromise)
    cleanSpy = sinon.spy(returnPromise)
    jsonificationSpy = sinon.spy(returnPromise)
    incrementSpy = sinon.spy(returnPromise)
    replicateSpy = sinon.spy(returnPromise)

    argv = {}
    env = {
      cwd: `${__dirname}/../../fixtures/testSource`
    }

    invoke.__Rewire__('UpdateSwComponent', UpdateSwComponent)
  })

  describe('(commands)', () => {
    describe('replicate', () => {
      beforeEach(() => {
        argv = {
          _: ['replicate'],
          'name': 'blockName',
          'type': 'blockType',
          'target-name': 'newBlockName',
          'path-pattern': '/afilepath/',
          'path-value': 'anewfilepath'
        }
        invoke.__Rewire__('argv', argv)
        return invoke(env)
      })

      it('should call replicate block with the right parameters', () => {
        replicateSpy.getCall(0).args.should.deepEqual([argv.name, argv.type, argv['target-name'], argv['path-pattern'], argv['path-value']]);
      })
    })

    describe('generate', () => {
      beforeEach(() => {
        argv = {
          _: ['generate']
        }
        invoke.__Rewire__('argv', argv)
        return invoke(env)
      })

      it('should call synchronize', () => {
        sinon.assert.callCount(synchronizeSpy, 1)
      })
    })

    describe('update', () => {
      beforeEach(() => {
        argv = {
          _: ['update']
        }
        invoke.__Rewire__('argv', argv)
        return invoke(env)
      })

      it('should call update', () => {
        sinon.assert.callCount(updateSpy, 1)
      })
    })

    describe('refresh', () => {
      beforeEach(() => {
        argv = {
          _: ['refresh']
        }
        invoke.__Rewire__('argv', argv)
        return invoke(env)
      })

      it('should call refresh', () => {
        sinon.assert.callCount(refreshSpy, 1)
      })
    })

    describe('jsonification', () => {
      beforeEach(() => {
        argv = {
          _: ['jsonification']
        }
        invoke.__Rewire__('argv', argv)
        return invoke(env)
      })

      it('should call addFile', () => {
        sinon.assert.callCount(jsonificationSpy, 1)
      })
    })

    describe('addFile', () => {
      beforeEach(() => {
        argv = {
          _: ['addfile']
        }
        invoke.__Rewire__('argv', argv)
        return invoke(env)
      })

      it('should call addFile', () => {
        sinon.assert.callCount(addFileSpy, 1)
      })
    })

    describe('add', () => {
      beforeEach(() => {
        argv = {
          _: ['add']
        }
        invoke.__Rewire__('argv', argv)
        return invoke(env)
      })

      it('should call add', () => {
        sinon.assert.callCount(addSpy, 1)
      })
    })

    describe('compile', () => {
      beforeEach(() => {
        argv = {
          _: ['compile']
        }
        invoke.__Rewire__('argv', argv)
        return invoke(env)
      })

      it('should call clean', () => {
        sinon.assert.callCount(cleanSpy, 1)
      })
    })

    describe('help', () => {
      let chalk

      beforeEach(() => {
        argv = {
          _: []
        }
        chalk = {
          magenta: sinon.spy(),
          yellow: sinon.spy()
        }
        invoke.__Rewire__('argv', argv)
        invoke.__Rewire__('chalk', chalk)
        return invoke(env)
      })

      it('should output correctly as default', () => {
        chalk.yellow.firstCall.args[0].should.eql('Invalid command.\nUse gddify [replicate|generate|update|compile|refresh|add|addfile].')
      })
    })

    describe('increment', () => {
      beforeEach(() => {
        argv = {
          _: ['increment'],
          'release': 'patch',
          'name': 'blockName',
          'type': 'blockType'
        }

        invoke.__Rewire__('argv', argv)
        return invoke(env)
      })

      it('should call the increment', () => {
        sinon.assert.calledWith(incrementSpy, 'patch', 'blockName', 'blockType')
      })
    })
  })
})
