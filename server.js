const express = require('express')
const app = express()
require('dotenv').config();
const port = process.env.PORT || 3000;

const db = require('./db');

app.listen(port, () => {
	console.log(`Example app listening on port ${port}`)
})

const bodyParser = require('body-parser')
app.use(bodyParser.json());

app.get('/', function (req, res) {
    res.send('Welcome to our Hotel');
})

const personRoutes = require('./routes/personRoutes');
app.use('/person',personRoutes);   //hits person and executes in the router file

const menuItemRoutes = require('./routes/menuItemRoutes');
app.use('/menuItem',menuItemRoutes);

