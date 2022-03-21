const crawlCNFT = require('../../../functions/markets/crawlCNFT')
const formatCnftItem = require('../../../functions/formatters/formatCnftItem')

module.exports = async (req, res) => {
  try {
    switch (req.method) {
      case 'GET': {
        const sold = Boolean(req.query.sold)
        const page = Number(req.query.page)
        const isPageNaN = isNaN(page)

        const data = []

        let index = isPageNaN ? 1 : page
        const condition = () => (isPageNaN ? true : index === page)

        for (index; condition(); index++) {
          const results = (
            await crawlCNFT({ sold, page: index, sort: { _id: -1 } })
          ).map((item) => formatCnftItem(item, { sold }))

          if (!results.length) break
          results.forEach((item) => data.push(item))
        }

        res
          .status(200)
          .json(data.sort((a, b) => new Date(b.date) - new Date(a.date)))
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
