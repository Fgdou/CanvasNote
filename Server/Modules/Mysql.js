let mysql = require("mysql")
let config = require("../config.json")

let handle = mysql.createConnection(config.mysql)

handle.connect(err=>{
    if(err)
        throw(err)
})

module.exports = class Mysql{
    static async query(sql, tab){
        return new Promise((resolve, reject) => {
            if(!sql)
                reject("No sql")
            else{
                handle.query(sql, tab, (err, res)=>{
                    if(err)
                        reject(err)
                    else
                        resolve(res)
                })
            }
        })
    }
    static async queryFirst(sql, tab){
        try {
            let response = await this.query(sql, tab)
            if(!response.length)
                throw("Not found")
            return response[0]
        }catch (e) {
            throw(e)
        }
    }
    static async exist(sql, tab){
        try {
            let response = await this.query(sql, tab)
            if(!response.length)
                return false
            return true
        }catch (e) {
            throw e
        }
    }
    static async getBy(table, key, value){
        try {
            let sql = `SELECT * FROM ${table} WHERE ${key} = ?`
            let tab = [value]
            return await this.query(sql, tab)
        }catch (e) {
            throw e
        }
    }
    static async get(table){
        try {
            return await this.query(`SELECT * FROM ${table}`)
        }catch (e) {
            throw e
        }
    }
}