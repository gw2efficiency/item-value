import staticItemInheritance from './static/itemInheritance.js'

export default function itemInherits (id) {
  return staticItemInheritance[id] || false
}
