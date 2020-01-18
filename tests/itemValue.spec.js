/* eslint-env node, mocha */
import {expect} from 'chai'
import itemValue from '../src/itemValue.js'

describe('itemValue', () => {
  it('uses the item sell price', () => {
    const item = {
      buy: {price: 10, last_known: 10},
      sell: {price: 20, last_known: 10},
      crafting: {buy: 10},
      vendor_price: 10
    }

    expect(itemValue(item)).to.equal(20)
  })

  it('uses the last known item sell price', () => {
    let item = {
      buy: {price: 10, last_known: 10},
      sell: {price: 0, last_known: 20},
      crafting: {buy: 10},
      vendor_price: 10
    }

    expect(itemValue(item)).to.equal(20)
  })

  it('uses the buy price', () => {
    let item = {
      buy: {price: 20, last_known: 10},
      sell: {price: 0, last_known: 0},
      crafting: {buy: 10},
      vendor_price: 10
    }

    expect(itemValue(item)).to.equal(20)
  })

  it('uses the crafting price', () => {
    let item = {
      buy: {price: 0, last_known: 10},
      sell: {price: 0, last_known: 0},
      crafting: {buy: 20},
      vendor_price: 10
    }

    expect(itemValue(item)).to.equal(20)
  })

  it('uses the last known buy price', () => {
    let item = {
      buy: {price: 0, last_known: 20},
      sell: {price: 0, last_known: 0},
      crafting: {buy: 0},
      vendor_price: 10
    }

    expect(itemValue(item)).to.equal(20)
  })

  it('uses the vendor price', () => {
    let item = {
      buy: {price: 0, last_known: 0},
      sell: {price: 0, last_known: 0},
      crafting: {buy: 0},
      vendor_price: 20
    }

    expect(itemValue(item)).to.equal(20)
  })

  it('fails gracefully', () => {
    let item = {}
    expect(itemValue(item)).to.equal(false)
  })

  it('skips the sell price for items that are inflated', () => {
    let item0 = {name: 'Warhorn', sell: {price: 10000000, last_known: 10, quantity: 10}, buy: {price: 1}}
    expect(itemValue(item0)).to.equal(1)

    let item1 = {name: 'Warhorn', sell: {price: false, last_known: 10000000, quantity: 10}, buy: {price: 1}}
    expect(itemValue(item1)).to.equal(1)

    let item2 = {name: 'Warhorn', sell: {price: 10000000, last_known: 10, quantity: 10}, buy: {price: false, last_known: 1}}
    expect(itemValue(item2)).to.equal(1)

    let item4 = {name: 'Warhorn', sell: {price: 100000000, last_known: 10, quantity: 10}, buy: {price: 5010000}}
    expect(itemValue(item4)).to.equal(5010000)
  })

  it('uses the sell price for items that are not inflated', () => {
    // Supply > 1000
    let item1 = {name: 'Warhorn', sell: {price: 10000000, last_known: 10, quantity: 1001}, buy: {price: 1}}
    expect(itemValue(item1)).to.equal(10000000)

    // Sell Price < Buy Price * 5
    let item2 = {name: 'Warhorn', sell: {price: 100000, last_known: 10, quantity: 10}, buy: {price: 51000}}
    expect(itemValue(item2)).to.equal(100000)

    // Difference < 2g
    let item3 = {name: 'Warhorn', sell: {price: 10000, last_known: 10, quantity: 10}, buy: {price: 1}}
    expect(itemValue(item3)).to.equal(10000)
  })

  it('uses craft price on inflated and bigger sell and lower-than-craft buy', () => {
    let item = {
      buy: {price: 10, last_known: 10},
      sell: {price: 100000, last_known: 100000},
      crafting: {buy: 11},
      vendor_price: 10
    }

    expect(itemValue(item)).to.equal(11)
  })

  it('uses buy price on inflated and smaller-than-craft sell', () => {
    let item = {
      buy: {price: 10, last_known: 10},
      sell: {price: 100000, last_known: 100000},
      crafting: {buy: 200000},
      vendor_price: 10
    }

    expect(itemValue(item)).to.equal(10)
  })

  it('uses buy price on inflated sell and lower-than-buy craft', () => {
    let item = {
      buy: {price: 10, last_known: 10},
      sell: {price: 100000, last_known: 100000},
      crafting: {buy: 9},
      vendor_price: 10
    }

    expect(itemValue(item)).to.equal(10)
  })
})
