const mongoose = require("mongoose");

const NewsSchema = new mongoose.Schema({
    title: {
        type: String
    },

    message: {
        type: String
    },

    status: {
        type: Number
    }
}, { timestamps: { createdAt: true, updatedAt: false } })

module.exports = mongoose.model.Menu || mongoose.model("News", NewsSchema);