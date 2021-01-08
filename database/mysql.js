require("dotenv").config();
const mysql = require("mysql2/promise");

const pool = mysql.createPool({
	host: process.env.MYSQL_SERVER,
	port: process.env.MYSQL_SVR_PORT,
	user: process.env.MYSQL_USERNAME,
	password: process.env.MYSQL_PASSWORD,
	database: process.env.MYSQL_SCHEMA,
	connectionLimit: process.env.MYSQL_CON_LIMIT,
});
const sqlStatement = {
	generateAndSaveRSVPToken: "insert into weddingguests.tokens(tokenId, rep_name, valid) values (?, ?, ?)",
	validateToken: "select valid from weddingguests.tokens where tokenId=?"
}

const makeQuery = (sqlQuery, pool) => {
    return async (args) => {
        console.log(args)
        const conn = await pool.getConnection();
        try {
            let results = await conn.query(sqlQuery, args || []);
            return results[0];
        } catch (e) {
            console.log(e);
        } finally {
            conn.release();
        }
    };
};

const sqlQuery = {
	generateAndSaveRSVPToken: makeQuery(sqlStatement.generateAndSaveRSVPToken, pool),
	validateToken: makeQuery(sqlStatement.validateToken, pool)
}


module.exports = {pool, sqlQuery}