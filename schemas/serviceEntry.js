let mongoose = require('mongoose');

let serviceEntrySchema = new mongoose.Schema({
    yearcode: Number,
    compcode: Number,
    entryno: {
        type: Number,
        required: true,
        unique: true,
        default: 0
    },
    entrydate: Date,
    billno: Number,
    billdate: Date,
    jcno: Number,
    jcdate: Date,
    jctype: Number,
    jsstatus: String,
    servicestatus: String,
    intime: Date,
    outtime: Date,
    narration: String,
    vendorid: Number,
    customerid: Number,
    serviceengineerid: Number,
    products: [
        {
            sno: Number,
            productid: Number,
            productname: String,
            quantity: Number,
            rate: Number,
            amount: Number,
            taxper: Number,
            taxamount: Number,
            taxableamount: Number,
            loading: Number,
            unloading: Number,
            discountper: Number,
            discountamount: Number,
            totalamount: Number
        }
    ],
    createdby: String,
    createdat: { type: Date, default: Date.now },
    modifiedby: String,
    modifiedat: Date,
});

module.exports = mongoose.model('serviceEntry', serviceEntrySchema);