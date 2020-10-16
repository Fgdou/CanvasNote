let Token = require("./Modules/Token");

(async()=>{
    try{
        let t = Token.create("login", 22)
        console.log(t)

        let t2 = Token.get("login", t.value)
        console.log(t2)
    }catch (e) {
        console.log("Something went wrong");
        console.log(e)
    }
})()