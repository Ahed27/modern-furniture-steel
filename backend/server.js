require("dotenv").config();
const express = require('express');
const cors = require('cors');
// 1️⃣ تعريف sequelize بشكل صحيح
const sequelize = require('./src/config/database');
const app = express();
app.use(cors());
app.use(express.json());
