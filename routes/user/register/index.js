const bcrypt = require("bcrypt");
const { userRegistrationSchema } = require("../../../utils/joi_schema");
const User = require("../../../modals/user");

module.exports = async (req, res) => {
  const { name, username, password, confirmPassword, email } = req.body;
  const result = userRegistrationSchema.validate({
    name,
    username,
    password,
    confirmPassword,
    email,
  });
  if (result.error) return res.json({ err: result.error.message });
  let isEmailUsed = await User.find({ email });
  if (isEmailUsed.length) return res.json({ err: "email address already registered" });
  let isUsernameUsed = await User.find({ username });
  if (isUsernameUsed.length) return res.json({ err: "username already taken" });
  let hashedPassword = await bcrypt.hash(password, round).then((hash) => hash);
  let newUser = new User({ name, username, email, password: hashedPassword });
  let response = await newUser.save();
  res.json({ success: `user ${response.name} has been created` });
};
