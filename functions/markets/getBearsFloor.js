const crawlCNFT = require('./crawlCNFT')
const crawlJPG = require('./crawlJPG')

const getBearsFloor = async (bearsJsonFile, blockfrostJsonFile) => {
  const floorData = {}
  const cnftFloorData = {}
  const jpgFloorData = {}

  const cnftPreFetchedData = []
  let cnftLastSearchedIndex = 0
  let cnftPage = 1

  const findCnftFloor = (bearType = '', index = 0) => {
    console.log(`searching cnft.io floor for type ${bearType} from index ${index}`)

    // search pre-fetched data for floor price of this bear type
    // (reminder: data is fetched by sorted price, 1st item found is the floor)
    for (let i = index; i < cnftPreFetchedData.length; i++) {
      const listing = cnftPreFetchedData[i]

      if (bearType === listing.assets[0].metadata.attributes.Type) {
        return listing.price / 1000000
      }
    }

    cnftLastSearchedIndex = cnftPreFetchedData.length - 1
    return null
  }

  // go through every bear in the list
  for (const { type } of bearsJsonFile.bears) {
    cnftLastSearchedIndex = 0
    let thisFloor = cnftPreFetchedData.length ? findCnftFloor(type, cnftLastSearchedIndex) : null

    while (!thisFloor) {
      try {
        // as long as the floor is not found, get more data from cnft
        console.log(`crawling cnft.io for type ${type} at page ${cnftPage}`)
        const cnftFetchedData = await crawlCNFT({ sold: false, sort: { price: 1 }, page: cnftPage })
        console.log(`got ${cnftFetchedData.length} listings from cnft.io for page ${cnftPage}`)

        // in case none are listed
        if (!cnftFetchedData.length && !thisFloor) {
          thisFloor = null
          break
        }

        if (cnftPreFetchedData.length) {
          // a verification method to add only new data to the end of the array
          const newListings = []
          for (let i = cnftFetchedData.length - 1; i >= 0; i--) {
            if (cnftFetchedData[i]._id === cnftPreFetchedData[cnftPreFetchedData.length - 1]._id) break
            newListings.unshift(cnftFetchedData[i])
          }

          newListings.forEach((item) => cnftPreFetchedData.push(item))
        } else {
          cnftFetchedData.forEach((item) => cnftPreFetchedData.push(item))
        }

        // after each time new data was recieved, search for the floor price again
        thisFloor = findCnftFloor(type, cnftLastSearchedIndex)
        cnftPage++
      } catch (error) {
        console.error(error)
      }
    }

    console.log(`found cnft.io floor for ${type}! floor is ${thisFloor}`)
    cnftFloorData[type] = { floor: thisFloor, timestamp: Date.now() }
  }

  let jpgFetchedData = []

  for (let i = 0; true; i++) {
    console.log(`crawling jpg.store for listings on page ${i}`)
    const data = await crawlJPG({ sold: false, page: i })
    console.log(`got ${data.length} listings from jpg.store`)

    if (!data.length) {
      break
    }

    jpgFetchedData = jpgFetchedData.concat(data)
  }

  jpgFetchedData = jpgFetchedData.sort((a, b) => a.price_lovelace - b.price_lovelace)

  for (const { type } of bearsJsonFile.bears) {
    let thisFloor = null

    for (const listing of jpgFetchedData) {
      const blockfrostAsset = blockfrostJsonFile.assets.find((item) => item.asset === listing.asset_id)

      if (!blockfrostAsset) {
        thisFloor = null
        break
      }

      if (blockfrostAsset.onchain_metadata.attributes.Type === type) {
        thisFloor = listing.price_lovelace / 1000000
        break
      }
    }

    console.log(`found floor for ${type}! floor is ${thisFloor}`)
    jpgFloorData[type] = { floor: thisFloor, timestamp: Date.now() }
  }

  console.log('comparing floors between cnft.io and jpg.store')

  for (const { type } of bearsJsonFile.bears) {
    const thisJpgFloor = jpgFloorData[type].floor
    const thisCnftFloor = cnftFloorData[type].floor

    if (thisJpgFloor === null && thisCnftFloor === null) {
      console.log(`real floor for type ${type} is ${null} because none are listed`)
      floorData[type] = { floor: null, timestamp: Date.now() }
    } else if (thisJpgFloor === null && thisCnftFloor !== null) {
      console.log(`real floor for type ${type} is ${thisCnftFloor} from cnft.io`)
      floorData[type] = cnftFloorData[type]
    } else if (thisJpgFloor !== null && thisCnftFloor === null) {
      console.log(`real floor for type ${type} is ${thisJpgFloor} from jpg.store`)
      floorData[type] = jpgFloorData[type]
    } else if (thisJpgFloor < thisCnftFloor) {
      console.log(`real floor for type ${type} is ${thisJpgFloor} from jpg.store`)
      floorData[type] = jpgFloorData[type]
    } else if (thisCnftFloor < thisJpgFloor) {
      console.log(`real floor for type ${type} is ${thisCnftFloor} from cnft.io`)
      floorData[type] = cnftFloorData[type]
    } else if (thisCnftFloor === thisJpgFloor) {
      console.log(`real floor for type ${type} is ${thisCnftFloor} from both cnft.io and jpg.store`)
      floorData[type] = cnftFloorData[type]
    } else {
      console.error('unexpected result, no floor found')
    }
  }

  return floorData
}

module.exports = getBearsFloor
