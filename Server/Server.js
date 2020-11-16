const app = require('./express')
let canvasnote = require("./Controllers/CanvasNote")
let config = require("./config.json")

app.use("/CanvasNote", canvasnote)

app.listen(config.server.port)
console.log(`Listinning on http://${config.server.host}:${config.server.port}`)