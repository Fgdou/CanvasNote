let mysql = require("mysql")
let config = require("../config.json")

let handle = mysql.createConnection(config.mysql)

handle.connect(err => {
    if (err)
        throw(err)
})

module.exports = class Mysql {
    static async query(sql, tab) {
        return new Promise((resolve, reject) => {
            if (!sql)
                reject("No sql")
            else {
                handle.query(sql, tab, (err, res) => {
                    if (err)
                        reject(err)
                    else
                        resolve(res)
                })
            }
        })
    }

    static async queryFirst(sql, tab) {
        let response = await this.query(sql, tab)
        if (!response.length)
            throw "Not found"
        return response[0]
    }

    static async exist(sql, tab) {
        let response = await this.query(sql, tab)
        if (!response.length)
            return false
        return true
    }

    static async getBy(table, key, value) {
        let sql = `SELECT * FROM ${table} WHERE ${key} = ?`
        let tab = [value]
        return await this.query(sql, tab)
    }

    static async get(table) {
        return await this.query(`SELECT * FROM ${table}`)
    }
}