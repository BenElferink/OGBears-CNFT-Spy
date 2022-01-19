import crawlCNFT from './crawlCNFT.js'
import { createRequire } from 'module'
const require = createRequire(import.meta.url)
const bearTypes = require('../bears.json')

const getCurrentFloorData = async () => {
  let page = 0
  let lastSearchedIndex = 0
  const preFetchedData = []
  const floorData = {}

  const findFloor = (bearType = '', index = 0) => {
    console.log(`searching floor for type ${bearType} from index ${index}`)

    // search pre-fetched data for floor price of this bear type
    // (reminder: data is fetched by sorted price, 1st item found is the floor)
    for (let i = index; i < preFetchedData.length; i++) {
      const preFetchedBear = preFetchedData[i]
      if (bearType === preFetchedBear.asset.metadata.attributes.Type) {
        return preFetchedBear
      }
    }

    lastSearchedIndex = preFetchedData.length - 1
    return null
  }

  // go through every bear in the list
  for (const bear of bearTypes.bears) {
    lastSearchedIndex = 0
    const thisType = bear.type
    let foundFloorForThisType = preFetchedData.length ? findFloor(thisType, lastSearchedIndex) : null

    while (!foundFloorForThisType) {
      try {
        // as long as the floor is not found, get more data from cnft
        page++
        console.log(`crawling cnft for type ${thisType} at page ${page}`)
        const fetchedData = await crawlCNFT({ sort: { price: 1 }, page })

        // in case none are listed
        if (!fetchedData.length && !foundFloorForThisType) {
          foundFloorForThisType = { price: null }
          break
        }

        if (preFetchedData.length) {
          // a verification method to add only new data to the end of the array
          const newBears = []
          for (let i = fetchedData.length - 1; i >= 0; i--) {
            if (fetchedData[i]._id === preFetchedData[preFetchedData.length - 1]._id) break
            newBears.unshift(fetchedData[i])
          }

          newBears.forEach((item) => preFetchedData.push(item))
        } else {
          fetchedData.forEach((item) => preFetchedData.push(item))
        }

        // after each time new data was recieved, search for the floor price again
        foundFloorForThisType = findFloor(thisType, lastSearchedIndex)
      } catch (error) {
        console.error(error)
      }
    }

    const thisFloor = foundFloorForThisType.price ? foundFloorForThisType.price / 1000000 : null
    console.log(`found floor for ${thisType}! floor is ${thisFloor}`)

    floorData[thisType] = { floor: thisFloor, timestamp: Date.now() }
  }

  return floorData
}

export default getCurrentFloorData
