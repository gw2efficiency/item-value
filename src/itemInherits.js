const staticItemInheritance = require('./static/itemInheritance.js')

function itemInherits (id) {
  return staticItemInheritance[id] || false
}

module.exports = itemInherits
