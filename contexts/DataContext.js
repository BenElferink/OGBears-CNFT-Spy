import { createContext, useContext, useEffect, useState } from 'react'
import axios from 'axios'
import bearsBlockfrostJsonFile from '../data/blockfrost/bears'
import bearsTraitsJsonFile from '../data/traits/bears'
import bearsRanksJsonFile from '../data/cnftToolsRanks/bears'
import bearsFloorJsonFile from '../data/floor/bears'
import { BEAR_POLICY_ID } from '../constants/policy-ids'

const BEAR_FLOOR_DATA_LIVE_URI = '/api/floor/bears'
const BEAR_ON_CHAIN_DATA_URI = `https://api.opencnft.io/1/policy/${BEAR_POLICY_ID}`

// init context
const DataContext = createContext()

// export the consumer
export function useData() {
  return useContext(DataContext)
}

// export the provider (handle all the logic here)
export function DataProvider({ children }) {
  const bearsBlockfrostData = bearsBlockfrostJsonFile
  const bearsTraitsData = bearsTraitsJsonFile
  const bearsRanksData = bearsRanksJsonFile
  const [floorData, setFloorData] = useState(bearsFloorJsonFile)
  const [onChainData, setOnChainData] = useState({})

  useEffect(() => {
    // Add LIVE floor data to the imported snapshots
    axios
      .get(BEAR_FLOOR_DATA_LIVE_URI)
      .then(({ data }) =>
        setFloorData((prev) => {
          const newState = { ...prev }

          Object.entries(data).forEach(([key, val]) => {
            newState[key].push({ ...val, timestamp: 'LIVE' })
          })

          return newState
        })
      )
      .catch((error) => console.error(error))

    // Get on-chain data from opencnft.io
    axios
      .get(BEAR_ON_CHAIN_DATA_URI)
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
  }, []) // eslint-disable-line

  return (
    <DataContext.Provider
      value={{
        bearsTraitsData,
        bearsBlockfrostData,
        bearsRanksData,
        floorData,
        onChainData,
      }}
    >
      {children}
    </DataContext.Provider>
  )
}
