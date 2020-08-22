const path = require("path");
const express = require("express");
const cookieParser = require("cookie-parser");
const app = express();
const db = require("./db.js");
const api = require("./routes/api");
const test = require("./routes/test");
const logIncomingReq = require("./utils/logIncomingRequest");
const notFound = require("./utils/notfound");
const errorHandle = require("./utils/errorHandle");
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
  
  app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "index.html"));
  });
  app.use("/api", api);
  app.use('/test', test);
  app.use(notFound);
  app.use(errorHandle);

  app.listen(process.env.PORT || config.PORT, () => {
    console.log(`Express Listening at port ${config.PORT}`);
  });
});
