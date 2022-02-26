import dynamic from 'next/dynamic'
import Image from 'next/image'
import { useRouter } from 'next/router'
import { useState } from 'react'
import { useScreenSize } from '../../contexts/ScreenSizeContext'
import { IconButton } from '@mui/material'
import {
  CreditCard,
  Fingerprint,
  HomeRounded,
  LocalGroceryStore,
  MenuRounded,
  Star,
} from '@mui/icons-material'
import BaseButton from '../Basebutton'
import Modal from '../Modal'
import Tip from '../Modal/Tip'
const Portfolio = dynamic(() => import('../Modal/Portfolio'), { ssr: false })

function Header() {
  const router = useRouter()
  const { isMobile, chartWidth } = useScreenSize()
  const [openMobileMenu, setOpenMobileMenu] = useState(false)
  const [openPortfolio, setOpenPortfolio] = useState(false)
  const [openTip, setOpenTip] = useState(false)

  return (
    <header
      className='flex-evenly'
      style={{
        width: chartWidth,
        margin: '2rem 0',
        flexDirection: !isMobile ? 'column' : 'row',
      }}
    >
      <a href='https://ogbears.com' target='_blank' rel='noopener noreferrer'>
        <Image
          src='/assets/images/logo.png'
          alt='OG Bears logo'
          width={chartWidth * 0.555}
          height={chartWidth * (0.555 / 4.555)}
        />
      </a>

      <br />

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
                  height: '100%',
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
