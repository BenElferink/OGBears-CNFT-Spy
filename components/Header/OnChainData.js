import { useData } from '../../contexts/DataContext'
import { useScreenSize } from '../../contexts/ScreenSizeContext'
import { AccountBalanceWallet, Pets } from '@mui/icons-material'
import { Tooltip } from '@mui/material'
import Toggle from '../Toggle'

function OnChainData() {
  const { cubMode, setCubMode, onChainData } = useData()
  const { isMobile } = useScreenSize()

  return (
    <div className={isMobile ? 'flex-evenly' : 'flex-col'} style={{ color: 'white' }}>
      <Toggle labelLeft='Bears' labelRight='Cubs' showIcons={false} state={{ value: cubMode, setValue: setCubMode }} style={{ margin: '0.5rem' }} />

      {onChainData.asset_minted ? (
        <Tooltip followCursor title='Number of minted assets'>
          <div className='flex-evenly' style={{ margin: isMobile ? '0.3rem 0 0 0' : '0.3rem 0' }}>
            <Pets />
            &nbsp;{onChainData.asset_minted}
          </div>
        </Tooltip>
      ) : (
        <div style={{ flex: '1' }} />
      )}

      {onChainData.asset_holders ? (
        <Tooltip followCursor title='Number of asset holders'>
          <div className='flex-evenly' style={{ margin: isMobile ? '0.3rem 0 0 0' : '0.3rem 0' }}>
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
