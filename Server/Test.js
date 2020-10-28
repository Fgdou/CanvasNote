let Page = require("./Modules/Page");

(async()=>{
    let p = await Page.get(1)
    let s = await p.getShapes()

    console.log(s)
})()