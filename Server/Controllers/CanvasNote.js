let express = require("express")
let router = express.Router()
let users = require("./Users")
let pages = require("./Page")

router.use("/users", users)
router.use("/page", pages)

module.exports = router