const mongoose = require("mongoose");

const MenuShema = new mongoose.Schema({
    foodname: {
        type: String,
        required: [true, "Please provide a Name!"],
        unique: [true, "Name Exist"],
    },

    foodprice: {
        type: Number,
        required: [true, "Please provide a price!"],
        unique: false,
    },

    foodquantity: {
        type: Number,
        required: [true, "Please provide a number!"],
        unique: false,
    },

    foodcategory: {
        type: String,
        required: [true, "Please provide a category!"],
        unique: false,
    },

    fooddescription: {
        type: String,
        required: false,
        unique: false,
    },

    foodimage: {
        type: String
    }
})

module.exports = mongoose.model.Menu || mongoose.model("Menu", MenuShema);