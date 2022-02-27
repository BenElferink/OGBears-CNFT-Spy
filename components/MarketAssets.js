import { useState } from 'react'
import { useScreenSize } from '../contexts/ScreenSizeContext'
import Loading from './Loading'
import AssetCard from './AssetCard'

const INCREASE = 15

function MarketAssets({ data }) {
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
        maxHeight: isMobile ? '60vh' : 'calc(100vh - 250px)',
        display: 'flex',
        flexFlow: isMobile ? 'column nowrap' : 'row wrap',
        alignItems: 'center',
        justifyContent: isMobile ? 'unset' : 'space-evenly',
      }}
    >
      {data.length ? (
        data.map(
          ({ assetId, name, price, imageUrl, itemUrl, store, date }, idx) =>
            idx < displayNum ? (
              <AssetCard
                key={`markets-${store}-${assetId}-${date}`}
                name={name}
                price={price}
                imageSrc={imageUrl}
                itemUrl={itemUrl}
                spanArray={[store]}
              />
            ) : null
        )
      ) : (
        <Loading />
      )}
    </div>
  )
}

export default MarketAssets
