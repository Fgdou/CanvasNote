let mysql = require("./Mysql")
let Shape = require("./Shape")

module.exports = class Page{
    /**
     * id
     * name
     * parent
     */
    constructor() {
        this.id = 0
        this.name = ""
        this.parent = 0
    }
    static create(name, parent = 0){
        let page = new Page()

        if(!parent)
            parent = 0;

        page.name = name
        page.parent = parent

        return page
    }
    static parseFromOBJ(obj){
        let page = new Page()

        if(!obj)
            throw("No page obj")

        page.id = obj.id
        page.name = obj.name
        page.parent = obj.parent

        return page
    }
    static async get(id){
        if(!id)
            throw "No page id"

        return this.parseFromOBJ(await mysql.getFistBy("Pages", "id", id))
    }
    async save(){
        let sql = "INSERT INTO Pages (name, parent) VALUES (?, ?);"
        let tab = [this.name, this.parent]
        await mysql.query(sql, tab)

    }
    async getShapes(start = 0){
        if(!start)
            start = 0

        let sql = "SELECT DISTINCT shape FROM Shapes WHERE page = ? AND shape >= ?;"
        let tab = [this.id, start]

        let response = await mysql.query(sql, tab)

        let shapes = []

        for(let i=0; i<response.length; i++){
            shapes.push(await Shape.get(this.id, response[i].shape))
        }

        return shapes
        //TODO fix when get page 5
    }
    async createShape(){
        let sql = "SELECT MAX(shape) FROM Shapes WHERE page = ?;"
        let tab = [this.id]
        let response = await mysql.queryFirst(sql, tab)

        let shape = new Shape()
        if(response['MAX(shape)'])
            shape.id = response['MAX(shape)'] + 1
        else
            shape.id = 1
        shape.page = this.id
        return shape
    }
    async delete(){
        let sql = "DELETE FROM Shapes WHERE page = ?;"
        let sql2 = "DELETE FROM Pages WHERE id = ?;"
        let tab = [this.id]

        await mysql.query(sql, tab)
        await mysql.query(sql2, tab)
    }
}