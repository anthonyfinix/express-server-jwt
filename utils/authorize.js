const jwt = require("jsonwebtoken");
const Token = require("../modals/token");

module.exports = (req, res, next) => {
    console.log('authorize middleware');
    // if(!req.get('bearer-token')) return res.status(403).json({err:'access token is required'});
};
