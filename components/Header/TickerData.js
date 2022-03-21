import Image from 'next/image'
import { useTicker } from '../../contexts/TickerContext'
import ChangeGreenRed from '../ChangeGreenRed'
import { ADA_SYMBOL } from '../../constants/ada'

function TickerData() {
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

export default TickerData
