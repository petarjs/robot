import { parseCode } from './parser'
import Robot from './robot'
import { execute } from './interpreter'
import RobotRenderer from './renderer'

const code = `

loop
l
s
g loop

loop2
l
g loop2


`

const codeExample = `

loop
l
l
s
r
r
s
g loop

`

let robots = []

document.querySelector('.js-code').value = codeExample

document.querySelector('.js-stop').addEventListener('click', function () {
  if (robots.length) {
    robots.forEach(robot => robot.destroy())
  }
})

document.querySelector('.js-execute').addEventListener('click', function () {
  const code = document.querySelector('.js-code').value
  const commands = parseCode(code)

  if (!commands) {
    return
  }
  
  if (robots.length) {
    robots.forEach(robot => robot.destroy())
  }

  robots = [
    Robot({
      name: 'Robot 1',
      commands: commands,
      initialPosition: -2,
      renderer: RobotRenderer()
    }),
    Robot({
      name: 'Robot 2',
      commands,
      initialPosition: 1,
      renderer: RobotRenderer()
    })
  ]

  robots.forEach(robot => robot.init())

  execute(robots)
})
