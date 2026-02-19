require("dotenv").config();
const express = require('express');
const cors = require('cors');
// 1️⃣ تعريف sequelize بشكل صحيح
const connectDB = require("./src/config/database");
connectDB();
const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log (`Server running on port ${PORT}`));