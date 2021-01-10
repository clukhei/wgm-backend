const express = require("express");

const router = express.Router();
const { pool, sqlQuery } = require("../database/mysql");

router.get("/relationship", (req, res) => {
	sqlQuery
		.getAllRelations()
		.then((result) => {
			console.log(result);
			res.status(200).json(result);
		})
		.catch((e) => {
			console.log(e);
			res.status(500).json({ message: "Server Error" });
		});
});

router.post("/relationship", (req, res) => {
	const newRelation = req.body["newRelation"];
	sqlQuery
		.addRelations([newRelation])
		.then((result) => {
			res.status(200).json(result);
		})
		.catch((e) => {
			console.log(e);
			res.status(500).json({ message: "Server Error" });
		});
});

router.get("/food", (req, res) => {
	sqlQuery
		.getFoodPref()
		.then((result) => {
			res.status(200).json(result);
		})
		.catch((e) => {
			console.log(e);
			res.status(500).json({ message: "Server Error" });
		});
});

router.get("/allergy", (req, res) => {
	sqlQuery
		.getAllergy()
		.then((result) => {
			res.status(200).json(result);
		})
		.catch((e) => {
			console.log(e);
			res.status(500).json({ message: "Server Error" });
		});
});
module.exports = router;
