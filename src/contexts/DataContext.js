import { createContext, useContext, useEffect, useState } from 'react'
import axios from 'axios'
import bearsJsonFile from '../server/data/bears'
import blockfrostJsonFile from '../server/data/blockfrost'

const FLOOR_DATA_URI =
  'https://raw.githubusercontent.com/belferink1996/og-bears-cnft-spy/main/src/server/data/floor.json'

const FLOOR_DATA_LIVE_URI = 'https://og-bears-cnft-spy.vercel.app/current-floor'
const CNFT_LISTED_URI = 'https://og-bears-cnft-spy.vercel.app/cnft-listed'
const CNFT_SOLD_URI = 'https://og-bears-cnft-spy.vercel.app/cnft-sold'
const JPG_LISTED_URI = 'https://og-bears-cnft-spy.vercel.app/jpg-listed'
const JPG_SOLD_URI = 'https://og-bears-cnft-spy.vercel.app/jpg-sold'

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
  const [floorData, setFloorData] = useState(null)

  useEffect(() => {
    // get the 24h snapshots floor data
    axios
      .get(FLOOR_DATA_URI)
      .then(({ data }) => {
        setFloorData(data)

        // then add LIVE floor data to the fetched snapshots
        axios
          .get(FLOOR_DATA_LIVE_URI)
          .then(({ data }) =>
            setFloorData((prev) => {
              const newState = { ...prev }

              Object.entries(data).forEach(([key, val]) => {
                newState[key].push({ ...val, timestamp: 'LIVE' })
              })

              return newState
            }),
          )
          .catch((error) => console.error(error))
      })
      .catch((error) => console.error(error))
  }, []) // eslint-disable-line

  const getCnftListed = async () => {
    try {
      return (await axios.get(CNFT_LISTED_URI)).data
    } catch (error) {
      console.error(error)
      return []
    }
  }

  const getCnftSold = async () => {
    try {
      return (await axios.get(CNFT_SOLD_URI)).data
    } catch (error) {
      console.error(error)
      return []
    }
  }

  const getJpgListed = async () => {
    try {
      return (await axios.get(JPG_LISTED_URI)).data
    } catch (error) {
      console.error(error)
      return []
    }
  }

  const getJpgSold = async () => {
    try {
      return (await axios.get(JPG_SOLD_URI)).data
    } catch (error) {
      console.error(error)
      return []
    }
  }

  return (
    <DataContext.Provider
      value={{
        bearsData,
        blockfrostData,
        floorData,
        getCnftListed,
        getCnftSold,
        getJpgListed,
        getJpgSold,
      }}>
      {children}
    </DataContext.Provider>
  )
}
