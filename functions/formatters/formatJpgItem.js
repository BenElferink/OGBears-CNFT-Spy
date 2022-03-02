const blockfrostJsonFile = require('../../data/blockfrost')
const { BEAR_POLICY_ID } = require('../../constants/policy-ids')
const getImageFromIPFS = require('../../functions/getImageFromIPFS')

const formatJpgItem = (item, { sold }) => {
  const assetId = item.asset
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
    price: item.price_lovelace / 1000000,
    imageUrl: getImageFromIPFS(image),
    itemUrl: sold
      ? `https://pool.pm/${BEAR_POLICY_ID}.${name.replace('BEAR', '')}`
      : `https://jpg.store/asset/${assetId}`,
    store: 'jpg.store',
    date: new Date(sold ? item.purchased_at : item.listed_at),
  }
}

module.exports = formatJpgItem
