# account-value

[![Build Status](https://img.shields.io/travis/gw2efficiency/account-value.svg?style=flat-square)](https://travis-ci.org/gw2efficiency/account-value)
[![Coverage Status](https://img.shields.io/codecov/c/github/gw2efficiency/account-value/master.svg?style=flat-square)](https://codecov.io/github/gw2efficiency/account-value)

> Calculate the value of guildwars2 accounts

*This is part of [gw2efficiency](https://gw2efficiency.com). Please report all issues in [the central repository](https://github.com/gw2efficiency/issues/issues).*

## Install

```
npm install gw2e-account-value
```

This module can be used for Node.js as well as browsers using [Browserify](https://github.com/substack/browserify-handbook#how-node_modules-works).

## Defining "value"

> **The value of an account should roughly represent how much money/effort a new player would need to replicate that account.** This is not a representation of how much gold a account could achieve if it sold all items, since it includes soulbound items and account unlocks.

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

Arguably all containers hold a value, but since it can be completely random how much a container is actually worth and the effort of maintaining a list of container to item mappings is not justified, containers without a tradingpost price are ignored.

The one exception to this are ascended boxes, which use the average value across all possible ascended items as a rough estimate.

## Account value calculations

### Characters / Bank / Material Storage

The value of characters, bank and material storage get calculated with the value of the items in them. For characters, inventory as well as equipment are considered.

### Skins

Single skins can be acquired from a lot of items most of the time. The value of a skins is therefore the value of the cheapest item unlocking the skin. Since this is a special case of getting the "lowest" valued item, item values which are only calculated with the vendor price and items with no value (e.g. karma vendor items) will be ignored, since they distort the correct skin value.

When calculating the total account value, skins only have a value if the account has no item of this skin in their inventory, so they don't count twice. Skins also have "inherited" skins, which means if you for example have "Eternity" unlocked, then "Sunrise", "Twilight", "Dusk" and "Dawn" are set to have no value (this is the same for all legendaries). If you find a skin that unlockes multiple valueable skins, let me know.

### Dyes & Miniatures

The value of unlocked dyes and miniatures equals the value of the items needed to unlock them. This means that unlocking a miniature and holding it in your inventory has the same value to your account.

### Gemstore items

:construction: **This is not supported yet.** :construction:

While a lot of gemstore items are acquired for free from dailies or events, they definitely hold a value. This value is the default gem price (without taking sales into account) at the current gold to gem conversion rate.

```js
const value = require('gw2e-account-value')

// Note: for things like character slots and bank slots, the
// unlock item id should get passed in
let item = {id: 1, /* ... */}
let gemPrice = value.itemGems(item.id)
// -> 123
// -> false for non-gemstore items
```

### Wallet

:construction: **Everything except "Gold" is not supported yet.** :construction:

Every currency in the wallet is valued at the currently best *permanent & safe* conversion rate.

- **Gold:** Direct value
- **Spirit Shards:** Best conversion excluding weapons (since they are not a safe conversion and usually require dungeon tokens as well)
- **Dungeon Tokens:** Best conversion rate excluding items needing account bound recipes and weapons
- **Gems:** Current gems to gold conversion rate
- **Laurels:** Best conversion excluding once-per-account items
- **Karma / Badges of Honor / Guild Commendations / Claim Tickets:** Best conversion rate

### Achievements

:construction: **This is not supported yet.** :construction:

The value of an achievement equals the value of all unlock items this achievement requires, but *excluding the value of items still owned by the account*.

### Crafting professions

:construction: **This is not supported yet.** :construction:

The value of a crafting profession equals the cost of leveling the crafting profession to that rating.

### Private Guilds ("Guild Bank")

:construction: **This is not supported yet.** :construction:

In the case the account owns a private guild, which is defined by a guild with the **account as the only member**, all the items in the guild vault count to the account value with their specific value.

The amount of people owning a private guild bank with guild halls unlocked / upgrading their guild is extremely small. Because this does not justify the effort needed, Treasury as well as Upgrades are ignored in the value calculation.

## Tests

```
npm test
```

## Licence

MIT
