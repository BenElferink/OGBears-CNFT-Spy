const blockfrostJsonFile = require('../../data/blockfrost')
const { BEARS_POLICY_ID } = require('../../constants/policy-ids')
const getImageFromIPFS = require('../../functions/getImageFromIPFS')
const toHex = require('../toHex')

const formatCnftItem = (item, { sold }) => {
  const assetId = `${BEARS_POLICY_ID}${toHex(item.assets[0].assetId)}`
  const {
    onchain_metadata: { name, image },
  } = blockfrostJsonFile.assets.find(({ asset }) => asset === assetId)

  return {
    assetId,
    name,
    price: item.price / 1000000,
    imageUrl: getImageFromIPFS(image),
    itemUrl: sold
      ? `https://pool.pm/${BEARS_POLICY_ID}.${item.assets[0].assetId}`
      : `https://cnft.io/token/${item._id}`,
    store: 'cnft.io',
    date: new Date(item.createdAt),
  }
}

module.exports = formatCnftItem
