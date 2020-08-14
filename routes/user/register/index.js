const addUser = require("../util/addUser");

module.exports = async (req, res) => {
    const { name, username, password, confirmPassword, email } = req.body;
    addUser({ name, username, password, confirmPassword, email }).then(
      (response) => {
        res.json(response);
      }
    );
  }