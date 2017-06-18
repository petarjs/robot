import { getFirstWord } from './utils'
import * as commandTypes from './command-types'

const commands = {
  l: line => ({
    type: commandTypes.LEFT,
    argument: null
  }),
  r: line => ({
    type: commandTypes.RIGHT,
    argument: null
  }),
  s: line => ({
    type: commandTypes.SKIP,
    argument: null
  }),
  g: line => ({
    type: commandTypes.GOTO,
    argument: line.match(/^[g]\s+(.+)/)[1]
  }),
  label: line => ({
    type: commandTypes.LABEL,
    argument: line,
    original: line
  })
}

function parseCommand (line) {
  const command = getFirstWord(line)
  const commandTransformer = commands[command]

  if (commandTransformer) {
    return commandTransformer(line)
  } else {
    return commands['label'](line)
  }
}

export function parseCode (code) {
  try {
    return code
      .split('\n')
      .map(line => line.trim())
      .filter(line => Boolean(line))
      .map(line => line.toLowerCase())
      .map(line => parseCommand(line))
  } catch (ex) {
    alert('Syntax Error!')
    return null
  }
}