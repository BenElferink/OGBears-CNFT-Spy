const blockfrostJsonFile = require('../../data/blockfrost')
const { BEARS_POLICY_ID } = require('../../constants/policy-ids')
const getImageFromIPFS = require('../../functions/getImageFromIPFS')

const formatJpgItem = (item, { sold }) => {
  const assetId = item.asset
  const {
    onchain_metadata: { name, image },
  } = blockfrostJsonFile.assets.find(({ asset }) => asset === assetId)

  return {
    assetId,
    name,
    price: item.price_lovelace / 1000000,
    imageUrl: getImageFromIPFS(image),
    itemUrl: sold
      ? `https://pool.pm/${BEARS_POLICY_ID}.${name.replace('BEAR', '')}`
      : `https://jpg.store/asset/${assetId}`,
    store: 'jpg.store',
    date: new Date(sold ? item.purchased_at : item.listed_at),
  }
}

module.exports = formatJpgItem
