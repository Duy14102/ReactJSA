const mongoose = require("mongoose");

const TableSchema = new mongoose.Schema({
    customerid: {
        default: null,
        type: String
    },

    tablename: {
        type: String
    },

    tablestatus: {
        type: Number
    },

    tableitems: {
        type: Array
    },

    tabledate: {
        default: null,
        type: Date
    },

    qrcode: {
        default: null,
        type: String
    }

})

module.exports = mongoose.model.Menu || mongoose.model("Table", TableSchema);