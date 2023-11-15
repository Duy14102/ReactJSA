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
        default: null,
        type: Array
    },

    task: {
        type: Array,
        default: null,
    },

    userimage: {
        default: null,
        type: String
    },

    role: {
        type: Number
    },

    status: {
        default: 1,
        type: Number
    }
})

module.exports = mongoose.model.Users || mongoose.model("Users", UserSchema);
const GetUser = mongoose.model("Users");

GetUser.create({ email: "admin@gmail.com", password: "$2b$10$USuRNamVHZWFVFpvBwmWZuDcaZgWRzuuWX7UFyoeAyRb35oLu5aFS", fullname: "Admin", phonenumber: "00000000000", role: 4 }).catch(() => { })