const router = require("express").Router();

const login = require("./login");
const logout = require("./logout");
const register = require("./register");
const refresh = require("./refresh");

router.post("/login", login);
router.post("/logout", logout);
router.post("/register", register);
router.post("/refresh", refresh);

module.exports = router;
