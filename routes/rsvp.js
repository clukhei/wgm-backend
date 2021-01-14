const express = require("express");
const nodeMailer = require("nodemailer");
const router = express.Router();
const { sqlQuery } = require("../database/mysql");
const sgMail = require("@sendgrid/mail");
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

//check if token is valid before rsvp form is showed

router.get("/form", (req, res) => {
	const tokenId = req.query["token"];
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
		.then(() => sendEmail(req.body))
		.catch((e) => console.log(e));
});

function sendEmail(payload) {

	const msg = {
		to: `${payload.email}`,
		from: process.env.SENDGRID_VERIFIED_EMAIL,
		subject: "Details of so and so wedding dinner",
		html: `
		<body>
		<h2> Dear ${payload.firstName},</h2>
		<br>
		<p>Thank you for being a part of this special day</p>
		<br>
		<p> See you on 14 January 2040 at Regent, 7pm"
		<br>
		<p>Regards</p>	

		</body>
		`,
	};

	sgMail
		.send(msg)
		.then((emailSent) => {
			console.log(emailSent)
			let statusCode = emailSent[0].statusCode;
			if (statusCode ==202) {
				console.log("check your email");
			}
		})
		.catch((e) => console.log(e));
}

module.exports = router;
