import React, { Fragment } from 'react'
import { Card, CardActionArea, CardContent, CardMedia, Typography } from '@mui/material'
import { ADA_SYMBOL } from '../constants/ada'

function AssetCard({
  style = {},
  name,
  price,
  rank,
  imageSrc,
  imageStyle = {},
  itemUrl = 'https://pool.pm',
  onClick,
  spanArray,
  iconArray,
  iconSize = 'small',
  flipToSide = false,
}) {
  return (
    <Card sx={{ margin: '1rem 2rem', borderRadius: '1rem', overflow: 'visible', ...style }}>
      <CardActionArea
        style={{ display: 'flex', flexDirection: flipToSide ? 'row-reverse' : 'column' }}
        onClick={() => (onClick ? onClick() : window.open(itemUrl, '_blank'))}>
        <CardMedia
          component='img'
          image={imageSrc}
          alt=''
          sx={{
            width: '200px',
            height: '200px',
            borderRadius: flipToSide ? '0 1rem 1rem 0' : '1rem 1rem 0 0',
            ...imageStyle,
          }}
        />
        <CardContent style={{ maxWidth: flipToSide ? '100px' : 'unset', width: '100%' }}>
          <Typography gutterBottom variant='h5'>
            {price ? (ADA_SYMBOL + price) : null}
            {rank ? ('Rank: ' + rank) : null}
          </Typography>
          <Typography variant='body2' color='text.secondary'>
            {name}
            <br />
            {spanArray &&
              spanArray.map((txt) => (
                <Fragment key={txt}>
                  <span style={{ fontSize: '0.7rem' }}>{txt}</span>
                  <br />
                </Fragment>
              ))}
            {iconArray && (
              <Fragment>
                <br />
                <span className='icons-wrapper'>
                  {iconArray.map(({ icon: Icon, txt }, i) => (
                    <span className='icon-item' key={`${i}-${txt}`}>
                      <Icon fontSize={iconSize} />
                      &nbsp;{txt}
                    </span>
                  ))}
                </span>
              </Fragment>
            )}
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  )
}

export default AssetCard
