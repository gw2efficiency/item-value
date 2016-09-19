/* eslint-env node, mocha */
const expect = require('chai').expect

const itemGems = require('../src/itemGems.js')

describe('itemGems', () => {
  it('gets the gem count for the item', () => {
    expect(itemGems(42597)).to.deep.equal({gems: 75, flags: ['booster']})
  })

  it('fails gracefully', () => {
    expect(itemGems(9999999999)).to.equal(false)
  })
})
