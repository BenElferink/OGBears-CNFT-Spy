const dotenv = require('dotenv')
const fs = require('fs')
const Axios = require('axios')
const { BEARS_POLICY_ID } = require('../constants/policy-ids.js')

dotenv.config()

const OGB_POLICY_ID = BEARS_POLICY_ID
const BLOCKFROST_KEY = process.env.BLOCKFROST_KEY ?? ''
const BLOCKFROST_API = 'https://cardano-mainnet.blockfrost.io/api/v0'

const run = async () => {
  try {
    const policyAssets = []
    const populatedAssets = []

    console.log('getting all assets from blockfrost')
    for (let page = 1; true; page++) {
      console.log(`querying page number ${page}`)
      const { data: policyAssetsPagination } = await Axios.get(
        `${BLOCKFROST_API}/assets/policy/${OGB_POLICY_ID}?page=${page}`,
        {
          headers: {
            project_id: BLOCKFROST_KEY,
          },
        },
      )

      console.log(`queried ${policyAssetsPagination.length} assets for page ${page}`)
      if (!policyAssetsPagination.length) {
        break
      }

      policyAssetsPagination.forEach((item) => {
        policyAssets.push(item)
      })
    }

    console.log(`got a total of ${policyAssets.length} assets from blockfrost`)
    console.log('populating each individual asset from blockfrost')

    for (let idx = 0; idx < policyAssets.length; idx++) {
      const { asset } = policyAssets[idx]
      console.log(`populating: index ${idx}, asset ${asset}`)

      populatedAssets.push(
        (
          await Axios.get(`${BLOCKFROST_API}/assets/${asset}`, {
            headers: {
              project_id: BLOCKFROST_KEY,
            },
          })
        ).data,
      )
    }

    console.log('sorting assets by bear #')
    populatedAssets.sort(
      (a, b) =>
        Number(a.onchain_metadata.name.replace('BEAR', '')) -
        Number(b.onchain_metadata.name.replace('BEAR', '')),
    )

    console.log('saving all assets to JSON file')
    fs.writeFileSync(
      './data/blockfrost.json',
      JSON.stringify({
        _wen: Date.now(),
        policyId: OGB_POLICY_ID,
        count: populatedAssets.length,
        assets: populatedAssets,
      }),
      'utf8',
    )

    console.log('done!')
  } catch (error) {
    console.error(error)
  }
}

run()
