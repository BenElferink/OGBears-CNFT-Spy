import crawlCNFT from '../../../functions/markets/crawlCNFT'

export default async (req, res) => {
  try {
    switch (req.method) {
      case 'GET': {
        const data = []

        for (let page = 1; true; page++) {
          const results = await crawlCNFT({ sold: true, sort: { price: 1 }, page })

          if (!results.length) break
          results.forEach((item) => data.push(item))
        }

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
