const fs = require('fs')
const Axios = require('axios')
const { CUB_POLICY_ID: POLICY_ID } = require('../constants/policy-ids')

const run = async () => {
  const payload = {}

  try {
    const cnftToolsAssets = (
      await Axios.get(`https://cnft.tools/api/external/${POLICY_ID}`, {
        headers: {
          'Accept-Encoding': 'application/json',
        },
      })
    ).data

    cnftToolsAssets.forEach((item) => {
      payload[item.name.replace('OGBears Cub #', '')] = item.rarityRank
    })

    fs.writeFileSync('./data/cnftToolsRanks/cubs.json', JSON.stringify(payload), 'utf8')

    console.log('done!')
  } catch (error) {
    console.error(error)
  }
}

run()
