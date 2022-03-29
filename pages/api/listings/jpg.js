const crawlJPG = require('../../../functions/markets/crawlJPG')
const formatJpgItem = require('../../../functions/formatters/formatJpgItem')

module.exports = async (req, res) => {
  try {
    switch (req.method) {
      case 'GET': {
        const sold = req.query.sold == 'true'
        let page = (() => {
          const num = Number(req.query.page)
          return isNaN(num) ? 1 : num >= 1 ? num : 1
        })()

        const data = (await crawlJPG({ sold, page })).map((item) =>
          formatJpgItem(item, { sold })
        )

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
