import _get from 'fast-get'
import whitelistedLowSupplyItems from './static/whitelistedLowSupplyItems'

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
  const useSellPrice =
    buyPrice > 500 * GOLD ||
    supply > 1000 ||
    sellPrice < buyPrice * 2 ||
    sellPrice - buyPrice < GOLD ||
    whitelistedLowSupplyItems(item.name)

  // 1. The item is currently sold in the tradingpost
  if (useSellPrice && sellPrice) {
    return sellPrice
  }

  // 2. If the item is currently not listed on the tradingpost, use the greater of last
  // known sell tradingpost price and the crafting price of the item (if it has one)
  const lastKnownTpPrice = useSellPrice ? lastKnownSellPrice : 0
  if (lastKnownTpPrice || craftingPrice) {
    return Math.max(lastKnownTpPrice, craftingPrice)
  }

  // 3. Try to fall back to the buy price in case the sell price was used at 1 or the item
  // has never been sold, and the item is not craftable
  if (buyPrice || lastKnownBuyPrice) {
    return buyPrice || lastKnownBuyPrice
  }

  // 4. Fall back to the vendor price to at least give it a number
  if (item.vendor_price) {
    return item.vendor_price
  }

  // 5. Give up :(
  return false
}
