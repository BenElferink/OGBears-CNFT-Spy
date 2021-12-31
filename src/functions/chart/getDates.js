function getDates(floorData, isMonth) {
  const dates = Object.values(floorData)[0].map((obj) => {
    const timestamp = new Date(obj.timestamp)
    const month = timestamp.getMonth()
    const day = timestamp.getDate()

    return `${month + 1}/${day}`
  })

  if (isMonth) {
    while (dates.length < 30) dates.unshift(0)
    while (dates.length > 30) dates.shift()
  } else {
    while (dates.length < 7) dates.unshift(0)
    while (dates.length > 7) dates.shift()
  }

  return dates
}

export default getDates
