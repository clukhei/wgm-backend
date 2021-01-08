require("dotenv").config();
const express = require("express");
const morgan = require('morgan')
const {pool} = require('./database/mysql')

const guestsRouter = require('./routes/guests')

const PORT =
	parseInt(process.argv[2]) || parseInt(process.env.APP_PORT) || 3000;
const app = express()
app.use(morgan('combined'))
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/guests', guestsRouter)


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
