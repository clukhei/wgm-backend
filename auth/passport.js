const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const JwtStrategy = require('passport-jwt').Strategy
const ExtractJwt = require('passport-jwt').ExtractJwt
const { pool } = require("../database/mysql");
const opts = {}
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken()
opts.secretOrKey = process.env.TOKEN_SECRET
//configure passport strategies 

const SQL_AUTH ="select id, first_name, last_name from weddingguests.users where email =  ? and passwordHash = sha1(?)"

passport.use( 'local',
	new LocalStrategy(
	{
		usernameField: "email",
		passwordField: "password",
		passReqToCallback: true,
	},
	async (req, user, password, done) => {
        const conn = await pool.getConnection();

        console.log ("*************************")
        
        try{
            let authResult= await conn.query(SQL_AUTH, [user,password])
            console.log(authResult)
            if(authResult[0].length ==1){
                done(null, {
                    firstName: authResult[0][0].first_name,
                    lastName: authResult[0][0].last_name,
                    id: authResult[0][0].id,
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

const SQL_AUTH_USER_JWT = "select first_name, last_name, email from weddingguests.users where id = ?"
passport.use('jwtauth',new JwtStrategy(opts, async(jwt_payload, done) => {
    const conn = await pool.getConnection()
    const userId = jwt_payload.sub
    console.log(jwt_payload)
    try{
        let authResult = await conn.query(SQL_AUTH_USER_JWT, [userId])
        if (authResult[0].length == 1){
            return done(null, authResult[0][0])
        } else {
            return done({error: 'User not found'}, false)
        }
    }catch(e){
        console.log(e)
    } finally{
        conn.release()
    }
}))

module.exports = passport;