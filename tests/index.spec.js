/* eslint-env node, mocha */
import {expect} from 'chai'
import module from '../src/index.js'

describe('module', () => {
  it('exports the correct functions', () => {
    expect(Object.keys(module)).to.deep.equal([
      'itemValue',
      'itemInherits'
    ])
  })
})
