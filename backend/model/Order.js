const mongoose = require("mongoose");

const OrderSchema = new mongoose.Schema({
    user: {
        default: null,
        type: Array
    },

    employee: {
        type: Array,
        default: null
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
}, { timestamps: { createdAt: true, updatedAt: false } })

module.exports = mongoose.model.Orders || mongoose.model("Orders", OrderSchema);