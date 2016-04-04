/* eslint-env node, mocha */
const expect = require('chai').expect

const itemInherits = require('../src/itemInherits.js')

describe('itemInherits', () => {
  it('gets the inherited item', () => {
    expect(itemInherits(35986)).to.deep.equal({id: 35976, count: 1})
    expect(itemInherits(49501)).to.deep.equal({id: 19721, count: 50, gold: 888888})
  })

  it('fails gracefully', () => {
    expect(itemInherits(9999999999)).to.equal(false)
  })
})
