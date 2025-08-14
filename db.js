//It's interact with mongoDB via mongoose library
const mongoose = require('mongoose');
require('dotenv').config();

const MONGODB_URL_LOCAL = process.env.MONGODB_URL_LOCAL;
const mongoURL = process.env.MONGODB_URL;



//connection making 
mongoose.connect(mongoURL,{
    useNewUrlParser: true,
    useUnifiedTopology: true
})

const db = mongoose.connection;

//EventListeners for db connection 

db.on('connected',()=>{
    console.log("connected to mongo db server")
})

db.on('error',(err)=>{
    console.error('mongodb connection error',err)
})

db.on('disconnected',()=>{
    console.log('mongodb disconnected');
})

module.exports = db;

 
