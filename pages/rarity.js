import Header from '../components/Header'
import { useState } from 'react'
import { useData } from '../contexts/DataContext'
import { useScreenSize } from '../contexts/ScreenSizeContext'
import getImageFromIPFS from '../functions/getImageFromIPFS'
import MarketAssets from '../components/MarketAssets'
import Toggle from '../components/Toggle'
import { TextField } from '@mui/material'

export default function Rarity() {
  const { isMobile } = useScreenSize()
  const { blockfrostData, cnftToolsRanks } = useData()
  const [highToLow, setHighToLow] = useState(false)
  const [search, setSearch] = useState('')

  const renderAssets = () => {
    const assets = blockfrostData.assets.map((obj) => {
      const bearId = obj.onchain_metadata.name.replace('BEAR', '')
      const rank = Number(cnftToolsRanks[bearId])

      return {
        assetId: obj.asset,
        bearId,
        name: obj.onchain_metadata.name,
        rank,
        imageUrl: getImageFromIPFS(obj.onchain_metadata.image),
        itemUrl: `https://cnft.tools/ogbears/${bearId}`,
      }
    })

    const filteredAssets = assets.filter(
      (obj) => !search || obj.bearId === search
    )

    const sortedAssets = filteredAssets.sort((a, b) =>
      highToLow ? b.rank - a.rank : a.rank - b.rank
    )

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
          <TextField
            placeholder='Bear #ID'
            value={search}
            onChange={(e) => setSearch(String(e.target.value))}
          />
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
      </div>

      <MarketAssets
        data={renderAssets()}
        extraHeightMobile={220}
        extraHeightDesktop={58}
      />
    </main>
  )
}
