const MATCHES = [
  ' Skin',
  ' Dye',
  ' Infusion',
  'Recipe: Keeper',
  'Aetherized ',
  'Mini ',
  'Favor of the Bazaar',
  'Festive Grymm Svaard',
  'Endless Casual Clothing Tonic',
  'Unopened Endless Choya Pinata Tonic'
]

// These items get their sell price as the value, even if they have low supply and super high ROI
export default (item) => {
  return MATCHES.some(match => item.includes(match))
}
