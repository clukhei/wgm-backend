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
	generateAndSaveRSVPToken:
		"insert into weddingguests.tokens(tokenId, rep_name, valid) values (?, ?, ?)",
	validateToken: "select valid from weddingguests.tokens where tokenId=?",
	insertGuest:
		"insert into weddingguests.guests(food_id, allergy_id, relationship_id, token_id,first_name, last_name, email, attending) values (?,?,?,?,?,?,?,?)",
	invalidateToken:
		"update weddingguests.tokens set valid = false where tokenId = ?;",
	addAllergy: "insert into weddingguests.allergies(allergy) values (?)",
	getAllergy: "select id, allergy from weddingguests.allergies;",
	getAllRelations: "select id, type from weddingguests.relationships",
	addRelations: "insert into weddingguests.relationships(type) values (?)",
	getFoodPref: "select id, food_type,notes from weddingguests.foods;",
};

const makeQuery = (sqlQuery, pool) => {
	return async (args) => {
		console.log(args);
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

//allow transaction to take up multiple queries and multiple args
const makeTransaction = (qArray) => {
	return async (argsArray, res) => {
		const conn = await pool.getConnection();
		try {
			await conn.beginTransaction();
			const mapQueries = qArray.map((q, i) => {
				return conn.query(q, argsArray[i] || []);
			});
			await Promise.all(mapQueries);
			await conn.commit();
			res.status(200).json({ message: "Successfully added Guest" });
		} catch (e) {
			conn.rollback();
			console.log(e)
			res.status(500).json({ message: "Server error...Rolling back" });
		} finally {
			conn.release();
		}
	};
};
const sqlQuery = {
	generateAndSaveRSVPToken: makeQuery(
		sqlStatement.generateAndSaveRSVPToken,
		pool
	),
	validateToken: makeQuery(sqlStatement.validateToken, pool),
	insertGuestInvalidateTokenTx: makeTransaction([
		sqlStatement.insertGuest,
		sqlStatement.invalidateToken,
	]),
	insertAllergyGuestInvalidateTokenTx: makeTransaction([
		sqlStatement.addAllergy,
		sqlStatement.insertGuest,
		sqlStatement.invalidateToken,
	]),
	getAllRelations: makeQuery(sqlStatement.getAllRelations, pool),
	addRelations: makeQuery(sqlStatement.addRelations, pool),
	getFoodPref: makeQuery(sqlStatement.getFoodPref, pool),
	getAllergy: makeQuery(sqlStatement.getAllergy, pool),
};

module.exports = { pool, sqlQuery };
