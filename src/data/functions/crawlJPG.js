import Axios from 'axios'
import { OGB_POLICY_ID } from '../constants/OGB_POLICY_ID.js'

const JPG_URI = 'https://jpg.store/api/policy'

const crawlJPG = (options = {}) => {
  const policyId = options.policyId ?? OGB_POLICY_ID
  const sold = options.sold ?? false

  return new Promise((resolve, reject) => {
    Axios.get(`${JPG_URI}/${policyId}/${sold ? 'sales' : 'listings'}`, {
      headers: { 'Content-Type': 'application/json' },
    })
      .then((response) => resolve(response.data))
      .catch((error) => reject(error))
  })
}

export default crawlJPG
