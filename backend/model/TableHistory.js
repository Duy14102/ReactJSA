const mongoose = require("mongoose");

const TableHistorySchema = new mongoose.Schema({
    customerid: {
        default: null,
        type: String
    },

    tablename: {
        type: String
    },

    tableitems: {
        type: Array
    },

    tabledate: {
        type: Date
    },

    datefinish: {
        type: Date
    },

    employee: {
        default: null,
        type: Array
    }

})

module.exports = mongoose.model.Menu || mongoose.model("TableHistory", TableHistorySchema);