import { GREEN, RED } from '../constants/colors'

const invertColor = '#f9f9f9'

export default function ChangeGreenRed({
  value = 0,
  prefix = '',
  suffix = '',
  invert = false,
  withCaret = false,
  scale = 1,
}) {
  const changeColor =
    typeof value === 'number' && value > 0
      ? GREEN
      : typeof value === 'number' && value < 0
      ? RED
      : typeof value === 'string' && value.charAt(0) !== '-'
      ? GREEN
      : typeof value === 'string' && value.charAt(0) === '-'
      ? RED
      : 'unset'

  const style = {
    margin: invert ? `${2 * scale}px ${4 * scale}px` : 'unset',
    padding: invert ? `${4 * scale}px ${7 * scale}px` : 'unset',
    backgroundColor: invert ? changeColor : 'unset',
    color: invert ? invertColor : changeColor,
    fontSize: `${16 * scale}px`,
    fontWeight: '500',
    borderRadius: '7px',
    display: 'flex',
    alignItems: 'center',
  }

  return (
    <span style={style}>
      {withCaret && value > 0 ? (
        <CaretUp size={10 * scale} fill={invertColor} style={{ marginRight: `${2 * scale}px` }} />
      ) : withCaret && value < 0 ? (
        <CaretDown size={10 * scale} fill={invertColor} style={{ marginRight: `${2 * scale}px` }} />
      ) : null}
      {prefix}
      {value}
      {suffix}
    </span>
  )
}

function CaretUp({ size = '16', fill = 'currentColor', style }) {
  return (
    <svg viewBox='0 0 16 16' width={size} height={size} fill={fill} style={style}>
      <path d='m7.247 4.86-4.796 5.481c-.566.647-.106 1.659.753 1.659h9.592a1 1 0 0 0 .753-1.659l-4.796-5.48a1 1 0 0 0-1.506 0z' />
    </svg>
  )
}

function CaretDown({ size = '16', fill = 'currentColor', style }) {
  return (
    <svg viewBox='0 0 16 16' width={size} height={size} fill={fill} style={style}>
      <path d='M7.247 11.14 2.451 5.658C1.885 5.013 2.345 4 3.204 4h9.592a1 1 0 0 1 .753 1.659l-4.796 5.48a1 1 0 0 1-1.506 0z' />
    </svg>
  )
}
