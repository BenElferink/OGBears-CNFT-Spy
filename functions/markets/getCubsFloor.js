const { CUB_POLICY_ID } = require('../../constants/policy-ids')
const crawlJPG = require('./crawlJPG')
const cubsTraitsJsonFile = require('../../data/traits/cubs')

const getCubsFloor = async () => {
  const floorData = {}
  const fetchedData = await crawlJPG({ policyId: CUB_POLICY_ID })

  for (const type of cubsTraitsJsonFile.types) {
    let thisFloor = null

    for (const listing of fetchedData) {
      if (listing.traits['attributes / Type'].toLowerCase() === type.toLowerCase()) {
        thisFloor = Number(listing.listing_lovelace) / 1000000
        break
      }
    }

    console.log(`found floor for ${type}! floor is ${thisFloor}`)
    floorData[type] = { floor: thisFloor, timestamp: Date.now() }
  }

  return floorData
}

module.exports = getCubsFloor
