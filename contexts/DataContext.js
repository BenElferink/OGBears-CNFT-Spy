import { createContext, useContext, useEffect, useState } from 'react'
import axios from 'axios'
import bearsJsonFile from '../data/bears'
import blockfrostJsonFile from '../data/blockfrost'
import cnftToolsRanksJsonFile from '../data/cnftToolsRanks'
import floorJsonFile from '../data/floor'
import { BEAR_POLICY_ID } from '../constants/policy-ids'

// const FLOOR_DATA_URI = 'https://raw.githubusercontent.com/belferink1996/og-bears-cnft-spy/main/data/floor.json'
const FLOOR_DATA_LIVE_URI = '/api/floor'
const ON_CHAIN_DATA_URI = `https://api.opencnft.io/1/policy/${BEAR_POLICY_ID}`

// init context
const DataContext = createContext()

// export the consumer
export function useData() {
  return useContext(DataContext)
}

// export the provider (handle all the logic here)
export function DataProvider({ children }) {
  const bearsData = bearsJsonFile
  const blockfrostData = blockfrostJsonFile
  const cnftToolsRanks = cnftToolsRanksJsonFile
  const [floorData, setFloorData] = useState(floorJsonFile)
  const [onChainData, setOnChainData] = useState({})

  useEffect(() => {
    // Add LIVE floor data to the imported snapshots
    axios
      .get(FLOOR_DATA_LIVE_URI)
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

    // Get on-chain data from opnecnft.op
    axios
      .get(ON_CHAIN_DATA_URI)
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
        bearsData,
        blockfrostData,
        cnftToolsRanks,
        floorData,
        onChainData,
      }}
    >
      {children}
    </DataContext.Provider>
  )
}
