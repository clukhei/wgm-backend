require("dotenv").config();
const express = require("express");
const morgan = require('morgan')
const {pool} = require('./database/mysql')
const cors = require('cors')
const guestsRouter = require('./routes/guests')
const infoRouter = require('./routes/info')
const authRouter = require('./routes/auth')


const PORT =
	parseInt(process.argv[2]) || parseInt(process.env.APP_PORT) || 3000;
const app = express()
app.use(morgan('combined'))
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors())

app.use('/guests', guestsRouter)
app.use('/info', infoRouter)
app.use('/auth', authRouter)

 pool.getConnection()
.then((conn) => {
	conn.ping();
	console.log("pinged");
	app.listen(PORT ,()=> {
					console.log(`${PORT} started `)
				})
	return conn;
})
.then((conn) => conn.release());



// Promise.all([mongoClient.connect(), startSQL])
// 	.then(()=> {
// 		app.listen(PORT ,()=> {
// 			console.log(`${PORT} started `)
// 		})
// 	})

