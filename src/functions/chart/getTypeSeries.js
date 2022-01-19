function getTypeSeries(typeObjects, isMonth = false) {
  const payload = {
    name: typeObjects[0]?.type,
    data: typeObjects.map((obj) => obj.floor),
  }

  if (isMonth) {
    while (payload.data.length < 30) payload.data.unshift(null)
    while (payload.data.length > 30) payload.data.shift()
  } else {
    while (payload.data.length < 7) payload.data.unshift(null)
    while (payload.data.length > 7) payload.data.shift()
  }

  const series = [payload]

  return series
}

export default getTypeSeries
