const express = require("express");

const router = express.Router();
const {  sqlQuery } = require("../database/mysql");

//check if token is valid before rsvp form is showed

router.get("/form", (req, res) => {
    const tokenId = req.query["token"]
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

router.post("/submit", (req, res) => {
	const {
		email,
		firstName,
		lastName,

		tokenId,
		foodId,
		allergyId,
		attending,
	} = req.body;
	sqlQuery
		.insertGuestInvalidateTokenTx(
			[
				[
					foodId,
					allergyId,
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
		.catch((e) => console.log(e));
});

module.exports = router