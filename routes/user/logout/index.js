module.exports = (req, res) => {
  res.clearCookie('refreshToken')
  res.json({success:'successfully logged out'})
};
