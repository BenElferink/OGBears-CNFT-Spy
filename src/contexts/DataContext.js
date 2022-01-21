import { createContext, useContext, useEffect, useState } from 'react'
import axios from 'axios'
import bearsJsonFile from '../data/bears'
import blockfrostJsonFile from '../data/blockfrost'
import getCurrentFloors from '../data/functions/getCurrentFloors'

const FLOOR_DATA_URI =
  'https://raw.githubusercontent.com/belferink1996/og-bears-cnft-spy/main/src/data/floor.json'

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
      .then((response) => {
        setFloorData(response.data)

        // then add LIVE floor data to the fetched snapshots
        getCurrentFloors(bearsData, blockfrostData)
          .then((obj) =>
            setFloorData((prev) => {
              const newState = { ...prev }

              Object.entries(obj).forEach(([key, val]) => {
                newState[key].push({ ...val, timestamp: 'LIVE' })
              })

              return newState
            }),
          )
          .catch((error) => console.error(error))
      })
      .catch((error) => console.error(error))
  }, []) // eslint-disable-line

  return (
    <DataContext.Provider value={{ bearsData, blockfrostData, floorData }}>
      {children}
    </DataContext.Provider>
  )
}
