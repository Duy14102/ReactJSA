const mongoose = require("mongoose");

const OrderSchema = new mongoose.Schema({
    datetime: {
        type: String
    },

    user: {
        default: null,
        type: Array
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

    shippingfee: {
        default: null,
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