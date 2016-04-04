/* eslint-env node, mocha */
const expect = require('chai').expect

const itemValue = require('../src/itemValue.js')

describe('itemValue', () => {
  it('uses the item sell price', () => {
    let item = {sell: {price: 10}}
    expect(itemValue(item)).to.equal(10)
  })

  it('uses the last known item sell price', () => {
    let item = {sell: {price: 0, last_known: 10}}
    expect(itemValue(item)).to.equal(10)
  })

  it('uses the crafting price', () => {
    let item = {sell: {price: 0, last_known: false}, crafting: {buy: 10}}
    expect(itemValue(item)).to.equal(10)
  })

  it('uses the bigger of last known item sell price and crafting price', () => {
    let item = {sell: {price: 0, last_known: 10}, crafting: {buy: 20}}
    expect(itemValue(item)).to.equal(20)
  })

  it('uses the item buy price', () => {
    let item = {buy: {price: 10}}
    expect(itemValue(item)).to.equal(10)
  })

  it('uses the vendor price', () => {
    let item = {vendor_price: 11}
    expect(itemValue(item)).to.equal(11)
  })

  it('fails gracefully', () => {
    let item = {}
    expect(itemValue(item)).to.equal(false)
  })
})
