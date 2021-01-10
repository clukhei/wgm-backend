const express = require("express");
const { v4: uuidv4 } = require("uuid");
const router = express.Router();
const { pool, sqlQuery } = require("../database/mysql");

router.get("/all", (req, res) => {
	console.log("get all guests");
	res.status(200);
	res.json({ message: "hello its working" });
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
//check if token is valid before rsvp form is showed

router.get("/rsvp/:token", (req, res) => {
	const tokenId = req.params["token"];
	sqlQuery
		.validateToken([tokenId])
		.then(([result, _]) => {
			console.log(result);
			let valid;

			if (!result || result.valid === 0) {
				valid = false;
			} else {
				valid = true;
			}

			res.status(200);
			res.json({ valid });
		})
		.catch((e) => {
			console.log(e);
			res.status(500).json({ message: "Server Error" });
		});
});

router.post("/rsvp", (req, res) => {
	const {
		email,
		firstName,
		lastName,
		relationshipId,
		tokenId,
		foodId,
		allergyId,
		attending,
	} = req.body;
	sqlQuery.insertGuestInvalidateTokenTx(
		[
			[
				foodId,
				allergyId,
				relationshipId,
				tokenId,
				firstName,
				lastName,
				email,
				attending,
			],
			[tokenId],
		],
		res
    )
    .catch(e=>console.log(e))
});

module.exports = router;
