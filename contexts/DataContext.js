import { createContext, useContext, useEffect, useState } from 'react'
import axios from 'axios'
import bearsJsonFile from '../data/bears'
import blockfrostJsonFile from '../data/blockfrost'
import floorJsonFile from '../data/floor'

// const FLOOR_DATA_URI = 'https://raw.githubusercontent.com/belferink1996/og-bears-cnft-spy/main/data/floor.json'
const FLOOR_DATA_LIVE_URI = '/api/floor'

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
  const [floorData, setFloorData] = useState(floorJsonFile)

  useEffect(() => {
    // Sdd LIVE floor data to the imported snapshots
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
  }, []) // eslint-disable-line

  return (
    <DataContext.Provider
      value={{
        bearsData,
        blockfrostData,
        floorData,
      }}
    >
      {children}
    </DataContext.Provider>
  )
}
