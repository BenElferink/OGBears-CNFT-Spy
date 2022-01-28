import { useState, useEffect } from 'react'

export default function useLocalStorage(key = '', defaultValue = null) {
  const [value, setValue] = useState(JSON.parse(localStorage.getItem(key)) || defaultValue)

  useEffect(() => {
    if (value != null) localStorage.setItem(key, JSON.stringify(value))
  }, [key, value])

  return [value, setValue]
}
