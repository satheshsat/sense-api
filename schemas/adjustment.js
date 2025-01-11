let mongoose = require('mongoose');

let adjustmentSchema = new mongoose.Schema({
    yearcode: Number,
    compcode: Number,
    entryno: {
        type: Number,
        required: true,
        unique: true,
        default: 0
    },
    entrydate: Date,
    narration: String,
    dorc: String,
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

module.exports = mongoose.model('adjustment', adjustmentSchema);