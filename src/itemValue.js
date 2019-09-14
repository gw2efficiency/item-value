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
    buyDecisionPrice > 500 * GOLD ||
    supply > 1000 ||
    sellDecisionPrice < buyDecisionPrice * 5 ||
    sellDecisionPrice - buyDecisionPrice < 2 * GOLD

  // 1. The item is currently sold in the tradingpost, use the sell price
  if (useSellPrice && sellPrice) {
    return sellPrice
  }

  // 2. If the item is currently not sold on the tradingpost, use the last known sell price
  if (useSellPrice && lastKnownSellPrice) {
    return lastKnownSellPrice
  }

  // 3. Fall back to the buy price in case the sell price can not be used due to artificial
  // inflation or the item has never been sold on the tradingpost
  if (buyPrice) {
    return buyPrice
  }

  // 4. The item was never sold on the tradingpost and is not listed, use the crafting price if it exists
  // Note on why we do we not pick `Math.max(buyPrice, craftingPrice)`: This heavily impacts some
  // types of items that are cheaper dropped than crafted (Precursors) and some items where crafting
  // actually reduces the value to the buy price because of side benefits (Eternity).
  if (craftingPrice) {
    return craftingPrice
  }

  // 5. Try to use the last known buy price as a best-effort deal
  if (lastKnownBuyPrice) {
    return lastKnownBuyPrice
  }

  // 6. Fall back to the vendor price to at least give it a number
  if (item.vendor_price) {
    return item.vendor_price
  }

  // 7. Give up, this item has no value :(
  return false
}
