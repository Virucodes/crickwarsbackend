const mongoose = require("mongoose");
require("dotenv").config();

const mongoURI = process.env.MONGO_URI || "mongodb+srv://virajmane082:viru123@cluster0.072pt.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

mongoose
  .connect(mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected to MongoDB database ✅"))
  .catch((err) => console.error("Database connection error ❌", err));

module.exports = mongoose;
