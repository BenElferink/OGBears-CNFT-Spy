import { useEffect, useState } from 'react'
import { useData } from '../contexts/DataContext'
import { Typography } from '@mui/material'
import Loading from './Loading'
import ListItem from './ListItem'

function Listings({ title = 'Recently Sold', sold = true }) {
  const { getCnftItems, getJpgItems } = useData()
  const [data, setData] = useState([])

  useEffect(() => {
    getJpgItems({ sold }).then((jpgItems) => {
      setData(jpgItems)
      getCnftItems({ sold }).then((cnftItems) => {
        setData((prev) => [...prev, ...cnftItems].sort((a, b) => new Date(b.date) - new Date(a.date)))
      })
    })
  }, []) // eslint-disable-line

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

      <div className='scroll listings'>
        {data.length ? (
          data.map(({ assetId, name, price, imageUrl, itemUrl, store, date }) => (
            <ListItem
              key={`${store}-${sold ? 'sold' : 'listed'}-${assetId}-${date}`}
              name={name}
              price={price}
              imageSrc={imageUrl}
              itemUrl={itemUrl}
              spanArray={[store, `${sold ? 'Sold:' : 'Listed:'} ${new Date(date).toLocaleString()}`]}
            />
          ))
        ) : (
          <Loading />
        )}
      </div>
    </div>
  )
}

export default Listings
