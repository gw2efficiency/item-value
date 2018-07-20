/* eslint-env node, mocha */
import {expect} from 'chai'
import itemValue from '../src/itemValue.js'

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

  it('uses the last known item buy price', () => {
    let item = {buy: {last_known: 10}}
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

  it('skips the sell price for items that are inflated', () => {
    // Matches all criteria, fall back to buy price
    let item0 = {name: 'Warhorn', sell: {price: 10000000, last_known: 10, quantity: 10}, buy: {price: 1}}
    expect(itemValue(item0)).to.equal(1)

    let item1 = {name: 'Warhorn', sell: {price: false, last_known: 10000000, quantity: 10}, buy: {price: 1}}
    expect(itemValue(item1)).to.equal(1)

    let item2 = {name: 'Warhorn', sell: {price: 10000000, last_known: 10, quantity: 10}, buy: {price: false, last_known: 1}}
    expect(itemValue(item2)).to.equal(1)

    // Whitelisted Item
    let item3 = {name: 'Fancy Skin', sell: {price: 10000000, last_known: 10, quantity: 10}, buy: {price: 1}}
    expect(itemValue(item3)).to.equal(10000000)

    // Buy price > 500g
    let item4 = {name: 'Warhorn', sell: {price: 100000000, last_known: 10, quantity: 10}, buy: {price: 5010000}}
    expect(itemValue(item4)).to.equal(100000000)

    // Supply > 1000
    let item5 = {name: 'Warhorn', sell: {price: 10000000, last_known: 10, quantity: 1001}, buy: {price: 1}}
    expect(itemValue(item5)).to.equal(10000000)

    // Sell Price < Buy Price * 2
    let item6 = {name: 'Warhorn', sell: {price: 100000, last_known: 10, quantity: 10}, buy: {price: 51000}}
    expect(itemValue(item6)).to.equal(100000)

    // Difference < 1g
    let item7 = {name: 'Warhorn', sell: {price: 10000, last_known: 10, quantity: 10}, buy: {price: 1}}
    expect(itemValue(item7)).to.equal(10000)
  })
})
