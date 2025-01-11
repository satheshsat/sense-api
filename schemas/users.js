let mongoose = require('mongoose');

let userSchema = new mongoose.Schema({
    name: String,
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
    },
    role: String,
    password: String,
    createdby: String,
    createdat: { type: Date, default: Date.now },
    modifiedby: String,
    modifiedat: Date,
});

module.exports = mongoose.model('Users', userSchema);