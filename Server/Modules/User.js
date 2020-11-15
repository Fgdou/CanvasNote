let mysql = require("./Mysql")
let Tokens = require("./Token")
let md5 = require("md5")
let config = require("../config.json")
let mail = require("./Mail")

function encodePassword(pass){
    return md5(pass)
}

module.exports = class User{
    static parseFromOBJ(obj){
        let user = new User
        user.id = obj.id
        user.username = obj.username
        user.password = obj.password
        user.last_login = Date.parse(obj.last_login)
        user.email = obj.email
        user.email_verified = obj.email_verified
        user.token = null
        return user
    }
    static async getById(id){
        if(!id)
            throw "No id";
        return this.parseFromOBJ(await mysql.getFistBy("Users", "id", id))
    }
    static async getByToken(tokenValue){
        if(!tokenValue)
            throw "No token value"
        let tok = await Tokens.get("login", tokenValue)
        tok.throwNotValid()

        let user = this.parseFromOBJ(await this.getById(tok.user))
        user.token = tok
        return user
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
        if(!username)
            throw "No username"
        if(!email)
            throw "No email"
        if(!password)
            throw "No password"
        password = encodePassword(password)

        if(await mysql.existBy("Users", "email", email))
            throw "Email already exist"
        if(await mysql.existBy("Users", "username", username))
            throw "Username already exist"

        let sql = "INSERT INTO Users (username, password, last_login, email, email_verified) VALUES (?, ?, NOW(), ?, 0)"
        let tab = [username, password, email]
        await mysql.query(sql, tab)

        let user = await this.getByEmail(email)
        let token = await Tokens.create("email", user.id)

        let subject = "CanvasNote verify account"
        let html = `Please verify your account at : http://${config.server.host}:${config.server.port}/CanvasNote/users/verifyEmail?token=${token.value}`

        await user.sendMail(subject, html)

        return user
    }

    async sendMail(subject, html){
        await mail(this.email, subject, html)
    }

    static async login(email, password){
        if(!email)
            throw "No email"
        if(!password)
            throw "No password"
        password = encodePassword(password)

        let user = await this.getByEmail(email)
        if(user.password !== password)
            throw "Wrong password"
        if(!user.email_verified)
            throw "Email not verified"

        user.token = await Tokens.create("login", user.id)

        return user
    }
    static async verifyEmail(tokenValue){
        if(!tokenValue)
            throw "No token value"

        let token = await Tokens.get("email", tokenValue)
        token.throwNotValid()

        let user = await this.getById(token.user)
        if(user.email_verified)
            throw "Email already verified"

        let sql = "UPDATE Users SET email_verified = 1 WHERE id = ?;"
        let tab = [user.id]
        await mysql.query(sql, tab)

        await token.use()
        return user
    }

    async logout(){
        if(!this.token)
            throw "No token"
        await this.token.use()
    }
    async delete(){
        let sql = "DELETE FROM Users WHERE id = ?;"
        let tab = [this.id]
        await mysql.query(sql, tab)
    }
    async updateToken(){
        let token = await Tokens.create("login", this.id)
        this.token.use()
        this.token = token
        return token
    }
}