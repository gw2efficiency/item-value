const content = `copy & paste from excel into here`

console.log('export default {')
const rows = content.split('\n').slice(1)
rows.map((row, i) => {
  row = row.split('\t')
  let flags = row[3].split(',').filter(x => x !== '').map(x => `'${x}'`).join(',')
  let gems = row[2].replace('.', '')
  let comma = i === rows.length - 1 ? '' : ','

  if (!row[0]) return

  console.log(`  ${row[0]}: {gems: ${gems}, flags: [${flags}]}${comma} // ${row[1]}${row[4] ? ' (' + row[4] + ')' : ''}`)
})
console.log('}')
