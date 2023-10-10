const mongoose = require("mongoose");

const BookingSchema = new mongoose.Schema({
    employee: {
        type: Array,
        default: null
    },

    name: {
        type: String
    },

    email: {
        type: String
    },

    date: {
        type: Date
    },

    people: {
        type: Number
    },

    denyreason: {
        default: null,
        type: String
    },

    status: {
        type: Number
    },

    message: {
        default: null,
        type: String
    },

    fulltotal: {
        type: String,
        default: null
    }

}, { timestamps: { createdAt: true, updatedAt: false } })

module.exports = mongoose.model.Menu || mongoose.model("Booking", BookingSchema);