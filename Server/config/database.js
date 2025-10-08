const mongoose = require("mongoose")

const MONGODB_URL = process.env.MONGODB_URL;

const dbConnect = () => {
    mongoose.connect(MONGODB_URL)
    .then(()=> console.log("DB connection is successfull !"))
    .catch((error) => {
        console.log("Issue in Db connection !");
        console.error(error.message);
        process.exit(1);
    });
}
module.exports = dbConnect;