const content = ``

const rows = content.split('\n').slice(1)
rows.map((row) => {
  row = row.split('\t')

  const id = row[0]
  const name = row[1]
  const count = row[2]

  if (!id || !name || !count) throw new Error('Missing content for row: ' + row)

  console.log(`  ${id}: [{id: 82450, count: ${count}}], // ${name}`)
})
