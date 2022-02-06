import getSalmonFloor from '../../../functions/markets/getSalmonFloor'

export default async (req, res) => {
  try {
    switch (req.method) {
      case 'GET': {
        const floorData = await getSalmonFloor()

        res.status(200).json(floorData)
        break
      }

      default: {
        res.status(404).json({})
        break
      }
    }
  } catch (error) {
    console.error(error)
    res.status(500).json({})
  }
}
