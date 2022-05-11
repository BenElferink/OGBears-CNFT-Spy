const Axios = require('axios')
const { BEAR_POLICY_ID } = require('../../constants/policy-ids')

const getJpgItems = (options = {}) => {
  const policyId = options.policyId ?? BEAR_POLICY_ID
  const sold = options.sold ?? false
  const page = options.page ?? 1

  return new Promise((resolve, reject) => {
    console.log('crawling jpg.store')

    Axios.get(`https://server.jpgstoreapis.com/policy/${policyId}/${sold ? 'sales' : 'listings'}?page=${page}`, {
      headers: { 'Content-Type': 'application/json' },
    })
      .then((response) => {
        const payload = response.data
        console.log(`got ${payload.length} items from jpg.store`)

        return resolve(payload)
      })
      .catch((error) => {
        console.error(error)

        return reject(error)
      })
  })
}

module.exports = getJpgItems
