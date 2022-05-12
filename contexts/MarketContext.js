import { createContext, useContext, useEffect, useState } from 'react'
import axios from 'axios'
import { useData } from './DataContext'

// init context
const MarketContext = createContext()

// export the consumer
export function useMarket() {
  return useContext(MarketContext)
}

// export the provider (handle all the logic here)
export function MarketProvider({ children }) {
  const { cubMode } = useData()
  const [listedBears, setListedBears] = useState([])
  const [listedCubs, setListedCubs] = useState([])
  const [soldBears, setSoldBears] = useState([])
  const [soldCubs, setSoldCubs] = useState([])

  const fetchListings = async ({ type = 'bears', sold, page }) => {
    try {
      const res = (await axios.get(`/api/listings/${type}?sold=${sold}&page=${page}`)).data
      return res
    } catch (error) {
      console.error(error)
      return []
    }
  }

  const fetchAndSetListed = () => {
    // Get all LIVE listings from marketplaces
    fetchListings({ type: 'bears', sold: false, page: 0 }).then((jpgItems) => {
      setListedBears(jpgItems.sort((a, b) => new Date(b.date) - new Date(a.date)))
    })

    fetchListings({ type: 'cubs', sold: false, page: 0 }).then((jpgItems) => {
      setListedCubs(jpgItems.sort((a, b) => new Date(b.date) - new Date(a.date)))
    })
  }

  const fetchAndSetSold = () => {
    // Get all SOLD listings from marketplaces
    fetchListings({ type: 'bears', sold: true, page: 0 }).then((jpgItems) => {
      setSoldBears(jpgItems.sort((a, b) => new Date(b.date) - new Date(a.date)))
    })

    fetchListings({ type: 'cubs', sold: true, page: 0 }).then((jpgItems) => {
      setSoldCubs(jpgItems.sort((a, b) => new Date(b.date) - new Date(a.date)))
    })
  }

  useEffect(() => {
    fetchAndSetListed()
    fetchAndSetSold()
  }, []) // eslint-disable-line

  const listedAssets = cubMode ? listedCubs : listedBears
  const soldAssets = cubMode ? soldCubs : soldBears

  return (
    <MarketContext.Provider
      value={{
        listedAssets,
        soldAssets,
      }}
    >
      {children}
    </MarketContext.Provider>
  )
}
