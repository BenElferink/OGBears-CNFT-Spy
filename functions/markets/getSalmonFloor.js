const { SALMON_POLICY_ID } = require('../../constants/policy-ids')
const crawlJPG = require('./crawlJPG')

const TYPE = 'Salmon Trophy'

const getSalmonFloor = async () => {
  const floorData = {
    [TYPE]: {
      floor: null,
      timeStamp: Date.now(),
    },
  }

  const fetchedData = await crawlJPG({ policyId: SALMON_POLICY_ID })

  if (fetchedData.length) {
    floorData[TYPE].floor = Number(fetchedData[0].listing_lovelace) / 1000000
  }

  return floorData
}

module.exports = getSalmonFloor
