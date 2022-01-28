import crawlJPG from '../../../functions/markets/crawlJPG'

export default async (req, res) => {
  try {
    switch (req.method) {
      case 'GET': {
        const data = await crawlJPG({ sold: true })

        res.status(200).json(data)
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
