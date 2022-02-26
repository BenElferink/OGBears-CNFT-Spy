import { useScreenSize } from '../../../contexts/ScreenSizeContext'
import { IconButton, Typography } from '@mui/material'
import { AddCircle } from '@mui/icons-material'
import Loading from '../../Loading'
import AssetCard from '../../AssetCard'
import formatNumber from '../../../functions/formatters/formatNumber'
import { BEARS_POLICY_ID } from '../../../constants/policy-ids'

function MyAssets({ assets, setAssets, setOpenDrawer, adding }) {
  const { isMobile, chartWidth } = useScreenSize()

  const removeAsset = (id) => {
    setAssets((prev) => prev.filter((obj) => obj.id !== id))
  }

  return (
    <div style={{ overflow: 'unset' }}>
      <div
        style={{
          width: '90%',
          height: '2px',
          margin: '2rem auto 1rem auto',
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          borderRadius: '11px',
        }}
      />
      <Typography variant='h6' sx={{ textAlign: 'center' }}>
        My Assets ({assets.length})
      </Typography>
      <div
        style={{
          width: isMobile ? 'calc(100vw - 2rem)' : `${chartWidth + 100}px`,
          height: 'fit-content',
          display: 'flex',
          flexFlow: 'row wrap',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {adding ? (
          <Loading />
        ) : (
          <AssetCard
            htmlToolTipContent={<div>add new asset</div>}
            style={{
              margin: '1rem',
              backgroundColor: 'var(--opacity-white)',
            }}
            flipToSide={isMobile}
            price='DD NEW'
            name='Click to add new asset'
            imageSrc='/assets/images/add.png'
            imageStyle={{ padding: '1rem' }}
            onClick={() => setOpenDrawer((prev) => !prev)}
            iconArray={[
              {
                icon: AddCircle,
                txt: '',
              },
            ]}
          />
        )}
        {assets.map(({ id, name, type, image, payed }) => {
          const priceDiff =
            floorData[type][floorData[type].length - 1]?.floor - payed

          return (
            <div key={id} style={{ position: 'relative' }}>
              <IconButton
                onClick={() => removeAsset(id)}
                sx={{
                  position: 'absolute',
                  top: '1rem',
                  right: '1rem',
                  zIndex: '1',
                }}
              >
                <CloseRounded />
              </IconButton>
              <AssetCard
                style={{
                  margin: '1rem',
                  backgroundColor: 'var(--opacity-white)',
                }}
                flipToSide={isMobile}
                name={name}
                price={formatNumber(payed)}
                imageSrc={image}
                itemUrl={`https://pool.pm/${BEARS_POLICY_ID}.${id}`}
                iconArray={[
                  {
                    icon:
                      priceDiff > 0
                        ? ArrowCircleUp
                        : priceDiff < 0
                        ? ArrowCircleDown
                        : CircleOutlined,
                    txt: formatNumber(priceDiff),
                  },
                ]}
              />
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default MyAssets
