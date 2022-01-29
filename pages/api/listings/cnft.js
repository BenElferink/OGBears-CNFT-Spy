const crawlCNFT = require('../../../functions/markets/crawlCNFT')
const formatCnftItem = require('../../../functions/formatters/formatCnftItem')

module.exports = async (req, res) => {
  try {
    switch (req.method) {
      case 'GET': {
        const sold = Boolean(req.query.sold)
        const data = []

        for (let page = 1; true; page++) {
          const results = (await crawlCNFT({ sold, sort: { price: 1 }, page })).map((item) =>
            formatCnftItem(item, { sold }),
          )

          if (!results.length) break
          results.forEach((item) => data.push(item))
        }

        res.status(200).json(data.sort((a, b) => new Date(b.date) - new Date(a.date)))
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
