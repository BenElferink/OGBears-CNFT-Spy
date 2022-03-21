import { useData } from '../../contexts/DataContext'
import { useScreenSize } from '../../contexts/ScreenSizeContext'
import { Tooltip } from '@mui/material'
import { AccountBalanceWallet, Pets } from '@mui/icons-material'

function OnChainData() {
  const { onChainData } = useData()
  const { isMobile } = useScreenSize()

  return (
    <div
      className={isMobile ? 'flex-evenly' : 'flex-col'}
      style={{ color: 'white' }}
    >
      {onChainData.asset_minted ? (
        <Tooltip followCursor title='Number of minted assets'>
          <div
            className='flex-evenly'
            style={{ margin: isMobile ? '0.3rem 0 0 0' : '0.3rem 0' }}
          >
            <Pets />
            &nbsp;{onChainData.asset_minted}
          </div>
        </Tooltip>
      ) : (
        <div style={{ flex: '1' }} />
      )}

      {onChainData.asset_holders ? (
        <Tooltip followCursor title='Number of asset holders'>
          <div
            className='flex-evenly'
            style={{ margin: isMobile ? '0.3rem 0 0 0' : '0.3rem 0' }}
          >
            <AccountBalanceWallet />
            &nbsp;{onChainData.asset_holders}
          </div>
        </Tooltip>
      ) : (
        <div style={{ flex: '1' }} />
      )}
    </div>
  )
}

export default OnChainData
