const Axios = require('axios')
const { BEAR_POLICY_ID } = require('../../constants/policy-ids')

const JPG_URI = 'https://server.jpgstoreapis.com'

const crawlJPG = (options = {}) => {
  const policyId = options.policyId ?? BEAR_POLICY_ID
  const maxSize = 100
  const uri = `${JPG_URI}/search/tokens?policyIds=["${policyId}"]&verified=default&listingTypes=["SINGLE_ASSET"]&saleType=buy-now&sortBy=price-low-to-high&size=${maxSize}`

  console.log('crawling jpg.store')

  return new Promise(async (resolve, reject) => {
    console.log(`Fetching listings from jpg.store for policy ID ${policyId}`)

    try {
      let totalToFetch = 0
      let pagination = {}
      let fetchedListings = []

      for (let i = 0; true; i++) {
        const { data } = await Axios.get(`${uri}&pagination=${JSON.stringify(pagination)}`, {
          headers: {
            'Content-Type': 'application/json',
            'Accept-Encoding': 'application/json',
          },
        })

        // only on 1st loop
        if (!totalToFetch) {
          totalToFetch = data.pagination.total
        }

        // listings changed, reset and start again
        if (totalToFetch !== data.pagination.total) {
          totalToFetch = 0
          pagination = {}
          fetchedListings = []
        }

        // add paginated data to fetched data
        else if (fetchedListings.length < totalToFetch) {
          pagination = data.pagination
          fetchedListings = fetchedListings.concat(data.tokens)

          // all paginated tiems fetched, break loop
          if (fetchedListings.length >= totalToFetch) {
            break
          }
        }
      }

      console.log(`Fetched ${fetchedListings.length} listings from jpg.store`)

      return resolve(fetchedListings)
    } catch (e) {
      return reject(e)
    }
  })
}

module.exports = crawlJPG
