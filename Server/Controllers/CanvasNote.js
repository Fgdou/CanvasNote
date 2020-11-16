let express = require("express")
let router = express.Router()
let users = require("./Users")
let pages = require("./Page")

let fs = require("fs")
let path = require("path")

router.use("/users",require("./Users"))
router.use("/page", require("./Page"))
router.use("/html", require("./html"))

module.exports = router