let express = require("express")
let app = express()
const path = require("path")
const compression = require('compression')
const cors = require('cors');

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(compression());
app.use(cors());
app.use(express.static(path.join(__dirname, '../Client/static')));
app.set('views', path.join(__dirname, '../Client/views'));
app.set('view engine', 'ejs');

module.exports = app;