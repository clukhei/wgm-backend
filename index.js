require("dotenv").config();
const express = require("express");
const morgan = require('morgan')
const {pool} = require('./database/mysql')
const cors = require('cors')
const guestsRouter = require('./routes/guests')
const infoRouter = require('./routes/info')
const checkinRouter= require("./routes/checkin")
const paymentRouter = require("./routes/payment")
const rsvpRouter = require("./routes/rsvp")
const auth = require('./auth/auth')
const passport = require("./auth/passport")
const mongoClient = require('./database/mongo')

const PORT =
	parseInt(process.argv[2]) || parseInt(process.env.PORT) || 3000;
const app = express()
app.use(cors())
app.use(morgan('combined'))
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(passport.initialize())


app.use('/guests', auth.require, guestsRouter)
app.use('/info', infoRouter)
app.use('/checkin',checkinRouter)
app.use('/rsvp', rsvpRouter)
app.post('/login', auth.login)
app.use('/payment',paymentRouter )

const startSQL = pool.getConnection()
.then((conn) => {
	conn.ping();
	console.log("pinged");
	// app.listen(PORT ,()=> {
	// 				console.log(`${PORT} started `)
	// 			})
	return conn;
})
.then((conn) => conn.release());



Promise.all([mongoClient.connect(), startSQL])
	.then(([m,s])=> {
	
		app.listen(PORT ,()=> {
			console.log(`${PORT} started `)
		})
	})
	.catch(e=> console.log)

