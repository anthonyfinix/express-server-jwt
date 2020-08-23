const Routes = require("express").Router();
const api = require("../routes/api");
const test = require("../routes/test");
const notFound = require("../utils/notfound");
const errorHandle = require("../utils/errorHandle");

Routes.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});
Routes.use("/api", api);
Routes.use("/test", test);
Routes.use(notFound);
Routes.use(errorHandle);

module.exports = Routes;
