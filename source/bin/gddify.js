#! /usr/bin/env node
/* eslint-disable no-console */
import { argv } from 'yargs'
import Liftoff from 'liftoff'
import UpdateSwComponent from '../lib/updateSwComponent.js'
import path from 'path'
import chalk from 'chalk'
import fs from 'fs-extra'
import Promise from '../lib/promise.js'

const debug = require('debug')('nicosommi.gddify.cli')
const stat = Promise.promisify(fs.stat)
const outputJson = Promise.promisify(fs.outputJson)

const Gddify = new Liftoff({
  cwd: argv.cwd,
  processTitle: 'gddify',
  moduleName: 'gddify',
  configName: 'swComponent.json'
})

Gddify.launch({}, invoke)

export default function invoke (env) {
  // console.log("invoke reached", { env, argv, path: `${argv.cwd}/${argv.from}/swComponent.json` })
  let command
  if (argv._.length > 0) {
    command = argv._[0]
  } else {
    command = 'help'
  }

  const cwd = require('process').cwd()

  const targetSwComponentPath = path.normalize(`${cwd}/swComponent.json`)
  const initialData = { name: 'default', type: 'default', options: { sources: [], basePath: env.cwd, cleanPath: `.gdd-clean` }, swBlocks: [] }

  console.log(chalk.magenta('Command execution begins...'))

  return stat(targetSwComponentPath)
    .catch(() => outputJson(targetSwComponentPath, initialData))
    .then(() => {
      debug('Target file ensured...')
      const targetSwComponentJson = require(targetSwComponentPath)
      // machine switch or folder change is possible
      if (!targetSwComponentJson.options) {
        targetSwComponentJson.options = {}
      }
      targetSwComponentJson.options.basePath = cwd
      const updateSwComponent = new UpdateSwComponent(targetSwComponentJson)

      let commandPromise = Promise.resolve();

      switch (command) {
        case 'replicate':
          commandPromise = updateSwComponent.replicate(argv.name, argv.type, argv['target-name'], argv['path-pattern'], argv['path-value'])
          break
        case 'generate':
          commandPromise = updateSwComponent.synchronize(argv.from, argv.name, argv.type, argv['target-name'])
          break
        case 'update':
          commandPromise = updateSwComponent.update(argv.name, argv.type)
          break
        case 'refresh':
          commandPromise = updateSwComponent.refresh(argv.name, argv.type)
          break
        case 'compile':
          commandPromise = updateSwComponent.clean([ 'gddifyph' ])
          break
        case 'add':
          commandPromise = updateSwComponent.add(argv.glob, argv.name, argv.type)
          break
        case 'addfile':
          commandPromise = updateSwComponent.addFile(argv.path, argv.name, argv.type)
          break
        case 'increment':
          commandPromise = updateSwComponent.increment(argv.release, argv.name, argv.type)
          break
        case 'jsonification':
          commandPromise = updateSwComponent.jsonification(path.normalize(`${env.cwd}/${argv.from}`), path.normalize(`${env.cwd}/${argv.to}`))
          break
        default:
          console.log(chalk.yellow('Invalid command.\nUse gddify [replicate|generate|update|compile|refresh|add|addfile].'))
      }

      return commandPromise.then(
        () => {
          console.log(chalk.magenta('Done.'))
        }
      );
    })
}
