import gemstoreItems from './static/gemstoreItems.js'

export default function itemGems (id) {
  return gemstoreItems[id] || false
}
