const mongoose = require('mongoose')
//connect to db

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URL)
        console.log('DB has been connected :-)');
    } catch (error) {
        console.log("DB connection failed", error.message);
    }
};

module.exports = connectDB;