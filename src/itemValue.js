import _get from 'fast-get'

const GOLD = 10000

export default function itemValue (item) {
  const buyPrice = _get(item, 'buy.price', 0)
  const lastKnownBuyPrice = _get(item, 'buy.last_known', 0)
  const sellPrice = _get(item, 'sell.price', 0)
  const lastKnownSellPrice = _get(item, 'sell.last_known', 0)
  const craftingPrice = _get(item, 'crafting.buy', 0)
  const supply = _get(item, 'sell.quantity', 0)

  // Set a flag if we should use sell pricing for this item. Generally, we want to use
  // the sell price for most items, but for some items with a low supply this opens up
  // the option for market manipulation, since someone can list an item that is generally
  // much lower value for an unreasonable price, thus increasing the "value" artificially.
  // To prevent that kind of abuse, we just use the buy price for these ~1300 items.
  const sellDecisionPrice = sellPrice || lastKnownSellPrice
  const buyDecisionPrice = buyPrice || lastKnownBuyPrice
  const useSellPrice =
    supply > 1000 ||
    sellDecisionPrice < buyDecisionPrice * 5 ||
    sellDecisionPrice - buyDecisionPrice < 2 * GOLD

  // 1. The item is currently sold in the tradingpost, use the sell price
  if (useSellPrice && sellPrice) {
    return sellPrice
  }

  // 2. If the item is currently not sold on the tradingpost and current buy price is below last known sell price,
  // use the last known sell price
  if (useSellPrice && lastKnownSellPrice && buyPrice <= lastKnownSellPrice) {
    return lastKnownSellPrice
  }

  // 3. If item sell price can not be used, crafting price exist, and sell or last known sell price
  // is above crafting price, pick maximum of craft and buy price. This sets item value to crafting
  // price only if item sell is detected as inflated and crafting price is between buy and sell.
  if (!useSellPrice && craftingPrice && (sellDecisionPrice > craftingPrice)) {
    return Math.max(craftingPrice, buyPrice)
  }

  // 4. Fall back to the buy price in case item has never been sold on the trading post or sell
  // price can not be used due to being marked as inflated and either there is no crafting price
  // or the crafting price is not below the sell price.
  if (buyPrice) {
    return buyPrice
  }

  // 5. If the item was never sold on the tradingpost and is not listed or sell price can not be used,
  // there are no buy orders, and craft price is above sell price, use the crafting price if it exists
  if (craftingPrice) {
    return craftingPrice
  }

  // 6. Try to use the last known buy price as a best-effort deal
  if (lastKnownBuyPrice) {
    return lastKnownBuyPrice
  }

  // 7. Fall back to the vendor price to at least give it a number
  if (item.vendor_price) {
    return item.vendor_price
  }

  // 8. Give up, this item has no value :(
  return false
}
