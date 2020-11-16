let express = require("express")
let app = express()
const compression = require('compression')
const cors = require('cors');
const path = require("path");

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(compression());
app.use(cors());
app.use(express.static(path.join(__dirname, 'Client/public')));
app.set('views', path.join(__dirname, 'Client/views'));
app.set('view engine', 'ejs');

module.exports = app;