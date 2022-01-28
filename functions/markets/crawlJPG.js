const Axios = require('axios')
const policyIds = require('../../constants/policy-ids')

const JPG_URI = 'https://jpg.store/api/policy'

const crawlJPG = (options = {}) => {
  const policyId = options.policyId ?? policyIds.OGB_POLICY_ID
  const sold = options.sold ?? false

  return new Promise((resolve, reject) => {
    Axios.get(`${JPG_URI}/${policyId}/${sold ? 'sales' : 'listings'}`, {
      headers: { 'Content-Type': 'application/json' },
    })
      .then((response) => resolve(response.data))
      .catch((error) => reject(error))
  })
}

module.exports = crawlJPG
