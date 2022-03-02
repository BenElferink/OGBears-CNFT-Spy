const blockfrostJsonFile = require('../../data/blockfrost')
const { BEAR_POLICY_ID } = require('../../constants/policy-ids')
const getImageFromIPFS = require('../../functions/getImageFromIPFS')
const toHex = require('../toHex')

const formatCnftItem = (item, { sold }) => {
  const assetId = `${BEAR_POLICY_ID}${toHex(item.assets[0].assetId)}`
  const blockfrostAsset = blockfrostJsonFile.assets.find(({ asset }) => asset === assetId)

  if (!blockfrostAsset) {
    return {
      assetId,
      name: 'BEAR',
      price: 0,
      imageUrl: '',
      itemUrl: `https://pool.pm/tokens/${BEAR_POLICY_ID}`,
      store: 'blockfrost.io',
      date: new Date(0, 0, 0),
    }
  }

  const {
    onchain_metadata: { name, image },
  } = blockfrostAsset

  return {
    assetId,
    name,
    price: item.price / 1000000,
    imageUrl: getImageFromIPFS(image),
    itemUrl: sold
      ? `https://pool.pm/${BEAR_POLICY_ID}.${item.assets[0].assetId}`
      : `https://cnft.io/token/${item._id}`,
    store: 'cnft.io',
    date: new Date(item.createdAt),
  }
}

module.exports = formatCnftItem
