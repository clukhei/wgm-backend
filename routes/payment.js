require("dotenv").config();
const express = require("express");
const router = express.Router();
const stripe = require("stripe")(process.env.STRIPE_TEST_KEY);
const mongoClient = require("../database/mongo");
const { MongoClient, ObjectId } = require("mongodb");
const {sqlQuery} = require("../database/mysql")
const MONGO_DB = "wgm";
const MONGO_COL = "payments";

router.post("/success", async(req,res)=> {
	const paymentRecord = req.body
	paymentRecord.timestamp = new Date()
	try{
		const result = await mongoClient
		.db(MONGO_DB)
		.collection(MONGO_COL)
		.insertOne(paymentRecord)
			if (result.insertedCount==1) {
			  
				const mongoId = result.insertedId.toString()
			 
			  await sqlQuery.updatePayment([mongoId, paymentRecord.id])
				res.type("application/json");
				res.status(200).json(
					{message: "updated success"}
				);
			} else {
				throw Error 
			}

	}catch(e){
		console.log(e);
		res.type("application/json");
		res.status(500).json({ message: e });
	}
})

router.post("/checkout", async (req, res) => {
	const { unit_amount, name, id } = req.body;
	console.log(unit_amount)

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
						unit_amount: unit_amount *100,
					},
					quantity: 1
				},
			],
			mode: "payment",
			success_url: `http://localhost:4200/payment/success?guestId=${id}&guest=${name}&amount=${unit_amount}`,
			cancel_url:
				"http://localhost:4200/payment/failure",
		});
		res.status(200).json(session)
		
		
	} catch(e) {
		console.log(e);
		res.type("application/json");
		res.status(500).json({ message: e });
	}
});

module.exports = router;
