const mongoose = require('mongoose');

tokenSchema = new mongoose.Schema({
    token: String,
})

module.exports = mongoose.model('Tokens',tokenSchema);