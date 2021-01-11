require('dotenv').config()

module.exports = {
    development: {
        host: process.env.MYSQL_SERVER,
        port: process.env.MYSQL_SVR_PORT,
        user: process.env.MYSQL_USERNAME,
        password: process.env.MYSQL_PASSWORD,
        database: process.env.MYSQL_SCHEMA,
        connectionLimit: process.env.MYSQL_CON_LIMIT,
    },
    production: {
        
    }
}