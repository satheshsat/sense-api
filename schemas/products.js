let mongoose = require('mongoose');

let productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
    },
    units: String,
    taxper: Number,
    prate: Number,
    srate: Number,
    mrp: Number,
    mstk: Number,
    opstk: Number,
    hsn: Number,
    createdby: String,
    createdat: { type: Date, default: Date.now },
    modifiedby: String,
    modifiedat: Date,
});

module.exports = mongoose.model('Products', productSchema);