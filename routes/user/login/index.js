const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../../../modals/user");

module.exports = async (req, res) => {
  const { username, password } = req.body;
  let user = await User.findOne({ username: username });
  console.log(user);
  if (!user) return res.json({ err: "You are not registered" });
  let isPassword = await bcrypt.compare(password, user.password);
  if (!isPassword) return res.json({ err: "Password does not match" });
  let accessToken = jwt.sign(
    { username: user.username, email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: "10s" }
  );
  let response = {
    name: user.name,
    username: user.username,
    email: user.email,
    accessToken,
  };

  let refreshToken = jwt.sign(
    { username: user.username, email: user.email },
    process.env.JWT_SECRET + user.password,
    { expiresIn: "7d" }
  );
  res.set({ "x-token": accessToken });
  res.cookie("refreshToken", refreshToken, {
    maxAge: 86400000,
    httpOnly: true,
  });
  res.json(response);
};
