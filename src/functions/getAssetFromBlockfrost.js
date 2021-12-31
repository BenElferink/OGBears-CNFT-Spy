import Axios from 'axios'
import toHex from './toHex'
import { BLOCKFROST_CARDANO_MAIN, BLOCKFROST_KEY, POLICY_ID } from '../constants'

async function getAssetFromBlockfrost(bearId) {
  try {
    const response = await Axios.get(
      `${BLOCKFROST_CARDANO_MAIN}/assets/${POLICY_ID}${toHex(`${bearId}`)}`,
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
