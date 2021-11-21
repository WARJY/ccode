const bodyParser = require('body-parser')
const preset = require("./server/preset.js")
const page = require("./server/page.js")

console.log(preset)

module.exports = {
  lintOnSave: false,
  devServer: {
    host: '0.0.0.0',
    port: 80,
    https: false,
    hotOnly: false,
  },
  configureWebpack: config => {
    config.devServer = {
      setup: function (app, server) {
        app.use(bodyParser.json())
        app.use(bodyParser.urlencoded({ extended: false }))
        app.post('/generate/preset', async function (req, res) {
          let data = req.body
          await preset.add(data)
          res.send(true)
        })
        app.post('/generate/page', async function (req, res) {
          let data = req.body
          const path = await page.add(data)
          res.send(path)
        })
      },
      hot: true
    }
  },
}
