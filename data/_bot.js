const cron = require('node-cron')
const Axios = require('axios')
const fs = require('fs')
const { exec } = require('child_process')
const bearsData = require('./bears.json')

const ENDPOINT = 'https://api.cnft.io/market/listings'

const crawlCNFT = (options = {}) => {
  const payload = {
    project: options.project ?? 'OG Bears',
    types: options.types ?? ['listing', 'offer'],
    search: options.search ?? undefined,
    sort: options.sort ?? undefined,
    page: options.page ?? 1,
    priceMin: options.priceMin ?? 0,
    priceMax: options.priceMax ?? undefined,
    verified: options.verified ?? true,
    nsfw: options.nsfw ?? false,
    sold: options.sold ?? false,
  }

  return new Promise((resolve, reject) => {
    Axios.post(ENDPOINT, payload, { headers: { 'Content-Type': 'application/json' } })
      .then((response) => resolve(response.data.results))
      .catch((error) => reject(error))
  })
}

function runCronJob() {
  console.log('running cron job')

  const newDate = new Date()
  newDate.setHours(0)
  newDate.setMinutes(0)
  newDate.setSeconds(0)
  newDate.setMilliseconds(0)
  const timestamp = newDate.getTime()

  // manage git pull
  exec('cd .. && git fetch && git pull --no-rebase', async (gitPullError, gitPullStdout, gitPullStderr) => {
    let page = 0
    let lastSearchedIndex = 0
    const preFetchedData = []

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
    for (const bear of bearsData.bears) {
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

      try {
        // save floor data to local database
        const floorData = JSON.parse(fs.readFileSync('./floor-data.json', 'utf8'))
        floorData[thisType].push({ floor: thisFloor, timestamp })
        while (floorData[thisType].length > 30) floorData[thisType].shift()
        fs.writeFileSync('./floor-data.json', JSON.stringify(floorData), 'utf8')
      } catch (error) {
        console.error(error)
      }
    }

    // manage git push
    exec(
      'cd .. && git add data/floor-data.json && git commit -m "🤖 BOT: updated database" && git push',
      (gitPushError, gitPushStdout, gitPushStderr) => {
        console.log('cron job finished')
      },
    )
  })
}

cron.schedule('0 0 * * *', runCronJob, {
  scheduled: true,
  timezone: 'Asia/Jerusalem',
})
