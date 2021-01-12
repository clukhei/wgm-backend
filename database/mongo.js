require("dotenv").config();
const {MongoClient} = require('mongodb')

const mongoClient = new MongoClient(process.env.MONGO_URL, {
    useNewUrlParser: true, 
    useUnifiedTopology: true
})

module.exports = mongoClient