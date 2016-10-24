const content = `paste from excel here`

console.log('module.exports = {')
const rows = content.split('\n').slice(1)
rows.map((row, i) => {
  row = row.split('	')
  let flags = row[3].split(',').filter(x => x !== '').map(x => `'${x}'`).join(',')
  let gems = row[2].replace('.', '')
  let comma = i === rows.length - 1 ? '' : ','
  console.log(`  ${row[0]}: {gems: ${gems}, flags: [${flags}]}${comma} // ${row[1]}${row[4] ? ' (' + row[4] + ')' : ''}`)
})
console.log('}')
