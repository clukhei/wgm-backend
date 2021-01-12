require("dotenv").config();
const express = require("express");
const router = express.Router();
const stripe = require("stripe")(process.env.STRIPE_TEST_KEY);
const mongoClient = require("../database/mongo");
const { MongoClient, ObjectId } = require("mongodb");
const {sqlQuery} = require("../database/mysql")
const MONGO_DB = "wgm";
const MONGO_COL = "payments";

router.post("/checkout", async (req, res) => {
	const { angBao, name, id } = req.body;
	try {
		const session = await stripe.checkout.sessions.create({
			payment_method_types: ["card"],
			line_items: [
				{
					price_data: {
						currency: "sgd",
						product_data: {
							name: "Ang Bao",
						},
						unit_amount: angBao,
					},
					quantity: 1,
				},
			],
			mode: "payment",
			success_url: "https://www.entrepreneur.com/article/244428",
			cancel_url:
				"https://medium.com/better-programming/embrace-failure-its-part-of-the-journey-to-success-9322800a7752",
		});
		console.log(session);
		if (session.id) {
			const paymentRecord = {
				name,
				guestId: id,
				amount: angBao,
				paymentSessionId: session.id,
				timestamp: new Date(),
			};

			const result = await mongoClient
				.db(MONGO_DB)
				.collection(MONGO_COL)
                .insertOne(paymentRecord)
					if (result.insertedCount==1) {
                        console.log(result)
                        const mongoId = result.insertedId.toString()
                        console.log(mongoId)
                      await sqlQuery.updatePayment([mongoId, id])
						res.type("application/json");
						res.status(200).json({
							mongoId,
							paymentSessionId: session.id,
						});
					}
				
		}
	} catch (e) {
		console.log(e);
		res.type("application/json");
		res.status(500).json({ message: e });
	}
});

module.exports = router;