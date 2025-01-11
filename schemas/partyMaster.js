let mongoose = require('mongoose');

let productSchema = new mongoose.Schema({
    pcode: {
        type: Number,
        required: true,
        unique: true,
        default: 0
    },
    name: {
        type: String,
        required: true,
        unique: true,
    },
    address1: String,
    address2: String,
    address3: String,
    place: String,
    city: String,
    mobileno: String,
    groupcode: String,
    gstno: String,
    gpayid: String,
    banckaccno: String,
    ifsc: String,
    bankaccname: String,
    bankacctype: String,
    createdby: String,
    createdat: { type: Date, default: Date.now },
    modifiedby: String,
    modifiedat: Date,
});

module.exports = mongoose.model('Products', productSchema);