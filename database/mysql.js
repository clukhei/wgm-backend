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
	validateToken: "select valid from weddingguests.tokens where tokenId=?",
	insertGuest: "insert into weddingguests.guests(food_id, allergy_id, relationship_id, token_id, name, email) values (?,?,?,?,?,?)",
	invalidateToken: 
	"update weddingguests.tokens set valid = false where tokenId = ?;",
	newAllergy: "insert into weddingguests.allergies(allergy) values (?)"
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

const makeTransaction = (q1, q2) => {
	return async(args1, args2) => {
		const conn = await pool.getConnection()
		try{
			await conn.beginTransaction()
			await conn.query(/* sqlStatement.insertGuest */ q1, args1||[]/* [1,2,2,"244d7084","lhei", "lhei@gmail.com"] */)
			await conn.query(/* sqlStatement.invalidateToken */ q2, args2||[]/* ["244d7084"] */)
			await conn.commit()
			//res.status(200).json({message: "Guest inserted"})
		} catch(e){
			console.log(e)
			conn.rollback()
			//res.status(500).json({message:e})
		} finally{
			conn.release()
		}
	}

}
const sqlQuery = {
	generateAndSaveRSVPToken: makeQuery(sqlStatement.generateAndSaveRSVPToken, pool),
	validateToken: makeQuery(sqlStatement.validateToken, pool),
	insertGuestInvalidateTokenTx: makeTransaction(sqlStatement.insertGuest, sqlStatement.invalidateToken),

}


module.exports = {pool, sqlQuery}