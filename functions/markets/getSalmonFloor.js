const crawlCNFT = require('./crawlCNFT')
const crawlJPG = require('./crawlJPG')
const { SALMON_POLICY_ID } = require('../../constants/policy-ids')

const TYPE = 'Salmon Trophy'

const getSalmonFloor = async () => {
  const floorData = {
    [TYPE]: {
      floor: null,
      timeStamp: Date.now(),
    },
  }

  let cnftFloor = null
  let jpgFloor = null

  console.log('crawling cnft.io')
  const cnftFetchedData = await crawlCNFT({
    project: '',
    search: SALMON_POLICY_ID,
    verified: false,
    sold: false,
    page: 1,
    sort: { price: 1 },
  })
  console.log(`got ${cnftFetchedData.length} listings from cnft.io`)

  if (cnftFetchedData.length) {
    cnftFloor = cnftFetchedData[0].price / 1000000
  }

  console.log('crawling jpg.store')
  const jpgFetchedData = (
    await crawlJPG({
      sold: false,
      page: 0,
      policyId: SALMON_POLICY_ID,
    })
  ).sort((a, b) => a.price_lovelace - b.price_lovelace)
  console.log(`got ${jpgFetchedData.length} listings from jpg.store`)

  if (jpgFetchedData.length) {
    jpgFloor = jpgFetchedData[0].price_lovelace / 1000000
  }

  console.log('comparing floors between cnft.io and jpg.store')

  if (cnftFloor && jpgFloor) {
    if (cnftFloor < jpgFloor) {
      console.log(`real floor is ${cnftFloor} from cnft.io`)
      floorData[TYPE].floor = cnftFloor
    } else if (cnftFloor > jpgFloor) {
      console.log(`real floor is ${jpgFloor} from jpg.store`)
      floorData[TYPE].floor = jpgFloor
    } else if (cnftFloor === jpgFloor) {
      console.log(`real floor is ${jpgFloor} from both cnft.io and jpg.store`)
      floorData[TYPE].floor = jpgFloor
    } else {
      console.error('unexpected result, no floor found')
    }
  } else if (cnftFloor && !jpgFloor) {
    console.log(`real floor is ${cnftFloor} from cnft.io`)
    floorData[TYPE].floor = cnftFloor
  } else if (!cnftFloor && jpgFloor) {
    console.log(`real floor is ${jpgFloor} from jpg.store`)
    floorData[TYPE].floor = jpgFloor
  } else if (!cnftFloor && !jpgFloor) {
    console.log(`real floor is ${null} because none are listed`)
    floorData[TYPE].floor = null
  } else {
    console.error('unexpected result, no floor found')
  }

  return floorData
}

module.exports = getSalmonFloor
