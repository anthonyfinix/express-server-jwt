// const logger = require('./logger');

module.exports = (req, res, next) => {
  console.log(req.originalUrl);
  next();
};
