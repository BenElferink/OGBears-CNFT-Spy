import { useState } from 'react'
import { useScreenSize } from '../contexts/ScreenSizeContext'
import AssetCard from './AssetCard'

const INCREASE = 15
const HEADER_HEIGHT_MOBILE = 150
const HEADER_HEIGHT_DESKTOP = 250

function MarketAssets({ data, extraHeightDesktop = 0, extraHeightMobile = 0 }) {
  const { isMobile } = useScreenSize()
  const [displayNum, setDisplayNum] = useState(INCREASE)

  const handleScroll = (e) => {
    const { scrollTop, scrollHeight, clientHeight } = e.target
    const isScrolledToBottom =
      Math.floor(scrollTop) === Math.floor(scrollHeight - clientHeight)

    if (isScrolledToBottom) {
      setDisplayNum((prev) => prev + INCREASE)
    }
  }

  return (
    <div
      className='scroll'
      onScroll={handleScroll}
      style={{
        width: '95vw',
        maxHeight: `calc(100vh - ${
          isMobile
            ? HEADER_HEIGHT_MOBILE + extraHeightMobile
            : HEADER_HEIGHT_DESKTOP + extraHeightDesktop
        }px)`,
        display: 'flex',
        alignItems: 'center',
        flexFlow: isMobile ? 'column nowrap' : 'row wrap',
        justifyContent: isMobile ? 'unset' : 'space-evenly',
      }}
    >
      {data.length ? (
        data.map(
          ({ assetId, name, price, rank, imageUrl, itemUrl, store }, idx) =>
            idx < displayNum ? (
              <AssetCard
                key={`markets-${store}-${assetId}`}
                name={name}
                price={price}
                rank={rank}
                imageSrc={imageUrl}
                itemUrl={itemUrl}
                spanArray={store ? [store] : []}
              />
            ) : null
        )
      ) : (
        <div
          style={{
            marginTop: '2rem',
            color: 'var(--yellow)',
            fontSize: '1.5rem',
          }}
        >
          No data...
        </div>
      )}
    </div>
  )
}

export default MarketAssets
