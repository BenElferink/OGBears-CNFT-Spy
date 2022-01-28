import bearsJsonFile from '../../../data/bears'
import blockfrostJsonFile from '../../../data/blockfrost'
import getCurrentFloors from '../../../functions/markets/getCurrentFloors'

export default async (req, res) => {
  try {
    switch (req.method) {
      case 'GET': {
        const floorData = await getCurrentFloors(bearsJsonFile, blockfrostJsonFile)

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
