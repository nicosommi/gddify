#! /usr/bin/env node
/* eslint-disable no-console */
import { argv } from 'yargs'
import Liftoff from 'liftoff'
import UpdateSwComponent from '../lib/updateSwComponent.js'
import path from 'path'
import chalk from 'chalk'
import fs from 'fs-extra'
import Promise from '../lib/promise.js'

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

  const targetSwComponentPath = path.normalize(`${env.cwd}/swComponent.json`)
  const initialData = { name: 'default', type: 'default', options: { sources: [], basePath: env.cwd, cleanPath: `.gdd-clean` }, swBlocks: [] }

  console.log(chalk.magenta('Command execution begins...'))

  return stat(targetSwComponentPath)
    .catch(() => outputJson(targetSwComponentPath, initialData))
    .then(() => {
      console.log(chalk.magenta('Target file ensured...'))
      const targetSwComponentJson = require(targetSwComponentPath)
      // machine switch or folder change is possible
      targetSwComponentJson.options.basePath = env.cwd
      const updateSwComponent = new UpdateSwComponent(targetSwComponentJson)

      switch (command) {
        case 'generate':
          return updateSwComponent.synchronize(argv.from, argv.name, argv.type)
        case 'update':
          return updateSwComponent.update(argv.name, argv.type)
        case 'refresh':
          return updateSwComponent.refresh(argv.name, argv.type)
        case 'compile':
          return updateSwComponent.clean([ 'gddifyph' ])
        case 'add':
          return updateSwComponent.add(argv.glob, argv.name, argv.type)
        case 'addfile':
          return updateSwComponent.addFile(argv.path, argv.name, argv.type)
        case 'jsonification':
        console.log('paackage is ', {is: path.normalize(`${env.cwd}/${argv.from}`)})
          return updateSwComponent.jsonification(path.normalize(`${env.cwd}/${argv.from}`), path.normalize(`${env.cwd}/${argv.to}`))
        default:
          console.log(chalk.yellow('Invalid command. Use gddify [generate|update|compile|refresh|add|addfile].'))
      }
    })
}
