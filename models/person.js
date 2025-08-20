//file for schema of db

const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const personSchema = new mongoose.Schema({
    name:{
        type : String,
        required : true
    },
    age:{
        type : Number,
        required : true
    },
    work:{
        type : String,
        enum : ['chef','waiter','manager']
    },
    mobile:{
        type:String,
        required : true
    },
    email:{
        type:String,
        required:true,
        unique: true
    },
    salary:{
        type:Number,
        required: true
    },
    username:{
        required : true,
        type : String
    },
    password:{
        required : true,
        type : String
    }
})

personSchema.pre('save', async function (next) {
    const person = this;

    //Hash the password if new user entered or password is changed 
    if(!person.isModified('password')) return next();
    try{
        const salt = await bcrypt.genSalt(10); //as the num increases TC for hashing Algo and security increaases
        // genSalt(x) -> TC -> 2^x
        const hashedPassword = await bcrypt.hash(person.password, salt);
        person.password = hashedPassword;
        next();

    }catch(err){
        return next(err);
    }
})

personSchema.methods.comparePassword = async function (userGivenPass) {
    try{
        const isMatch = await bcrypt.compare(userGivenPass, this.password);
        return isMatch; 
    }catch(err){
        return err;
    }
}

const person = mongoose.model('Person',personSchema);
module.exports = person
