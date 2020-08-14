const generateAccessToken = require("../util/generateAccessToken");

module.exports = async (req, res) => {
  const { refreshToken } = req.body;
  generateAccessToken(refreshToken).then((response) => res.json(response));
};
