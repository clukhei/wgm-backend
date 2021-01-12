require('dotenv').config()
const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const { sqlQuery, pool } = require("../database/mysql");

const SQL_AUTH ="select id, first_name, last_name from weddingguests.users where email =  ? and passwordHash = sha1(?)"
//create  login

const authMiddleWare = (passport) => {
	return (req, res, next) => {
		passport.authenticate("local", (err, user, info) => {
            req.user = user;
            if((null !=err || (!user))){
                res.status(401).json({error: err})
                return
            }
            next()
		})(req,res,next)
	};
};

const localStrategyAuth = authMiddleWare(passport)
passport.use(
	new LocalStrategy(
	{
		usernameField: "email",
		passwordField: "password",
		passReqToCallback: true,
	},
	async (req, user, password, done) => {
        const conn = await pool.getConnection();
        
        try{
            let authResult= await conn.query(SQL_AUTH, [user,password])
            console.log(authResult)
            if(authResult[0].length ==1){
                done(null, {
                    firstName: authResult[0][0].first_name ,
                    lastName: authResult[0][0].last_name,
                    loginTime: new Date().toString(),
                    security: 2
                })
                return
            } else {
                done("Incorrect credentials", false)
            }
        }catch(e){
            console.log(e)
        } finally {
            conn.release()
        }
	}
)
)
router.post("/login",localStrategyAuth, (req, res) => {
	console.log(req.user);
    const timestamp = new Date().getTime() / 1000;
    const token = jwt.sign({
        sub: req.user.firstName,
        iss: 'wgm',
        iat: timestamp,
        exp: timestamp + 86400, //one day expiry,
        data: {userFirstName:req.user.firstName, userLastName: req.user.lastName, loginTime: (new Date().toString())}

    }, process.env.TOKEN_SECRET)

    res.type('application/json')
    res.status(200).json({message: "Login successful", token, loginTime: new Date()})
});

module.exports = router;
