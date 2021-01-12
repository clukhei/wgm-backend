const express = require("express");

const router = express.Router();
const {  sqlQuery } = require("../database/mysql");

router.get("/:id", (req, res) => {
	const id = req.params['id']
	sqlQuery.checkIn([id]).then(() => {
		res.status(200);
		res.json({ message: "Updated" });
	}).catch(e=> {
		console.log(e)
		res.status(500).json({message: "Server Error"})
	})
});

module.exports = router