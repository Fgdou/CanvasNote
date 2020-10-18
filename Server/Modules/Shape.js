let mysql = require("./Mysql")

module.exports = class Shape{
    /**
     * id    int
     * page  int
     * color hex
     * path array[
     *  obj{x, y, pressure}
     * ]
     */
    constructor() {
        this.id = 0
        this.page = 0
        this.color = "FFFFFF"
        this.path = []
    }
    static parseFromOBJ(obj){
        let shape = new Shape()

        if(!obj.length)
            throw "No value"
        shape.id = obj[0].shape
        shape.page = obj[0].page
        shape.color = obj[0].color
        shape.path = []

        for(let i=0; i<obj.length; i++){
            shape.path.push({x: obj[i].posX, y: obj[i].posY, pressure: obj[i].pressure})
        }

        return shape
    }
    static async get(page, id){
        if(!page)
            throw "No page"
        if(!id)
            throw "No shape id"

        let sql = "SELECT * FROM Shapes WHERE page = ? and shape = ?;"
        let tab = [page, id]

        return this.parseFromOBJ(await mysql.query(sql, tab))
    }

    add(pos, pressure){
        this.path.push({x: pos.x, y: pos.y, pressure: pressure})
    }
    async delete(){
        let sql = "DELETE FROM Shapes WHERE page = ? AND shape = ?;"
        let tab = [this.shape, this.id]
        await mysql.query(sql, tab)
    }
    async save(){
        let sql = "INSERT INTO Shapes (page, shape, posX, posY, pressure, color) VALUES ?"
        let tab = []
        for(let i=0; i<this.path.length; i++){
            tab.push([this.page, this.id, this.path[i].x, this.path[i].y, this.path[i].pressure, this.color])
        }
        console.log(tab)
        await mysql.query(sql, tab)
        //TODO fix SQL

    }
}