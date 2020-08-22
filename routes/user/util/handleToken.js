const jwt = require("jsonwebtoken");
const { User } = require("../../../modals");
const cookieParser = require("cookie-parser");

module.exports = async (req, res, next) => {
  const token = req.header("x-token");
  if (token) {
    try {
      let { username, email } = jwt.verify(token, process.env.JWT_SECRET);
      req.user = { username, email };
    } catch (error) {
      console.log(`access token${error.message}`);
      try {
        const refreshToken = req.cookies.refreshToken;
        const { username } = jwt.decode(refreshToken);
        const user = await User.findOne({ username: username });
        refreshSecret = process.env.JWT_SECRET + user.password;
        try {
          let { username, email } = await jwt.verify(
            refreshToken,
            refreshSecret
          );
          req.user = { username, email };
        } catch (error) {
          console.log(`refresh token ${error.message}`);
        }
      } catch (error) {
        console.log(error.message);
      }
    }
  }
  next();
};
