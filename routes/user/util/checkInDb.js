const User = require("../../../modals/user");

module.exports = {
    username = (username)=>{
        let isUser = await User.find({ username: user.username });
        if (!isUser.length) return false;
        return true
    },
    email = (email)=>{
        let isUser = await User.find({ email: email });
        if (!isUser.length) return false;
        return true
    }
}
