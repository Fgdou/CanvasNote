let mysql = require("./Mysql")
let Tokens = require("./Token")

module.exports = class User{
    static parseFromOBJ(obj){
        let user = new User
        user.id = obj.id
        user.username = obj.username
        user.password = obj.password
        user.last_login = Date.parse(obj.last_login)
        user.email = obj.email
        user.email_verified = obj.email_verified
    }
    static async getById(id){
        if(!id)
            throw "No id";
        return this.parseFromOBJ(await mysql.getFistBy("Users", "id", id))
    }
    static async getByToken(token){
        if(!token)
            throw "No token"
        let tok = await Tokens.get("Users", token)
        if(tok.used)
            throw "Token already used"
        if((new Date()) > tok.expiration)
            throw "Token expired"
        return this.parseFromOBJ(await this.getById(tok.user))
    }
    static async getByEmail(email){
        if(!email)
            throw "No email"
        return this.parseFromOBJ(await mysql.getFistBy("Users", "email", email))
    }
    static async getByUsername(username){
        if(!username)
            throw "No username"
        return this.parseFromOBJ(await mysql.getFistBy("Users", "username", username))
    }
    static async create(username, email, password){

    }

    static async verifyEmail(){

    }
}