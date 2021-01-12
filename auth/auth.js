require('dotenv').config()
const jwt = require("jsonwebtoken");
const passport = require('./passport')
//auth methods

exports.login = function(req,res, next){
    passport.authenticate("local", {session:false}, (err, user)=> {
        req.user = user
        console.log("user>>>>>>>>>>>>>>", user)
        if((null !=err || (!user))){
            res.status(401).json({error: err})
            return
        }

        const timestamp = new Date().getTime() / 1000;
        const token = jwt.sign({
            sub: req.user.id,
            iss: 'wgm',
            iat: timestamp,
            exp: timestamp + 86400, //one day expiry,
            data: {userFirstName:req.user.firstName, userLastName: req.user.lastName, loginTime: (new Date().toString())}
    
        }, process.env.TOKEN_SECRET)

        const userName = user.firstName + " " + user.lastName
        res.type('application/json')
        res.status(200).json({message: "Login successful", token, userName, loginTime: new Date()})
    
    })(req,res,next)
}

exports.require = function(req,res,next){
    passport.authenticate('jwtauth', {session: false}, function(err,user){
        if (err) {
            return res.status(500).json({message: `500 ${err.message}`})
        }

        if(!user){
            return res.status(403).json({message: '403 forbidden'})
        }

        req.user = user
        next()
    }) (req,res,next)
}
