const express = require('express')
const app = express()
require('dotenv').config();
const db = require('./db');
const passport = require('./auth');

const bodyParser = require('body-parser')
app.use(bodyParser.json());

// const port = process.env.PORT || 3000;
const port = 3000;
app.listen(port, () => {
	console.log(`Example app listening on port ${port}`)
})

//Loging requests
const logRequest = (req,res,next)=>{
    console.log(`${new Date().toLocaleString()} request made to : ${req.originalUrl}`);
    next();
}
app.use(logRequest);

app.use(passport.initialize());
const localAuthmiddleware = passport.authenticate('local',{session : false});
// app.get('/', localAuthmiddleware, function (req, res) {
//     res.send('Welcome to our Hotel');
// })

app.get('/', function (req, res) {
    res.send('Welcome to our Hotel');
})

const personRoutes = require('./routes/personRoutes');
app.use('/person', personRoutes);   //hits person and executes in the router file

const menuItemRoutes = require('./routes/menuItemRoutes');
app.use('/menuItem',menuItemRoutes);


