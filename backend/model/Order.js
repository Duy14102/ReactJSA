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
        method: {
            type: Number
        },
        status: {
            type: Number
        }
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
    },

    createdAt: {
        default: Date.now(),
        type: Date
    },
    
    completeAt: {
        default: null,
        type: Date
    }
})

module.exports = mongoose.model.Orders || mongoose.model("Orders", OrderSchema);