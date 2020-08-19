const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../../../modals/user");

module.exports = async (req, res) => {
  const { username, password } = req.body;
  let isUser = await User.find({ username });
  if (!isUser.length) return { err: "You are not registered" };
  let isPassword = await bcrypt.compare(password, isUser[0].password);
  if (!isPassword) return { err: "Password does not match" };
  let accessToken = jwt.sign(
    {
      username: isUser[0].username,
      email: isUser[0].email,
      name: isUser[0].name,
    },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );
  let response = {
    name: isUser[0].name,
    username: isUser[0].username,
    email: isUser[0].email,
    accessToken,
  };
  return response;
};
