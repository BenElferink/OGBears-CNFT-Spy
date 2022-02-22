import { useState } from 'react'
import { useScreenSize } from '../contexts/ScreenSizeContext'
import { useMarket } from '../contexts/MarketContext'
import { Typography } from '@mui/material'
import Loading from './Loading'
import AssetCard from './AssetCard'

function ScrollableMarketAssetsList({ sold = false }) {
  const { isDesktop } = useScreenSize()
  const { listedAssets, soldAssets } = useMarket()
  const [displayNum, setDisplayNum] = useState(10)

  const title = sold ? 'Recently Sold' : 'Recently Listed'
  const data = sold ? soldAssets : listedAssets

  const handleScroll = (e) => {
    const { scrollTop, scrollHeight, clientHeight, scrollLeft, clientWidth, scrollWidth } = e.target
    const isScrolledToBottom = Math.floor(scrollTop) === Math.floor(scrollHeight - clientHeight)
    const isScrolledToRight = Math.floor(scrollLeft) === Math.floor(scrollWidth - clientWidth)

    if ((isDesktop && isScrolledToBottom) || (!isDesktop && isScrolledToRight)) {
      setDisplayNum((prev) => prev + 10)
    }
  }

  return (
    <div className='listings-container'>
      <Typography
        variant='h4'
        component='div'
        sx={{
          margin: '1rem 0',
          fontFamily: 'IndieFlower',
          fontWeight: 'bold',
          color: 'whitesmoke',
          textShadow: '-1px 1px 3px black',
        }}>
        {title}
      </Typography>

      <div className='scroll listings' onScroll={handleScroll}>
        {data.length ? (
          data.map(({ assetId, name, price, imageUrl, itemUrl, store, date }, idx) =>
            idx < displayNum ? (
              <AssetCard
                key={`${store}-${sold ? 'sold' : 'listed'}-${assetId}-${date}`}
                name={name}
                price={price}
                imageSrc={imageUrl}
                itemUrl={itemUrl}
                spanArray={[store, `${sold ? 'Sold:' : 'Listed:'} ${new Date(date).toLocaleString()}`]}
              />
            ) : null,
          )
        ) : (
          <Loading />
        )}
      </div>
    </div>
  )
}

export default ScrollableMarketAssetsList
