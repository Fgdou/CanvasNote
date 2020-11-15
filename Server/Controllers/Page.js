let express = require("express")
let router = express.Router()
let users = require("../Modules/User")
let pages = require("../Modules/Page")

router.use("/:function", async (req, res) => {
    try{
        if(!req.params.function)
            throw "No function"

        let response = {success: true}

        let user = await users.getByToken(req.body.token)
        switch (req.params.function){
            case "create": {
                let p = await pages.create(req.body.name, req.body.parent)
                await p.save()
                break
            }
            case "delete": {
                let p = await pages.get(req.body.page)
                await p.delete()
                break
            }
            case "getShapes": {
                let p = await pages.get(req.body.page)
                response.shapes = p.getShapes(req.body.last)
                break
            }
            case "createShape": {
                let p = await pages.get(req.body.page)
                let shape = await p.createShape();

                if(!req.body.path)
                    throw "No path"

                let path = JSON.parse(req.body.path)

                for(let i in path){
                    let point = path[i]
                    shape.add(point.pos, point.pressure)
                }
                await shape.save();
                response.shape = shape.id
                break
            }
            case "deleteShape":{
                let shape = await shape.get(req.body.page, req.body.shape)
                await shape.delete()
                break
            }
            default:
                throw "Wrong function"
        }
        res.send(response)
    }catch (e) {
        console.log(e)
        res.send({error: e})
    }
})

module.exports = router