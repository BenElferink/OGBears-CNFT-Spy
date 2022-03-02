import dynamic from 'next/dynamic'
import Image from 'next/image'
import { useRouter } from 'next/router'
import { useState } from 'react'
import { useData } from '../../contexts/DataContext'
import { TickerProvider, useTicker } from '../../contexts/TickerContext'
import { useScreenSize } from '../../contexts/ScreenSizeContext'
import { IconButton, Tooltip } from '@mui/material'
import {
  AccountBalanceWallet,
  CreditCard,
  Fingerprint,
  HomeRounded,
  LocalGroceryStore,
  MenuRounded,
  Pets,
  Star,
} from '@mui/icons-material'
import BaseButton from '../BaseButton'
import Modal from '../Modal'
import Tip from '../Modal/Tip'
import ChangeGreenRed from '../ChangeGreenRed'
import { ADA_SYMBOL } from '../../constants/ada'
const Portfolio = dynamic(() => import('../Modal/Portfolio'), { ssr: false })

function Header() {
  const router = useRouter()
  const { onChainData } = useData()
  const { isMobile, isDesktop, chartWidth } = useScreenSize()
  const [openMobileMenu, setOpenMobileMenu] = useState(false)
  const [openPortfolio, setOpenPortfolio] = useState(false)
  const [openTip, setOpenTip] = useState(false)

  const logoMultiplier = isMobile ? 0.777 : isDesktop ? 0.555 : 0.42069

  const OGBearLogo = () => (
    <a href='https://ogbears.com' target='_blank' rel='noopener noreferrer'>
      <Image
        src='/assets/images/logo.png'
        alt='OGBears logo'
        width={chartWidth * logoMultiplier}
        height={chartWidth * (logoMultiplier / 4.555)}
      />
    </a>
  )

  const OnChainData = () => (
    <div
      className={isMobile ? 'flex-evenly' : 'flex-col'}
      style={{ color: 'white' }}
    >
      <Tooltip followCursor title='Number of minted assets'>
        <div
          className='flex-evenly'
          style={{ margin: isMobile ? '0.3rem 0 0 0' : '0.3rem 0' }}
        >
          <Pets />
          &nbsp;{onChainData.asset_minted}
        </div>
      </Tooltip>
      <Tooltip followCursor title='Number of asset holders'>
        <div
          className='flex-evenly'
          style={{ margin: isMobile ? '0.3rem 0 0 0' : '0.3rem 0' }}
        >
          <AccountBalanceWallet />
          &nbsp;{onChainData.asset_holders}
        </div>
      </Tooltip>
    </div>
  )

  const TickerData = () => {
    const { adaUsdTicker, adaUsdChange24 } = useTicker()

    return (
      <div
        className='flex-col'
        style={{
          width: '100px',
          padding: '0.5rem',
          backgroundColor: 'var(--opacity-white)',
          borderRadius: '1rem',
        }}
      >
        <Image
          src='/assets/images/cardano-logo-1024x1024.png'
          alt='Cardano logo'
          width={50}
          height={50}
        />
        <ChangeGreenRed
          value={adaUsdTicker}
          prefix={ADA_SYMBOL}
          scale='1.2'
          style={{
            width: '100%',
            marginTop: '0.3rem',
            color: 'var(--cardano-blue)',
          }}
        />
        <ChangeGreenRed
          value={adaUsdChange24}
          suffix='%'
          invert
          withCaret
          scale='0.7'
        />
      </div>
    )
  }

  return (
    <header
      className='flex-evenly'
      style={{
        width: isMobile ? '100%' : chartWidth,
        margin: '2rem 0',
        flexDirection: isMobile ? 'row' : 'column',
      }}
    >
      {isMobile && <div style={{ width: '3rem' }} />}

      <div className={isMobile ? 'flex-col' : 'flex-evenly'}>
        {!isMobile && (
          <TickerProvider>
            <TickerData />
          </TickerProvider>
        )}
        <OGBearLogo />
        <OnChainData />
      </div>

      {isMobile ? (
        <IconButton onClick={() => setOpenMobileMenu(true)}>
          <MenuRounded style={{ color: 'var(--yellow)', fontSize: '2rem' }} />
        </IconButton>
      ) : (
        <br />
      )}

      <Modal
        title=''
        hideElement={!isMobile}
        open={!isMobile || openMobileMenu}
        onClose={() => setOpenMobileMenu(false)}
      >
        <nav
          className='flex-evenly'
          style={
            isMobile
              ? {
                  width: '100%',
                  height: '69vh',
                  flexDirection: 'column',
                  justifyContent: 'space-evenly',
                }
              : undefined
          }
        >
          <BaseButton
            label='Home'
            icon={HomeRounded}
            onClick={() => router.push('/')}
            bearTheme
            selected={router.route === '/'}
          />
          <BaseButton
            label='Markets'
            icon={LocalGroceryStore}
            onClick={() => router.push('/markets')}
            bearTheme
            selected={router.route === '/markets'}
          />
          <BaseButton
            label='Rarity'
            icon={Star}
            onClick={() => router.push('/rarity')}
            bearTheme
            selected={router.route === '/rarity'}
          />
          <BaseButton
            label='Portfolio'
            icon={Fingerprint}
            onClick={() => {
              setOpenPortfolio(true)
              setOpenMobileMenu(false)
            }}
            bearTheme
            selected={openPortfolio}
          />
          <BaseButton
            label='Tip'
            icon={CreditCard}
            onClick={() => {
              setOpenTip(true)
              setOpenMobileMenu(false)
            }}
            bearTheme
            selected={openTip}
          />
        </nav>
      </Modal>

      <Portfolio open={openPortfolio} onClose={() => setOpenPortfolio(false)} />
      <Tip open={openTip} onClose={() => setOpenTip(false)} />
    </header>
  )
}

export default Header
