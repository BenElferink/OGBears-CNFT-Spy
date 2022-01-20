import Axios from 'axios'
import { BEARS_POLICY_ID } from '../constants/index.js'

const JPG_URL = 'https://jpg.store/api/policy'

const crawlJPG = (options = {}) => {
  const policyId = options.policyId ?? BEARS_POLICY_ID
  const sold = options.sold ?? false

  return new Promise((resolve, reject) => {
    Axios.get(`${JPG_URL}/${policyId}/${sold ? 'sales' : 'listings'}`, {
      headers: { 'Content-Type': 'application/json' },
    })
      .then((response) => resolve(response.data))
      .catch((error) => reject(error))
  })
}

export default crawlJPG
