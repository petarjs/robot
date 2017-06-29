import { getRandomColor } from '../src/utils'

describe('getRadnomColor', () => {

  it('should get a random color', () => {
    const result = getRandomColor()
    expect(result).toMatch(/^#(?:[0-9a-fA-F]{3}){1,2}$/)
  })

})