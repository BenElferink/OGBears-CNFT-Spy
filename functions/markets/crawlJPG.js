const Axios = require('axios')
const { BEAR_POLICY_ID } = require('../../constants/policy-ids')

const JPG_URI = 'https://server.jpgstoreapis.com'

const crawlJPG = (options = {}) => {
  const policyId = options.policyId ?? BEAR_POLICY_ID
  const size = options.size ?? 10000

  return new Promise((resolve, reject) => {
    console.log('crawling jpg.store')

    Axios.get(`${JPG_URI}/search/tokens?policyIds=["${policyId}"]&saleType=buy-now&sortBy=price-low-to-high&verified=default&size=${size}`, {
      headers: { 'Content-Type': 'application/json' },
    })
      .then((response) => {
        const payload = response.data.tokens
        console.log(`got ${payload.length} items from jpg.store`)

        return resolve(payload)
      })
      .catch((error) => {
        console.error(error)

        return reject(error)
      })
  })
}

module.exports = crawlJPG
