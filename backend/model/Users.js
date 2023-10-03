const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
    email: {
        type: String,
        required: [true, "Please provide an Email!"],
        unique: [true, "Email Exist"],
    },

    password: {
        type: String,
        required: [true, "Please provide a password!"],
    },

    fullname: {
        type: String,
        required: [true, "Please provide a name!"],
    },

    phonenumber: {
        type: String,
        required: [true, "Please provide a name!"],
        unique: [true, "Phone Number Exist"],
    },

    address: {
        type: Array
    },

    userimage: {
        default: null,
        type: String
    },

    role: {
        type: Number
    }
})

module.exports = mongoose.model.Users || mongoose.model("Users", UserSchema);