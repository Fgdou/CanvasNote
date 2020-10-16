let Token = require("./Modules/Token");

(async()=>{
    try{
        let t = await Token.create("login", 22)
        console.log(t)

        let t2 = await Token.get("login", t.value)
        console.log(t2)
    }catch (e) {
        console.log("Something went wrong");
        console.log(e)
    }
})()