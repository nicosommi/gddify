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
    jsonificationSpy

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
  }

  beforeEach(() => {
    synchronizeSpy = sinon.spy()
    updateSpy = sinon.spy()
    refreshSpy = sinon.spy()
    addFileSpy = sinon.spy()
    addSpy = sinon.spy()
    cleanSpy = sinon.spy()
    jsonificationSpy = sinon.spy()

    argv = {}
    env = {
      cwd: `${__dirname}/../../fixtures/testSource`
    }

    invoke.__Rewire__('UpdateSwComponent', UpdateSwComponent)
  })

  describe('(commands)', () => {
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
        sinon.assert.calledWith(chalk.yellow, 'Invalid command. Use gddify [generate|update|compile|refresh|add|addfile].')
      })
    })
  })
})
