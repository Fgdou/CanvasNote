let express = require("express")
let router = express.Router()
let users = require("./Users")

router.use("/users", users)

module.exports = router