require("dotenv").config();
const mysql = require("mysql2/promise");

//change to be able to use  weddingguests and heroku_81ca0cf3689ff4d

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
		`insert into weddingguests.tokens(tokenId, rep_name, valid) values (?, ?, ?)`,
	validateToken: `select valid from weddingguests.tokens where tokenId=?`,
	insertGuest:
		`insert into weddingguests.guests(food_id, allergy_id, token_id,first_name, last_name, email, attending) values (?,?,?,?,?,?,?)`,
	invalidateToken:
		`update weddingguests.tokens set valid = false where tokenId = ?;`,
	addAllergy: `insert into weddingguests.allergies(allergy) values (?)`,
	getAllergy: `select id, allergy from weddingguests.allergies;`,
	getAllRelations: `select id, type from weddingguests.relationships`,
	addRelations: `insert into weddingguests.relationships(type) values (?)`,
	getFoodPref: `select id, food_type,notes from weddingguests.foods;`,
	attendingGuestDetails :
	`select g.id ,g.first_name, g.last_name, g.tableNo, g.email,a.allergy,f.food_type from weddingguests.guests as g  join weddingguests.allergies as a on g.allergy_id = a.id join weddingguests.foods as f on g.food_id = f.id;`,
	invitedGuests: `select * from weddingguests.tokens`,
	checkIn: `update weddingguests.guests set arrived= true where id = ?`,
	updatePayment: `update weddingguests.guests set angbao_record= ? where id=?`,
	getGuestNames: `select id, first_name, last_name, tableNo from weddingguests.guests`,
	//bulkInsert
	updateTable: `UPDATE weddingguests.guests set tableNo = ? where id =?`,
	countArrivals: `SELECT count(*) as count from weddingguests.guests where arrived=1`
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
const makeTransaction = (qArray, pool) => {
	return async (argsArray, res) => {
		const conn = await pool.getConnection();
		try {
			await conn.beginTransaction();
			const mapQueries = qArray.map((q, i) => {
				console.log(q, argsArray[i])
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
	], pool),
	insertAllergyGuestInvalidateTokenTx: makeTransaction([
		sqlStatement.addAllergy,
		sqlStatement.insertGuest,
		sqlStatement.invalidateToken,
	], pool),
	getAllRelations: makeQuery(sqlStatement.getAllRelations, pool),
	addRelations: makeQuery(sqlStatement.addRelations, pool),
	getFoodPref: makeQuery(sqlStatement.getFoodPref, pool),
	getAllergy: makeQuery(sqlStatement.getAllergy, pool),
	attendingGuestDetails: makeQuery(sqlStatement.attendingGuestDetails, pool),
	invitedGuests: makeQuery(sqlStatement.invitedGuests, pool),
	checkIn: makeQuery(sqlStatement.checkIn, pool),
	updatePayment: makeQuery(sqlStatement.updatePayment,pool),
	getGuestNames : makeQuery(sqlStatement.getGuestNames, pool),
	countArrivals: makeQuery(sqlStatement.countArrivals, pool)
};

module.exports = { pool, sqlQuery, makeTransaction,sqlStatement };
