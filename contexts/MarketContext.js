import { createContext, useContext, useEffect, useState } from 'react'
import axios from 'axios'

const CNFT_LISTED_URI = '/api/listings/cnft'
const CNFT_SOLD_URI = '/api/listings/cnft?sold=true'
const JPG_LISTED_URI = '/api/listings/jpg'
const JPG_SOLD_URI = '/api/listings/jpg?sold=true'

// init context
const MarketContext = createContext()

// export the consumer
export function useMarket() {
  return useContext(MarketContext)
}

// export the provider (handle all the logic here)
export function MarketProvider({ children }) {
  const [listedAssets, setListedAssets] = useState([])
  const [soldAssets, setSoldAssets] = useState([])

  const getCnftItems = async ({ sold }) => {
    let items = []

    if (sold) {
      try {
        const res = (await axios.get(CNFT_SOLD_URI)).data
        items = items.concat(res)
      } catch (error) {
        console.error(error)
      }
    } else {
      try {
        const res = (await axios.get(CNFT_LISTED_URI)).data
        items = items.concat(res)
      } catch (error) {
        console.error(error)
      }
    }

    return items
  }

  const getJpgItems = async ({ sold }) => {
    let items = []

    if (sold) {
      try {
        const res = (await axios.get(JPG_SOLD_URI)).data
        items = items.concat(res)
      } catch (error) {
        console.error(error)
      }
    } else {
      try {
        const res = (await axios.get(JPG_LISTED_URI)).data
        items = items.concat(res)
      } catch (error) {
        console.error(error)
      }
    }

    return items
  }

  const fetchAndSetListed = () => {
    // Get all LIVE listings from marketplaces
    getJpgItems({ sold: false }).then((jpgItems) => {
      setListedAssets(jpgItems)
      getCnftItems({ sold: false }).then((cnftItems) => {
        setListedAssets((prev) =>
          [...prev, ...cnftItems].sort(
            (a, b) => new Date(b.date) - new Date(a.date)
          )
        )
      })
    })
  }

  const fetchAndSetSold = () => {
    // Get all SOLD listings from marketplaces
    getJpgItems({ sold: true }).then((jpgItems) => {
      setSoldAssets(jpgItems)
      getCnftItems({ sold: true }).then((cnftItems) => {
        setSoldAssets((prev) =>
          [...prev, ...cnftItems].sort(
            (a, b) => new Date(b.date) - new Date(a.date)
          )
        )
      })
    })
  }

  useEffect(() => {
    fetchAndSetListed()
    fetchAndSetSold()
  }, []) // eslint-disable-line

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
