let express = require("express")
let router = express.Router()
let users = require("../Modules/User")

router.use("/:function", async (req, res) => {
    try{
        if(!req.params.function)
            throw "No function"

        let response = {success: true}

        switch (req.params.function){
            case "verifyEmail":
                await users.verifyEmail(req.query.token)
                break;
            case "login":
                response.user = await users.login(req.body.email, req.body.password)
                break;
            case "register":
                await users.create(req.body.username, req.body.email, req.body.password)
                break;
            default:{
                console.log(req.body.token)
                let user = await users.getByToken(req.body.token)
                switch(req.params.function){
                    case "get":
                        response.user = user
                        break;
                    case "delete":
                        await user.delete()
                        break;
                    default:
                        throw "Wrong function"
                }
            }
        }

        res.send(response)
    }catch (e) {
        console.log(e)
        res.send({error: e})
    }
})

module.exports = router