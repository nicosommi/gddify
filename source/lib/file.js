import _ from 'incognito'

export default class File {
  constructor (path, cleanFilePath) {
    _(this).path = path
    _(this).replacements = {}
    _(this).ignoredStamps = []
    _(this).cleanFilePath = cleanFilePath
  }

  get cleanFilePath () {
    return _(this).cleanFilePath
  }

  get path () {
    return _(this).path
  }

  get replacements () {
    return _(this).replacements
  }

  get ignoredStamps () {
    return _(this).ignoredStamps
  }

  replacing (replacements) {
    _(this).replacements = replacements
  }

  ignoringStamps (ignoredStamps) {
    _(this).ignoredStamps = ignoredStamps
  }
}
