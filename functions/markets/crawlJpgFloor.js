const Axios = require('axios')
const { BEAR_POLICY_ID } = require('../../constants/policy-ids')

const JPG_URI = 'https://server.jpgstoreapis.com'

const crawlJpgFloor = (options = {}) => {
  const policyId = options.policyId ?? BEAR_POLICY_ID
  const size = options.size ?? 10000

  return new Promise((resolve, reject) => {
    Axios.get(
      `${JPG_URI}/search/tokens?policyIds=["${policyId}"]&saleType=buy-now&sortBy=price-low-to-high&verified=default&size=${size}`,
      {
        headers: { 'Content-Type': 'application/json' },
      }
    )
      .then((response) => resolve(response.data.tokens))
      .catch((error) => reject(error))
  })
}

module.exports = crawlJpgFloor
