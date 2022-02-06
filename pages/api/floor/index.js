import bearsJsonFile from '../../../data/bears'
import blockfrostJsonFile from '../../../data/blockfrost'
import getBearsFloor from '../../../functions/markets/getBearsFloor'

export default async (req, res) => {
  try {
    switch (req.method) {
      case 'GET': {
        const floorData = await getBearsFloor(bearsJsonFile, blockfrostJsonFile)

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
