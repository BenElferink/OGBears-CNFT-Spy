const bearsBlockfrostJsonFile = require('../../data/blockfrost/bears')
const { BEAR_POLICY_ID } = require('../../constants/policy-ids')
const getImageFromIPFS = require('../../functions/getImageFromIPFS')

const formatJpgItem = (item, { sold }) => {
  const { asset_id, listing_id } = item
  const blockfrostAsset = bearsBlockfrostJsonFile.assets.find(
    ({ asset }) => asset === asset_id
  )

  if (!blockfrostAsset) {
    return {
      assetId: asset_id,
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
    assetId: asset_id,
    name,
    price: item.price_lovelace / 1000000,
    imageUrl: getImageFromIPFS(image),
    itemUrl: sold
      ? `https://pool.pm/${BEAR_POLICY_ID}.${name.replace('BEAR', '')}`
      : `https://jpg.store/listing/${listing_id}`,
    store: 'jpg.store',
    date: new Date(sold ? item.confirmed_at : item.listed_at),
  }
}

module.exports = formatJpgItem
