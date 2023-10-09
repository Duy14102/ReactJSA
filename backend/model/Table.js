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
    }

})

module.exports = mongoose.model.Menu || mongoose.model("Table", TableSchema);