const { Token } = require("../../../modals");
const jwt = require("jsonwebtoken");
module.exports = async (refreshToken) => {
  if (refreshToken === null) return { err: "no refresh token" };
  let token = await Token.find({ token: refreshToken });
  if (!token.length) return { err: "not a valid token" };
  let username;
  try {
    username = jwt.verify(token[0].token, process.env.REFRESH_TOKEN);
  } catch (error) {
    return { err: error.message };
  }
  return { token: jwt.sign({ name: username }, process.env.ACCESS_TOKEN) };
};
