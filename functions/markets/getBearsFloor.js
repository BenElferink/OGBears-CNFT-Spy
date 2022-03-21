const crawlCNFT = require('./crawlCNFT')
const crawlJPG = require('./crawlJPG')

const getBearsFloor = async (bearsJsonFile, blockfrostJsonFile) => {
  const floorData = {}
  const cnftFloorData = {}
  const jpgFloorData = {}

  const cnftPreFetchedData = []
  let cnftLastSearchedIndex = 0
  let cnftPage = 0

  const findCnftFloor = (bearType = '', index = 0) => {
    console.log(`searching floor for type ${bearType} from index ${index}`)

    // search pre-fetched data for floor price of this bear type
    // (reminder: data is fetched by sorted price, 1st item found is the floor)
    for (let i = index; i < cnftPreFetchedData.length; i++) {
      const preFetchedBear = cnftPreFetchedData[i]
      if (bearType === preFetchedBear.assets[0].metadata.attributes.Type) {
        return preFetchedBear
      }
    }

    cnftLastSearchedIndex = cnftPreFetchedData.length - 1
    return null
  }

  // go through every bear in the list
  for (const bear of bearsJsonFile.bears) {
    cnftLastSearchedIndex = 0
    const thisType = bear.type
    let foundFloorForThisType = cnftPreFetchedData.length
      ? findCnftFloor(thisType, cnftLastSearchedIndex)
      : null

    while (!foundFloorForThisType) {
      try {
        // as long as the floor is not found, get more data from cnft
        cnftPage++
        console.log(`crawling cnft.io for type ${thisType} at page ${cnftPage}`)
        const cnftFetchedData = await crawlCNFT({ sold: false, sort: { price: 1 }, page: cnftPage })

        // in case none are listed
        if (!cnftFetchedData.length && !foundFloorForThisType) {
          foundFloorForThisType = { price: null }
          break
        }

        if (cnftPreFetchedData.length) {
          // a verification method to add only new data to the end of the array
          const newBears = []
          for (let i = cnftFetchedData.length - 1; i >= 0; i--) {
            if (cnftFetchedData[i]._id === cnftPreFetchedData[cnftPreFetchedData.length - 1]._id) break
            newBears.unshift(cnftFetchedData[i])
          }

          newBears.forEach((item) => cnftPreFetchedData.push(item))
        } else {
          cnftFetchedData.forEach((item) => cnftPreFetchedData.push(item))
        }

        // after each time new data was recieved, search for the floor price again
        foundFloorForThisType = findCnftFloor(thisType, cnftLastSearchedIndex)
      } catch (error) {
        console.error(error)
      }
    }

    const thisFloor = foundFloorForThisType.price ? foundFloorForThisType.price / 1000000 : null
    console.log(`found floor for ${thisType}! floor is ${thisFloor}`)
    cnftFloorData[thisType] = { floor: thisFloor, timestamp: Date.now() }
  }

  return cnftFloorData

  // console.log('crawling jpg.store for all listings')
  // const jpgFetchedData = (await crawlJPG({ sold: false })).sort((a, b) => a.price_lovelace - b.price_lovelace)
  // console.log(`got ${jpgFetchedData.length} listings from jpg.store`)

  // for (const bear of bearsJsonFile.bears) {
  //   let thisFloor = null
  //   const thisType = bear.type

  //   for (const listing of jpgFetchedData) {
  //     const blockfrostAsset = blockfrostJsonFile.assets.find((item) => item.asset === listing.asset)

  //     if (!blockfrostAsset) {
  //       thisFloor = null
  //       break
  //     }

  //     if (blockfrostAsset.onchain_metadata.attributes.Type === thisType) {
  //       thisFloor = listing.price_lovelace / 1000000
  //       break
  //     }
  //   }

  //   console.log(`found floor for ${thisType}! floor is ${thisFloor}`)
  //   jpgFloorData[thisType] = { floor: thisFloor, timestamp: Date.now() }
  // }

  // console.log('comparing floors between cnft.io and jpg.store')

  // for (const bear of bearsJsonFile.bears) {
  //   const thisType = bear.type
  //   const thisJpgFloor = jpgFloorData[thisType].floor
  //   const thisCnftFloor = cnftFloorData[thisType].floor

  //   if (thisJpgFloor === null && thisCnftFloor === null) {
  //     console.log(`real floor for type ${thisType} is ${null} because none are listed`)
  //     floorData[thisType] = { floor: null, timestamp: Date.now() }
  //   } else if (thisJpgFloor === null && thisCnftFloor !== null) {
  //     console.log(`real floor for type ${thisType} is ${thisCnftFloor} from cnft.io`)
  //     floorData[thisType] = cnftFloorData[thisType]
  //   } else if (thisJpgFloor !== null && thisCnftFloor === null) {
  //     console.log(`real floor for type ${thisType} is ${thisJpgFloor} from jpg.store`)
  //     floorData[thisType] = jpgFloorData[thisType]
  //   } else if (thisJpgFloor < thisCnftFloor) {
  //     console.log(`real floor for type ${thisType} is ${thisJpgFloor} from jpg.store`)
  //     floorData[thisType] = jpgFloorData[thisType]
  //   } else if (thisCnftFloor < thisJpgFloor) {
  //     console.log(`real floor for type ${thisType} is ${thisCnftFloor} from cnft.io`)
  //     floorData[thisType] = cnftFloorData[thisType]
  //   } else if (thisCnftFloor === thisJpgFloor) {
  //     console.log(`real floor for type ${thisType} is ${thisCnftFloor} from both cnft.io and jpg.store`)
  //     floorData[thisType] = cnftFloorData[thisType]
  //   } else {
  //     console.error('unexpected result, no floor found')
  //   }
  // }

  // return floorData
}

module.exports = getBearsFloor
