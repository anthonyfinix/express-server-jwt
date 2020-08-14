const jwt = require("jsonwebtoken");
const User = require("../../../modals/user");
const Token = require("../../../modals/token");
const deCrypt = require("../util/deCryptPassword");

module.exports = async (user) => {
  let isUser = await User.find({ username: user.username });
  if (!isUser.length) return { err: "You are not registered" };
  let isPassword = await deCrypt(user.password, isUser[0].password);
  if (!isPassword) return { err: "Password not match" };
  let accessToken = jwt.sign(
    {
      username: isUser[0].username,
      email: isUser[0].email,
      name: isUser[0].name,
    },
    process.env.ACCESS_TOKEN,
    { expiresIn: "7d" }
  );
  let refreshToken = jwt.sign(
    { username: isUser[0].username },
    process.env.REFRESH_TOKEN,
    { expiresIn: "4w" }
  );
  let response = {
    name: isUser[0].name,
    username: isUser[0].username,
    email: isUser[0].email,
    accessToken,
    refreshToken,
  };
  await new Token({ token: refreshToken }).save();
  return response;
};
