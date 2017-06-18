import { isColiding } from './utils'

const COMMAND_EXECUTION_TIME = 300

export function execute (agents) {
  const oilMarks = agents.map(agent => agent.initialPosition)
  agents.forEach(agent => agent.setOilMarks(oilMarks))

  const interval = setInterval(function() {
    agents.forEach(agent => agent.executeNextCommand())

    const someAgentsHaveCommandsLeft = agents
      .reduce((acc, agent) => acc || agent.currentCommand, false)

    const areAgentsColiding = agents
      .reduce((acc, agent) => acc || isColiding(agent, agents), false)

    if (!someAgentsHaveCommandsLeft) {
      console.log('No more commands to execute for one or more agents. Stopping.')
      clearInterval(interval)
    }

    if (areAgentsColiding) {
      console.log('Agents are colliding! Success!')
      clearInterval(interval)
    }

  }, COMMAND_EXECUTION_TIME)
}