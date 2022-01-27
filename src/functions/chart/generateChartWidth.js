function generateChartWidth(windowWidth, isDesktop) {
  const width = windowWidth - (isDesktop ? 750 : 70)

  if (isDesktop && width >= 700) {
    return 700
  }

  return width
}

export default generateChartWidth
