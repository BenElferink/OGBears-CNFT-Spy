import { createContext, useContext, useEffect, useState } from 'react'
import axios from 'axios'
import bearsBlockfrostJsonFile from '../data/blockfrost/bears'
import bearsTraitsJsonFile from '../data/traits/bears'
import bearsRanksJsonFile from '../data/cnftToolsRanks/bears'
import bearsFloorJsonFile from '../data/floor/bears'
import cubsBlockfrostJsonFile from '../data/blockfrost/cubs'
import cubsTraitsJsonFile from '../data/traits/cubs'
import cubsRanksJsonFile from '../data/cnftToolsRanks/cubs'
import cubsFloorJsonFile from '../data/floor/cubs'
import { BEAR_POLICY_ID, CUB_POLICY_ID } from '../constants/policy-ids'

const LIVE_FLOOR_ENDPOINT = '/api/floor/'
const OPENCNFT_API = 'https://api.opencnft.io/1/policy/'

// init context
const DataContext = createContext()

// export the consumer
export function useData() {
  return useContext(DataContext)
}

// export the provider (handle all the logic here)
export function DataProvider({ children }) {
  const [cubMode, setCubMode] = useState(true)
  const [onChainData, setOnChainData] = useState({})
  const [bearsFloorData, setBearsFloorData] = useState(bearsFloorJsonFile)
  const [cubsFloorData, setCubsFloorData] = useState(cubsFloorJsonFile)

  const blockfrostData = cubMode ? cubsBlockfrostJsonFile : bearsBlockfrostJsonFile
  const traitsData = cubMode ? cubsTraitsJsonFile : bearsTraitsJsonFile
  const ranksData = cubMode ? cubsRanksJsonFile : bearsRanksJsonFile
  const floorData = cubMode ? cubsFloorData : bearsFloorData

  // Add LIVE floor data to the imported snapshots
  useEffect(() => {
    axios
      .get(LIVE_FLOOR_ENDPOINT + 'bears')
      .then(({ data }) =>
        setBearsFloorData((prev) => {
          const newState = { ...prev }

          Object.entries(data).forEach(([key, val]) => {
            newState[key].push({ ...val, timestamp: 'LIVE' })
          })

          return newState
        })
      )
      .catch((error) => console.error(error))

    axios
      .get(LIVE_FLOOR_ENDPOINT + 'cubs')
      .then(({ data }) =>
        setCubsFloorData((prev) => {
          const newState = { ...prev }

          Object.entries(data).forEach(([key, val]) => {
            newState[key].push({ ...val, timestamp: 'LIVE' })
          })

          return newState
        })
      )
      .catch((error) => console.error(error))
  }, []) // eslint-disable-line

  // Get on-chain data from opencnft.io
  useEffect(() => {
    axios
      .get(OPENCNFT_API + (cubMode ? CUB_POLICY_ID : BEAR_POLICY_ID))
      .then(({ data }) => setOnChainData(data))
      .catch((error) => console.error(error))

    // Example for "onChainData"
    // {
    //   "attribution": "NOTICE: © 2021 OpenCNFT. Just include the source of the data (opencnft.io) ;)",
    //   "policy": "a23836ef3b4d0ad3ed1c28bd30e754e208ae7ea0a23e809354d67e0d",
    //   "thumbnail": "ipfs://QmfZiV23oARUPcNogNj4qRZx9S7cywPwPsutEDpKyJKgWt",
    //   "total_volume": 622711000000,
    //   "first_sale": 1646150030,
    //   "total_tx": 4820,
    //   "total_assets_sold": 3581,
    //   "asset_minted": 7968,
    //   "asset_holders": 2301,
    //   "highest_sale": {
    //       "asset_name": "1363",
    //       "name": "a23836ef3b4d0ad3ed1c28bd30e754e208ae7ea0a23e809354d67e0d.1363",
    //       "price": 3899000000
    //   },
    //   "floor_price": 81000000,
    //   "floor_price_marketplace": "jpg.store"
    // }
  }, [cubMode]) // eslint-disable-line

  return (
    <DataContext.Provider
      value={{
        cubMode,
        setCubMode,
        onChainData,
        blockfrostData,
        traitsData,
        ranksData,
        floorData,
      }}
    >
      {children}
    </DataContext.Provider>
  )
}
