function getChartSeries(bears, floorData, isMonth) {
  const series = bears
    .map(({ type }) => {
      const payload = {
        name: type,
        data: floorData[type].map((obj) => obj.floor),
      }

      if (isMonth) {
        while (payload.data.length < 30) payload.data.unshift(null)
        while (payload.data.length > 30) payload.data.shift()
      } else {
        while (payload.data.length < 7) payload.data.unshift(null)
        while (payload.data.length > 7) payload.data.shift()
      }

      return payload
    })

  return series
}

export default getChartSeries
