const bearsBlockfrostJsonFile = require('../../data/blockfrost/bears')
const cubsBlockfrostJsonFile = require('../../data/blockfrost/cubs')
const getImageFromIPFS = require('../../functions/getImageFromIPFS')
const { BEAR_POLICY_ID, CUB_POLICY_ID } = require('../../constants/policy-ids')

const formatJpgItem = (item, { sold, cubMode }) => {
  const { asset_id, listing_id } = item

  const blockfrostAsset = cubMode
    ? cubsBlockfrostJsonFile.assets.find(({ asset }) => asset === asset_id)
    : bearsBlockfrostJsonFile.assets.find(({ asset }) => asset === asset_id)

  if (!blockfrostAsset) {
    return {
      assetId: asset_id,
      name: 'N/A',
      price: 0,
      imageUrl: '',
      itemUrl: `https://pool.pm/tokens/${cubMode ? CUB_POLICY_ID : BEAR_POLICY_ID}`,
      store: 'blockfrost.io',
      date: new Date(0, 0, 0),
    }
  }

  const {
    fingerprint,
    onchain_metadata: { name, image },
  } = blockfrostAsset

  return {
    assetId: asset_id,
    name,
    price: item.price_lovelace / 1000000,
    imageUrl: getImageFromIPFS(image),
    itemUrl: sold ? `https://pool.pm/${fingerprint}` : `https://jpg.store/listing/${listing_id}`,
    store: 'jpg.store',
    date: new Date(sold ? item.confirmed_at : item.listed_at),
  }
}

module.exports = formatJpgItem
