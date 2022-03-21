// import { useState } from 'react'
// import { useMarket } from '../contexts/MarketContext'
// import { useData } from '../contexts/DataContext'
// import { useScreenSize } from '../contexts/ScreenSizeContext'
// import traits from '../data/traits'
// import { MenuItem, Select } from '@mui/material'
import Header from '../components/Header'
// import Toggle from '../components/Toggle'
// import Loading from '../components/Loading'
// import MarketAssets from '../components/MarketAssets'

// const BLANK = '-'

export default function Markets() {
  // const { isMobile } = useScreenSize()
  // const { blockfrostData } = useData()
  // const { listedAssets } = useMarket()
  // const [filters, setFilters] = useState({})
  // const [highToLow, setHighToLow] = useState(false)

  // const renderAssets = () => {
  //   const assetsWithMetaData = listedAssets.map((obj) => ({
  //     ...obj,
  //     attributes: blockfrostData.assets.find(
  //       ({ asset }) => asset === obj.assetId
  //     ).onchain_metadata.attributes,
  //   }))

  //   const filteredAssets = assetsWithMetaData.filter((obj) => {
  //     let isOk = true

  //     Object.entries(filters).forEach(([key, value]) => {
  //       if (value && value !== BLANK && obj.attributes[key] !== value) {
  //         isOk = false
  //       }
  //     })

  //     return isOk
  //   })

  //   const sortedAssets = filteredAssets.sort((a, b) =>
  //     highToLow ? b.price - a.price : a.price - b.price
  //   )

  //   return sortedAssets
  // }

  return (
    <main className='home-main'>
      <Header />

      <p
        style={{
          maxWidth: '420px',
          color: 'var(--yellow)',
          textAlign: 'center',
          fontSize: '1.2rem',
        }}
      >
        <strong>Temporarily down!</strong>
        <br />
        <br />
        Due to recent jpg.store migrations; some API's have been affected, and
        are currently under maintenance.
        <br />
        <br />
        Please bear 🐻 with me as I fix things and make some improvements to the
        community API!
        <br />
        <br />
        Seen you soon...
      </p>

      {/* <div className='flex-row' style={{ flexWrap: 'wrap' }}>
        {Object.entries(traits).map(([key, val]) => (
          <Select
            key={`select-${key}`}
            value={filters[key] ?? BLANK}
            onChange={(e) =>
              setFilters((prev) => ({ ...prev, [key]: e.target.value }))
            }
            style={{
              fontSize: isMobile ? '0.8rem' : '1rem',
              backgroundColor:
                filters[key] && filters[key] !== BLANK
                  ? 'var(--yellow)'
                  : 'unset',
            }}
          >
            <MenuItem value={BLANK}>{key}</MenuItem>
            {val.map(({ value, percent }) => (
              <MenuItem key={`select-${key}-item-${value}`} value={value}>
                {percent.toFixed(2)}% - {value}
              </MenuItem>
            ))}
          </Select>
        ))}
        <div
          style={{
            width: '150px',
            height: '58px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'var(--opacity-white)',
            border: '1px solid black',
            borderRadius: '4px',
            fontSize: isMobile ? '0.8rem' : '1rem',
          }}
        >
          <Toggle
            labelLeft='Asc'
            labelRight='Desc'
            state={{
              value: highToLow,
              setValue: setHighToLow,
            }}
          />
        </div>
      </div>

      {listedAssets.length ? (
        <MarketAssets
          data={renderAssets()}
          extraHeightMobile={220}
          extraHeightDesktop={58}
        />
      ) : (
        <Loading />
      )} */}
    </main>
  )
}
