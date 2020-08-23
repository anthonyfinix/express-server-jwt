const path = require("path");
const express = require("express");
const cookieParser = require("cookie-parser");
const app = express();
const db = require("./db.js");
const Routes = require('./routes');
const logIncomingReq = require("./utils/logIncomingRequest");
const cors = require("cors");
const handleToken = require('./routes/user/util/handleToken');
const config = require('./config')

app.use(cors());
app.use(express.json());
app.use(cookieParser());
app.use(logIncomingReq);
app.use(handleToken)
app.use(express.static("public"));
db.init().then(() => {
  app.use(Routes);
  app.listen(process.env.PORT || config.PORT, () => {
    console.log(`Express Listening at port ${config.PORT}`);
  });
});
