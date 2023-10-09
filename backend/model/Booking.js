const mongoose = require("mongoose");

const BookingSchema = new mongoose.Schema({
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
        type: String
    },

    status: {
        type: Number
    },

    message: {
        default: null,
        type: String
    },

}, { timestamps: { createdAt: true, updatedAt: false } })

module.exports = mongoose.model.Menu || mongoose.model("Booking", BookingSchema);