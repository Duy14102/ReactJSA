const mongoose = require("mongoose");

const OrderSchema = new mongoose.Schema({
    transportation: {
        order: String,
        quotation: String
    },

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
        },
        type: {
            type: String
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

    kitchenreason: {
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
        default: null,
        type: Date
    },

    completeAt: {
        default: null,
        type: Date
    }
})

module.exports = mongoose.model.Orders || mongoose.model("Orders", OrderSchema);