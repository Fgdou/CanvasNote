let express = require("express")
let router = express.Router()
let users = require("./Users")
let page = require("./Page")

router.use("/users", users)
router.use("/page", page)

module.exports = router