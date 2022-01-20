import Axios from 'axios'
import { BLOCKFROST_CARDANO_MAIN, BLOCKFROST_KEY, BEARS_POLICY_ID } from '../constants/index.js'

const toHex = (str) => {
  var result = ''
  for (var i = 0; i < str.length; i++) {
    result += str.charCodeAt(i).toString(16)
  }
  return result
}

const getAssetFromBlockfrost = async (bearId) => {
  try {
    const response = await Axios.get(
      `${BLOCKFROST_CARDANO_MAIN}/assets/${BEARS_POLICY_ID}${toHex(`${bearId}`)}`,
      {
        headers: {
          project_id: BLOCKFROST_KEY,
        },
      },
    )

    return response.data
  } catch (error) {
    console.error(error)
    return null
  }
}

export default getAssetFromBlockfrost
