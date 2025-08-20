const passport = require('passport');
const passportLocal = require('passport-local');

//Authentication Logic

const LocalStrategy = passportLocal.Strategy;
const person = require('./models/person');
passport.use(new LocalStrategy(async (USERNAME, pass, done)=>{
    try{
        console.log('Recieved credentials :',USERNAME, pass);
        const user = await person.findOne({username : USERNAME}); 
        if(!user){
            console.log("username not found");
            return done(null, false, {message : 'Username not found'});
        }
        //Now check for password as user is found
        
        const isPasswordMatch =  await user.comparePassword(pass);
    
        if (isPasswordMatch){
            console.log('matched');
            return done(null, user);
        } 
        else{
            console.log('not matched');
            return done(null, false, { message: 'Incorrect password.' })
        } 

    }catch(err){
        return done(err); 
    }
}))

module.exports = passport;