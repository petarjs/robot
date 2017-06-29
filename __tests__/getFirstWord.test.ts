import { getFirstWord } from '../src/utils'

describe('getFirstWord', () => {

  it('should get the first word', () => {
    const sentence = 'Coffee is cool'
    const result = getFirstWord(sentence)
    expect(result).toBe('Coffee')
  })

  it('should throw for empty input', () => {
    const input = ''
    expect(() => getFirstWord(input)).toThrowError('Cannot get the first word of empty text')
  })

})