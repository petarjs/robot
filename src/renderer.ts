import { getRandomColor } from './utils'

export default function RobotRenderer () {
  return {
    init (ctx) {
      this.ctx = ctx
      this.el = document.createElement('div')
      this.el.classList.add('robot')
      this.el.style.background = getRandomColor()
      document.querySelector('.container').appendChild(this.el)

      this.oil = document.createElement('div')
      this.oil.classList.add('oil')
      document.querySelector('.container').appendChild(this.oil)
      this.oil.style.transform = 'translateX(' + this.ctx.position * 50 + 'px)'
    },
    destroy () {
      this.el.remove()
      this.oil.remove()
    },
    draw () {
      this.el.style.transform = 'translateX(' + this.ctx.position * 50 + 'px)'
    }
  }
}