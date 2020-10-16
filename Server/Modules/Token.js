let mysql = require("./Mysql")

module.exports = class Token{
    /**
     * type         - string 10
     * user         - int user_id
     * value        - string 255
     * ip           - string 255
     * used         - bool
     * expiration   - date
     */
    static async create(type, user, ip = null){
        try {
            let token = new Token
            token.type = type
            token.user = user
            token.ip = ip
            token.used = 0
            token.expiration = new Date()
            token.value = ""
            await token.createTokenValue(255)

            await token.save()

            return token
        }catch (e) {
            throw e
        }
    }
    static async get(type, value){
        try {
            let token = new Token

            let sql = "SELECT * FROM Tokens WHERE type = ? AND value = ?"
            let tab = [type, value]
            let response = await mysql.queryFirst(sql, tab)

            token.type = response.type
            token.ip = response.ip
            token.expiration = Date.parse(response.expiration)
            token.user = response.user
            token.used = response.used
            token.value = response.value

            return token
        }catch (e) {
            throw e
        }
    }
    async save(){
        try {
            let sql = "INSERT INTO Tokens(type, user, expiration, value, used, ip) VALUES (?, ?, DATEADD(hour, NOW(), 1), ?, ?)"
            let tab = [this.type, this.user, this.value, this.ip]
            await mysql.query(sql, tab)
        }catch (e) {
            throw e
        }
    }
    async createTokenValue(n){
        try {
            let value
            let exist = false
            let alpha = "1234567890AZERTYUIOPQSDFGHJKLMWXCVBNazertyuiopqsdfghjklmwxcvbn"

            do{
                value = ""
                for(let i=0; i<n; i++){
                    value += alpha.charAt(Math.floor(Math.random()*alpha.length))
                }
                let sql = "SELECT id FROM Tokens WHERE type = ? AND value = ?"
                let tab = [this.type, value]
                exist = await mysql.exist(sql, tab)
            }while(exist)

            this.value = value
        }catch (e) {
            throw e
        }
    }
    async use(){
        try {
            let sql = "UPDATE Tokens SET used = 1 WHERE type = ? and value = ?"
            let tab = [this.type, this.value]
            await mysql.query(sql, tab)
        }catch (e) {
            throw e
        }
    }
    async delete(){
        try {
            let sql = "DELETE FROM Tokens WHERE type = ? AND value = ?"
            let tab = [this.type, this.value]
            await mysql.query(sql, tab)
        }catch (e) {
            throw e
        }
    }
    isValid(){
       if(this.used === 1 || this.expiration < new Date())
           return false
        return true
    }
}