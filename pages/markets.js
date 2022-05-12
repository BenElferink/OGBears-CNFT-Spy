import { useState } from 'react'
import { useMarket } from '../contexts/MarketContext'
import { useData } from '../contexts/DataContext'
import { useScreenSize } from '../contexts/ScreenSizeContext'
import { MenuItem, Select, TextField } from '@mui/material'
import Header from '../components/Header'
import Toggle from '../components/Toggle'
import Loading from '../components/Loading'
import MarketAssets from '../components/MarketAssets'

const BLANK = '-'

export default function Markets() {
  const { isMobile } = useScreenSize()
  const { cubMode, blockfrostData, traitsData } = useData()
  const { listedAssets } = useMarket()

  const [search, setSearch] = useState('')
  const [highToLow, setHighToLow] = useState(false)
  const [filters, setFilters] = useState({})

  const renderAssets = () => {
    const assets = listedAssets.map((obj) => {
      const foundBlockFrost = blockfrostData.assets.find(({ asset }) => asset === obj.assetId)
      const bearId = foundBlockFrost.onchain_metadata.name.replace(cubMode ? 'OGBears Cub #' : 'BEAR', '')

      return {
        ...obj,
        bearId,
        attributes: foundBlockFrost.onchain_metadata.attributes,
      }
    })

    const filteredAssets = assets.filter((obj) => {
      let isOk = false

      if (!search || !Object.keys(filters).length) {
        isOk = true
      } else if (search && obj.bearId.indexOf(search) === 0) {
        isOk = true
      }

      Object.entries(filters).forEach(([key, value]) => {
        if (value && value !== BLANK && obj.attributes[key] !== value) {
          isOk = false
        }
      })

      return isOk
    })

    const sortedAssets = filteredAssets.sort((a, b) => (highToLow ? b.price - a.price : a.price - b.price))

    return sortedAssets
  }

  const styles = {
    filter: {
      width: '150px',
      height: '58px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: 'var(--opacity-white)',
      border: '1px solid black',
      borderRadius: '4px',
      fontSize: isMobile ? '0.8rem' : '1rem',
    },
  }

  return (
    <main className='home-main'>
      <Header />

      <div className='flex-row' style={{ flexWrap: 'wrap' }}>
        <div style={styles.filter}>
          <TextField placeholder='Bear #ID' value={search} onChange={(e) => setSearch(String(e.target.value))} />
        </div>

        <div style={styles.filter}>
          <Toggle
            labelLeft='Asc'
            labelRight='Desc'
            state={{
              value: highToLow,
              setValue: setHighToLow,
            }}
          />
        </div>

        {Object.entries(traitsData.traits).map(([key, val]) => (
          <Select
            key={`select-${key}`}
            value={filters[key] ?? BLANK}
            onChange={(e) => setFilters((prev) => ({ ...prev, [key]: e.target.value }))}
            style={{
              fontSize: isMobile ? '0.8rem' : '1rem',
              backgroundColor: filters[key] && filters[key] !== BLANK ? 'var(--yellow)' : 'unset',
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
      </div>

      {listedAssets.length ? <MarketAssets data={renderAssets()} extraHeightMobile={220} extraHeightDesktop={58} /> : <Loading />}
    </main>
  )
}
