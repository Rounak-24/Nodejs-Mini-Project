const jwt = require('jsonwebtoken');
const KEY = process.env.JWT_SECRET_KEY;

const jwtAuthMiddleware = (req, res, next)=>{

    const auth = req.headers.authorization;
    if(!auth) return res.status(401).json({error : "Token not found"});

    //Token found -> check correct or not 
    //token format = bearer feefiziiuvhgVUYbHbHJkjjbb
    const token = req.headers.authorization.split(' ')[1];
    if(!token) return res.status(401).json({error : "Unauthorized"});

    try{
        //secret key given by us
        const decoded = jwt.verify(token, KEY);
        req.user = decoded;
        next();

    }catch(err){
        console.error(err);
        res.status(401).json({error : 'Invalid token'});
    }
}

const generateToken = (userinfo)=>{
    return jwt.sign({userinfo},KEY)
}

module.exports = {jwtAuthMiddleware, generateToken};