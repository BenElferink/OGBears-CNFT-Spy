import ChangeGreenRed from '../../ChangeGreenRed'
import formatNumber from '../../../functions/formatters/formatNumber'
import { ADA_SYMBOL } from '../../../constants/ada'

function Balance({ totalPayed = 0, totalBalance = 0 }) {
  return (
    <div className='flex-row' style={{ width: '100%', padding: '1rem' }}>
      <div
        className='flex-col'
        style={{
          padding: '0.5rem 1rem',
          backgroundColor: 'var(--opacity-white)',
          borderRadius: '0.5rem',
        }}
      >
        <p style={{ marginBottom: '11px' }}>Total Payed</p>
        <div className='flex-row'>
          <span style={{ fontSize: '2rem' }}>
            {ADA_SYMBOL}
            {formatNumber(totalPayed)}
          </span>
        </div>
      </div>
      <div
        className='flex-col'
        style={{
          padding: '0.5rem 1rem',
          backgroundColor: 'var(--opacity-white)',
          borderRadius: '0.5rem',
        }}
      >
        <p style={{ marginBottom: '11px' }}>Current Balance</p>
        <div className='flex-row'>
          <span style={{ fontSize: '2rem' }}>
            {ADA_SYMBOL}
            {formatNumber(totalBalance)}
          </span>
          <div className='flex-col' style={{ marginLeft: '0.5rem' }}>
            <ChangeGreenRed
              value={
                totalPayed
                  ? formatNumber(
                      (
                        ((totalBalance - totalPayed) / totalPayed) *
                        100
                      ).toFixed(0)
                    )
                  : '0'
              }
              suffix='%'
              invert
              withCaret
            />
            <ChangeGreenRed
              value={
                totalPayed
                  ? formatNumber((totalBalance - totalPayed).toFixed(0))
                  : '0'
              }
              prefix={ADA_SYMBOL}
              invert
              withCaret
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default Balance
