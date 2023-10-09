const mongoose = require("mongoose");

const ContactSchema = new mongoose.Schema({
    name: {
        type: String
    },

    email: {
        type: String
    },

    title: {
        type: String
    },

    message: {
        type: String
    },
}, { timestamps: { createdAt: true, updatedAt: false } })

module.exports = mongoose.model.Menu || mongoose.model("Contact", ContactSchema);