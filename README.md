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

## Usage

For better understanding of how and why this does things, please read the [design document for the account value](https://github.com/gw2efficiency/issues/blob/master/docs/account-value.md).

### Calculate the item value

```js
import {itemValue} from 'gw2e-account-value'

let item = {
  id: 1, 
  sell: {price: 1337, last_known: 1337}, 
  buy: {price: 12, last_known: 12}, 
  crafting: {buy: 10000}, 
  vendor_price: 5
  // ...
}

let value = itemValue(item)
// -> 1337
```

### Get the inherited item

```js
import {itemInherits} from 'gw2e-account-value'

let item = {id: 1, /* ... */}
let itemInheritance = itemInherits(item.id)
// -> [{id: 19721, count: 50}, {gold: 888888}]
// -> false for items that don't inherit value from other items
```

### Get the gem price of an item

```js
import {itemGems} from 'gw2e-account-value'

// Note: for things like character slots and bank slots, the
// unlock item id should get passed in
let item = {id: 42597, /* ... */}
let gemPrice = value.itemGems(item.id)
// -> {gems: 75, flags: ['booster']}
// -> false for non-gemstore items
```

## Tests

```
npm test
```

## Licence

MIT
