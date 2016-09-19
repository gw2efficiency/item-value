const gemstoreItems = require('./static/gemstoreItems.js')

function itemGems (id) {
  return gemstoreItems[id] || false
}

module.exports = itemGems
