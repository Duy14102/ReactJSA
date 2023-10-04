const mongoose = require("mongoose");

const OrderSchema = new mongoose.Schema({
    datetime: {
        type: String
    },

    fullname: {
        type: String,
        required: [true, "Please provide an name!"],
    },

    phonenumber: {
        type: String,
        required: [true, "Please provide a phone numbers!"],
    },

    address: {
        type: String,
        required: [true, "Please provide an address!"],
    },

    paymentmethod: {
        type: Number
    },

    totalprice: {
        type: Number
    },

    denyreason: {
        default: null,
        type: String
    },

    status: {
        type: Number
    },

    orderitems: {
        require: true,
        type: Array
    }
})

module.exports = mongoose.model.Orders || mongoose.model("Orders", OrderSchema);