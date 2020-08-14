const authenticate = require("../util/authenticate");

module.exports = async (req, res) => {
  const { username, password } = req.body;
  let response = await authenticate({ username, password });
  if(response.err) return res.json({err:response.err});
  res.cookie("refreshToken", response.refreshToken, {
    maxAge: 60 * 60 * 24 * 365 * 10,
    httOnly: true,
  });
  res.json({ name:response.name,username:response.username,email:response.email,token:response.accessToken });
};
