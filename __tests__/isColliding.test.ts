import { isColiding } from '../src/utils'

describe('isColliding', () => {
  it('should detect that agents are colliding', () => {
    const agents = [{
      position: 2
    }, {
      position: 2
    }]

    const result = Boolean(isColiding(agents[0], agents))

    expect(result).toBe(true)
  })

  it('should detect that agents are NOT colliding', () => {
    const agents = [{
      position: 2
    }, {
      position: 3
    }]

    const result = Boolean(isColiding(agents[0], agents))

    expect(result).toBe(false)
  })

  it('should detect multiple agents colliding', () => {
    const agents = [{
      position: 2
    }, {
      position: 2
    }, {
      position: 3
    }, {
      position: 2
    }, {
      position: 5
    }]

    const result = Boolean(isColiding(agents[0], agents))

    expect(result).toBe(true)
  })

  it('should detect multiple agents NOT colliding', () => {
    const agents = [{
      position: 2
    }, {
      position: 11
    }, {
      position: 3
    }, {
      position: 22
    }, {
      position: 50
    }]

    const result = Boolean(isColiding(agents[0], agents))

    expect(result).toBe(false)
  })
})