import { createContext, useContext, useEffect, useState } from 'react'
import axios from 'axios'
import bearsJsonFile from '../data/bears'
import getCurrentFloorData from '../data/functions/getCurrentFloorData'
import { FLOOR_DATA_URL } from '../data/constants'

// init context
const FloorContext = createContext()

// export the consumer
export function useFloor() {
  return useContext(FloorContext)
}

// export the provider (handle all the logic here)
export function FloorProvider({ children }) {
  const [floorData, setFloorData] = useState(null)

  useEffect(() => {
    // get the 24h snapshots floor data
    axios.get(FLOOR_DATA_URL)
      .then((response) => {
        setFloorData(response.data)

        // then add LIVE floor data to the fetched snapshots
        getCurrentFloorData(bearsJsonFile)
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
  }, [])

  return (
    <FloorContext.Provider value={{ floorData }}>
      {children}
    </FloorContext.Provider>
  )
}
