function itemValue (item) {
  // 1. If the item is currently sold in the tradingpost,
  // then the sell price is used
  if (item.sell && item.sell.price) {
    return item.sell.price
  }

  // 2. If the item is currently not sold in the tradingpost,
  // then the greater of the last known sell price and the crafting price is used
  let lastKnown = item.sell && item.sell.last_known ? item.sell.last_known : false
  let crafting = item.crafting && item.crafting.buy ? item.crafting.buy : false
  if (lastKnown || crafting) {
    return Math.max(lastKnown, crafting)
  }

  // 3. If the item was never sold and cannot be crafted,
  // then the buy price is used
  if (item.buy && item.buy.price) {
    return item.buy.price
  }

  // 4. If the item has no tradingpost price and cannot be crafted,
  // then the vendor price is used
  if (item.vendor_price) {
    return item.vendor_price
  }

  return false
}

module.exports = itemValue
