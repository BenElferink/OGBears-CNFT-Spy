import React, { useEffect } from 'react'
import { useLocalStorage } from '../hooks'
import ReactToggle from 'react-toggle'
import 'react-toggle/style.css'

function Toggle({
  name = 'default',
  labelLeft = 'off',
  labelRight = 'on',
  showIcons = false,
  state: { value, setValue },
  style = {},
}) {
  const [toggle, setToggle] = useLocalStorage(`toggle-key-${name}`, value ?? false)

  const styles = {
    label: {
      width: 'fit-content',
      display: 'flex',
      alignItems: 'center',
      cursor: 'pointer',
      ...style,
    },
    span: {
      margin: '0 4px',
    },
  }

  useEffect(() => {
    setValue(toggle)
    return () => {
      setValue(toggle)
    }
  }, [setValue, toggle])

  return (
    <label style={styles.label}>
      <span style={styles.span}>{labelLeft}</span>
      <ReactToggle icons={showIcons} defaultChecked={toggle} onChange={() => setToggle((prev) => !prev)} />
      <span style={styles.span}>{labelRight}</span>
    </label>
  )
}

export default Toggle
