const express = require("express");
const { v4: uuidv4 } = require("uuid");
const router = express.Router();
const { pool, sqlQuery } = require("../database/mysql");

router.get("/all", (req, res) => {
	console.log("get all guests");
	res.status(200);
	res.json({ message: "hello its working" });
});

//get all attending guest info
router.get("/attending", (req, res) => {
	sqlQuery
		.attendingGuestDetails()
		.then((result) => {
			console.log(result);
			res.status(200).json(result);
		})
		.catch((e) => {
			console.log(e);
			res.status(500).json({ message: "Server Error" });
		});
});

//get total invited (count token number)
router.get("/invited", (req, res) => {
	sqlQuery
		.invitedGuests()
		.then((result) => {
			console.log(result);
			res.status(200).json(result);
		})
		.catch((e) => {
			console.log(e);
			res.status(500).json({ message: "Server Error" });
		});
});

//generate a unique token for a unique rsvp link
router.post("/rsvp-link", (req, res) => {
	const tokenId = uuidv4().substring(0, 8);
	const rep_name = req.body["repName"].toString().toLowerCase();
	const valid = true;
	sqlQuery
		.generateAndSaveRSVPToken([tokenId, rep_name, valid])
		.then((result) => {
			console.log(result);
			res.status(200);
			res.json({ repName: rep_name, tokenId, valid });
		})
		.catch((e) => {
			console.log(e);
			res.status(500).json({ message: "Server Error" });
		});
});


module.exports = router;
