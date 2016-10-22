/* eslint-env node, mocha */
import {expect} from 'chai'
import itemInherits from '../src/itemInherits.js'

describe('itemInherits', () => {
  it('gets the inherited item', () => {
    expect(itemInherits(35976)).to.deep.equal([{id: 35986, count: 1}])
    expect(itemInherits(49501)).to.deep.equal([{id: 19721, count: 50}, {gold: 888888}])
  })

  it('fails gracefully', () => {
    expect(itemInherits(9999999999)).to.equal(false)
  })
})
