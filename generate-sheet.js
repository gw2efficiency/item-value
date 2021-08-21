const fs = require('fs')

let file = fs.readFileSync(__dirname + '/src/static/gemstoreItems.js', 'utf-8')
file = file.split('\n')
file = file.slice(1, file.length - 2)
file = file.map(parseLine)
file = file
  .map((line) => [line.id, line.name, line.gems, line.flags, line.comment].join('\t'))
  .join('\n')
console.log(file)

function parseLine(line) {
  const COMMENTS = {
    'Combined in Mystic Forge': { mysticForge: 1 },
    Container: { container: 1 },
    'Inside a container': { insideContainer: 1 },
    'Inside a container / Unlocks all weights': { insideContainer: 1, unlocksAllWeights: 1 },
    'Inside a container, unlocks all weights': { insideContainer: 1, unlocksAllWeights: 1 },
    'Inside Container': { insideContainer: 1 },
    'Random BLC Drop': { randomBLCDrop: 1 },
    'Random BLC Drop / Inside a container': { randomBLCDrop: 1, insideContainer: 1 },
    'Random BLC Drop / Inside Container': { randomBLCDrop: 1, insideContainer: 1 },
    'Random BLC Drop / Unlocks all weights': { randomBLCDrop: 1, unlocksAllWeights: 1 },
    'Unlocks all weights': { unlocksAllWeights: 1 },
    'Unlocks all weights/ Random BLC Drop': { unlocksAllWeights: 1, randomBLCDrop: 1 },
  }

  const match = line.match(/  (\d+): {gems: (\d+), flags: \[([^\]]*)\]},? \/\/ (.*)/)

  let name = match[4]
  let comment = Object.keys(COMMENTS).find((x) => name.endsWith(` (${x})`))

  if (comment) {
    name = name.replace(` (${comment})`, '')
    comment = buildFromCommentFlags(COMMENTS[comment])
  }

  return { id: match[1], gems: match[2], flags: match[3].replace(/'/g, ''), name, comment }
}

function buildFromCommentFlags(commentFlags) {
  let comment = []

  if (commentFlags.mysticForge) {
    comment.push('Combined in Mystic Forge')
  }

  if (commentFlags.container) {
    comment.push('Container')
  }

  if (commentFlags.insideContainer) {
    comment.push('Inside a container')
  }

  if (commentFlags.randomBLCDrop) {
    comment.push('Random BLC Drop')
  }

  if (commentFlags.unlocksAllWeights) {
    comment.push('Unlocks all weights')
  }

  return comment.join(' / ')
}
