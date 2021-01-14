const express = require("express");
const nodeMailer = require('nodemailer')
const router = express.Router();
const { sqlQuery } = require("../database/mysql");

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
		.then(()=> sendEmail(req.body))
		.catch((e) => console.log(e));
});

function sendEmail(payload) {
	const mailConfig = {
		host: process.env.MAILTRAP_HOST,
		port: process.env.MAILTRAP_PORT,
		auth: {
			user: process.env.MAILTRAP_USER,
			pass: process.env.MAILTRAP_PASS
		}
	}
	const transporter = nodeMailer.createTransport(mailConfig)
	const mailOptions = {
		to: `${payload.email}`,
		from: 'info@example.com'/* process.env.MAILTRAP_ADD */,
		subject: "Details of so and so wedding dinner",
		html: `
		<body>
		<h2> Dear ${payload.firstName},</h2>
		<br>
		<p>Thank you for being a part of this special day</p>
		<br>
		<p> See you on 14 January 2040 at Regent, 7pm"
	<br>
	<iframe
	width="450"
	height="300"
	frameborder="0" style="border:0"
	src="https://www.google.com/maps/embed/v1/place?key=${process.env.MAPS_API}&q=place_id:ChIJBZofrosZ2jER0MORa_XKmU0" allowfullscreen>
  </iframe>

		</body>
		`,
	};

	return transporter.sendMail(mailOptions, (error,info)=> {
		if (error){
			return console.log(error)
		}
		console.log('Message sent:', info.messageId)
	})
}

module.exports = router;
