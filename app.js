const express = require("express");
const path = require("path");
const cors = require("cors"); // Import CORS
const bodyParser = require("body-parser");
require("dotenv").config();

// Import MongoDB connection from db.js
require("./config/db");  // Ensure this file is correctly connecting to MongoDB



const userRouter = require("./routes/users");
const playerRouter = require("./routes/players");

const app = express();
const port = process.env.PORT || 4000;


// ✅ Enable CORS (Allow requests from frontend)
app.use(cors());
// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

// Routes
app.use("/users", userRouter);
app.use("/players", playerRouter);

// Start server
app.listen(port, () => {
  console.log(`🚀 Server running on port ${port}`);
});
