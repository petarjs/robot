import * as commandTypes from './command-types'

export default function Robot ({ name = 'Unknown', commands = [], initialPosition = 0, renderer }) {
  return {
    name,
    commands,
    renderer,
    oilMarks: [],
    position: initialPosition,
    initialPosition,
    currentCommand: commands[0],

    init () {
      this.renderer.init(this)
      this.renderer.draw()
    },
    destroy () {
      this.renderer.destroy()
    }
    setOilMarks (marks) {
      this.oilMarks = marks
    }
    executeNextCommand () {
      this.executeCommand(this.currentCommand)
      this.currentCommand = this.getNextCommand()
    },
    getNextCommand () {
      if (!this.currentCommand) {
        return null
      }

      if (this.currentCommand.type === commandTypes.GOTO) {
        return this.commands
          .find(c => c.type === 'label' && c.argument === this.currentCommand.argument)
      }

      const currentCommandIndex = this.commands.indexOf(this.currentCommand)
      const nextCommand = this.commands[currentCommandIndex + 1]

      if (!nextCommand) {
        return null
      }

      return nextCommand
    },
    getNextCommandSkip () {
      if (!this.currentCommand) {
        return null
      }

      const currentCommandIndex = this.commands.indexOf(this.currentCommand)
      const nextCommand = this.commands[currentCommandIndex + 2]

      if (!nextCommand) {
        return null
      }

      return nextCommand
    },
    executeCommand (command) {
      if (command) {
        this[command.type](command.argument)
        this.logCommand(command)
        this.renderer.draw()
      }
    },
    logCommand (command) {
      console.log(`${name} - ${command.type} - ${command.argument}`)
    },
    [commandTypes.GOTO] (arg) {},
    [commandTypes.LEFT] (arg) {
      this.position--
    },
    [commandTypes.RIGHT] (arg) {
      this.position++
    },
    [commandTypes.SKIP] (arg) {
      if (this.oilMarks.indexOf(this.position) !== -1) {
        console.log('Oil mark! Skipping next command')
        this.currentCommand = this.getNextCommandSkip()
      }
    },
    [commandTypes.LABEL] (arg) {}
  }
}