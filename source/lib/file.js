import _ from 'incognito'

export default class File {
  constructor (path, cleanFilePath) {
    _(this).path = path
    _(this).replacements = {}
    _(this).stamps = ''
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

  get stamps () {
    return _(this).stamps
  }

  replacing (replacements) {
    _(this).replacements = replacements
  }

  setStamps (stamps) {
    _(this).stamps = stamps
  }
}
