import { useEffect, useState } from 'react'
import { useScreenSize } from '../contexts/ScreenSizeContext'
import { useData } from '../contexts/DataContext'
import { Typography } from '@mui/material'
import Loading from './Loading'
import ListItem from './ListItem'

function Listings({ title = 'Recently Sold', sold = true }) {
  const { isDesktop } = useScreenSize()
  const { getCnftItems, getJpgItems } = useData()

  const [data, setData] = useState([])
  const [displayNum, setDisplayNum] = useState(10)

  useEffect(() => {
    getJpgItems({ sold }).then((jpgItems) => {
      setData(jpgItems)
      getCnftItems({ sold }).then((cnftItems) => {
        setData((prev) => [...prev, ...cnftItems].sort((a, b) => new Date(b.date) - new Date(a.date)))
      })
    })
  }, []) // eslint-disable-line

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
              <ListItem
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

export default Listings
