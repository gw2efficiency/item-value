# item-value

[![Build Status](https://img.shields.io/travis/gw2efficiency/item-value.svg?style=flat-square)](https://travis-ci.org/gw2efficiency/item-value)
[![Coverage Status](https://img.shields.io/codecov/c/github/gw2efficiency/item-value/master.svg?style=flat-square)](https://codecov.io/github/gw2efficiency/item-value)

> Calculate the value of guildwars2 items

*This is part of [gw2efficiency](https://gw2efficiency.com). Please report all issues in [the central repository](https://github.com/gw2efficiency/issues/issues).*

## Install

```
npm install gw2e-item-value
```

This module can be used for Node.js as well as browsers using [Browserify](https://github.com/substack/browserify-handbook#how-node_modules-works).

## Defining "value"

> **The value of an item should roughly represent how much money/effort a new player would need to achieve this item.**

## Item value calculations

### Item value

1. If the item is currently sold in the tradingpost, then the **sell price** is used
2. If the item is currently not sold in the tradingpost, then the greater of the **last known sell price** and the **crafting price** is used
3. If the item was never sold and cannot be crafted, then the **buy price** is used
4. If the item has no tradingpost price and cannot be crafted, then the **vendor price** is used

```js
const value = require('gw2e-account-value')

let item = {
  id: 1, 
  sell: {price: 1337, last_known: 1337}, 
  buy: {price: 12, last_known: 12}, 
  crafting: {buy: 10000}, 
  vendor_price: 5
  // ...
}

let value = value.itemValue(item)
// -> 1337
```

### Untradable items

Some items (like the "Permanent Merchant Express" or the "Miniature Gwynefyrdd") are account-bound and therefore don't have a tradingpost price. Instead, they inherit the value of tradable containers they are included in or items that can be traded for them.

```js
const value = require('gw2e-account-value')

let item = {id: 1, /* ... */}
let itemInheritance = value.itemInherits(item.id)
// -> {id: 12: count: 1}
// -> {id: 5, count: 100, gold: 10000}
// -> {gold: 1000000}
// -> false for items that don't inherit value from other items
```

### Containers

> This functionality is not built into this module for efficiency reasons, but it still exists.

Arguably all containers hold a value, but since it can be completely random how much a container is actually worth and the effort of maintaining a list of container to item mappings is not justified, containers without a tradingpost price are ignored.

The one exception to this are ascended boxes, which use the average value across all possible ascended items as a rough estimate.

## Tests

```
npm test
```

## Licence

MIT
