require('dotenv').config();
const path = require("path");
const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const app = express();
const db = require('./db')

app.use(cors());
app.use(express.json());
app.use(cookieParser());
app.use(express.static("public"));
db.init().then(() => {
  app.listen(process.env.PORT, () => console.log(`Express Listening at port ${process.env.PORT}`));
});
