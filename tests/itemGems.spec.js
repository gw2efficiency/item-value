/* eslint-env node, mocha */
import {expect} from 'chai'
import itemGems from '../src/itemGems.js'

describe('itemGems', () => {
  it('gets the gem count for the item', () => {
    expect(itemGems(42597)).to.deep.equal({gems: 75, flags: ['booster']})
  })

  it('fails gracefully', () => {
    expect(itemGems(9999999999)).to.equal(false)
  })
})
