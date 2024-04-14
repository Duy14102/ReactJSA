// Backed and express
const express = require('express');
const http = require("http");
const https = require("https")
const NodeGeocoder = require('node-geocoder');
const axios = require("axios");
const CryptoJS = require("crypto-js");
const app = express();
const server = http.createServer(app);
// Connect to MongoDB
const mongoose = require('mongoose');
require('dotenv').config({ path: "../.env" })
mongoose.connect(process.env.REACT_APP_mongoAtlasString).then(() => console.log('Connected To MongoDB')).catch((err) => { console.error(err); });
app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization"
    );
    res.setHeader(
        "Access-Control-Allow-Methods",
        "GET, POST, PUT, DELETE, PATCH, OPTIONS"
    );
    next();
});
const cloudinary = require('cloudinary').v2
cloudinary.config({
    cloud_name: process.env.REACT_APP_cloud_name,
    api_key: process.env.REACT_APP_api_key,
    api_secret: process.env.REACT_APP_api_secret
});
const cors = require('cors');
const bodyParser = require('body-parser');
console.log("App listen at port 3000");
app.use(bodyParser.json({ limit: '50mb', extended: true }));
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true, parameterLimit: 50000 }));
app.use(bodyParser.text({ limit: '200mb' }));
app.use(express.json());
app.use(cors());
app.get("/", (req, resp) => {
    resp.send("App is working");
});

server.listen(3000);

// Model
const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');
const User = require("./model/Users");
const moment = require('moment')
const request = require('request')
const getUserD = mongoose.model("Users");
const TableHistory = require("./model/TableHistory");
const GetTableHistory = mongoose.model("TableHistory");
const Menu = require('./model/Menu');
const getThisMenu = mongoose.model("Menu");
const Order = require('./model/Order');
const getThisOrder = mongoose.model("Orders");
const Contact = require("./model/Contact");
const getContactNow = mongoose.model("Contact");
const Booking = require("./model/Booking");
const GetBooking = mongoose.model("Booking");
const Table = require("./model/Table");
const GetTable = mongoose.model("Table");
const News = require("./model/News");
const GetNews = mongoose.model("News");
const UI = require("./model/UI");
const GetUI = mongoose.model("UI");

//Socket IO

const socketIo = require("socket.io")(server, {
    cors: {
        origin: "*",
    }
});

socketIo.on("connection", (socket) => {

    //Register by Socket
    socket.on("RegisterSocket", function (data) {
        bcrypt
            .hash(data.password, 10)
            .then((hashedPassword) => {
                const user = new User({
                    email: data.email,
                    password: hashedPassword,
                    fullname: data.fullname,
                    phonenumber: data.phone,
                    role: 1,
                });
                user.save()
                    .then(() => {
                        socketIo.emit("RegisterSuccess", { fullname: user.fullname, email: data.email });
                    })
                    .catch((error) => {
                        socketIo.emit("RegisterFail", { email: data.email });
                    });
            })
            .catch((e) => {
                socketIo.emit("RegisterFail", { e });
            });
    })

    //Change Hero Image
    socket.on("ChangeHeroImageSocket", async function (data) {
        await cloudinary.uploader.destroy(`UI/${data.name}`).then(() => {
            cloudinary.uploader.upload(data.image, {
                public_id: data.name, folder: "UI"
            }).then((result) => {
                GetUI.updateOne({ title: data.title, "image.name": data.name }, { "image.$.url": result.url }).
                    then(() => { socketIo.emit("ChangeHeroImageSuccess"), { title: data.title, mag: data.mag } }).
                    catch(() => { socketIo.emit("ChangeHeroImageFail"), { title: data.title, mag: data.mag } })
            }).catch(() => { socketIo.emit("ChangeHeroImageFail"), { title: data.title, mag: data.mag } })
        }).catch(() => { socketIo.emit("ChangeHeroImageFail"), { title: data.title, mag: data.mag } })
    })

    //Change Hero Word
    socket.on("ChangeWordUpSocket", function (data) {
        GetUI.updateOne({ title: data.title }, {
            "word.up": data.wordup
        }).then(() => socketIo.emit("ChangeWordUpSuccess"), { title: data.title, mag: data.mag })
            .catch(() => socketIo.emit("ChangeWordUpFail"), { title: data.title, mag: data.mag })
    })

    socket.on("ChangeWordMiddleSocket", function (data) {
        GetUI.updateOne({ title: data.title }, {
            "word.middle": data.wordmiddle
        }).then(() => socketIo.emit("ChangeWordMiddleSuccess"), { title: data.title, mag: data.mag })
            .catch(() => socketIo.emit("ChangeWordMiddleFail"), { title: data.title, mag: data.mag })
    })

    socket.on("ChangeWordDownSocket", function (data) {
        GetUI.updateOne({ title: data.title }, {
            "word.down": data.worddown
        }).then(() => socketIo.emit("ChangeWordDownSuccess"), { title: data.title, mag: data.mag })
            .catch(() => socketIo.emit("ChangeWordDownFail"), { title: data.title, mag: data.mag })
    })

    socket.on("ChangeWordTimeSocket", function (data) {
        GetUI.updateOne({ title: data.title }, {
            "word.time": data.wordtime
        }).then(() => socketIo.emit("ChangeWordTimeSuccess"), { title: data.title, mag: data.mag })
            .catch(() => socketIo.emit("ChangeWordTimeFail"), { title: data.title, mag: data.mag })
    })

    //Add Contact
    socket.on("AddContactSocket", function (data) {
        const contact = new Contact({
            name: data.name,
            email: data.email,
            title: data.title,
            message: data.message
        });

        contact.save().then(() => {
            socketIo.emit("AddContactSuccess", { email: data.email })
        }).catch(() => {
            socketIo.emit("AddContactFail", { email: data.email })
        });
    })

    //Update News
    socket.on("UpdateNewsSocket", function (data) {
        GetNews.updateOne({ _id: data.id }, {
            title: data.title,
            message: data.message
        }).then(() => {
            if (data.status === 1) {
                socketIo.emit("UpdateNewsSuccess", { mag: data.mag })
            } else {
                socketIo.emit("UpdateNewsSuccess", { data: "Update", mag: data.mag })
            }
        }).catch(() => {
            socketIo.emit("UpdateNewsFail", { mag: data.mag })
        })
    })

    //Delete News
    socket.on("DeleteNewsSocket", function (data) {
        GetNews.deleteOne({ _id: data.id })
            .then(() => { socketIo.emit("UpdateNewsSuccess", { data: "Update", mag: data.mag }) })
            .catch(() => { socketIo.emit("UpdateNewsFail", { mag: data.mag }) })
    })

    //Change Status News
    socket.on("ChangeNewsStatusSocket", function (data) {
        if (data.status === 1) {
            GetNews.updateOne({ _id: data.id }, {
                status: 2
            }).then(() => {
                socketIo.emit("UpdateNewsSuccess", { data: "Update", mag: data.mag })
            }).catch(() => {
                socketIo.emit("UpdateNewsFail", { mag: data.mag })
            })
        }
        if (data.status === 2) {
            GetNews.updateOne({ _id: data.id }, {
                status: 1
            }).then(() => {
                socketIo.emit("UpdateNewsSuccess", { data: "Update", mag: data.mag })
            }).catch(() => {
                socketIo.emit("UpdateNewsFail", { mag: data.mag })
            })
        }
    })

    //Cancel Vnpay payment
    socket.on("CancelVnpayPaymentSocket", function (data, datad) {
        getThisOrder.updateOne({ _id: data.orderid }, {
            denyreason: data.reason,
            status: 6,
            "paymentmethod.type": "Vnpay"
        }).then(() => {
            socketIo.emit("CancelVnpaySuccess", { data: data?.userid })
        }).catch((err) => {
            console.log(err);
        })
    })

    //Paid Vnpay
    socket.on("PaidVnpayPaymentSocket", function (data) {
        getThisOrder.updateOne({ _id: data.orderid }, {
            "paymentmethod.status": 2,
            "paymentmethod.type": "Vnpay"
        }).then(() => {
            socketIo.emit("PaidVnpaySuccess", { data: data?.userid })
        }).catch((err) => {
            console.log(err);
        })
    })

    //Paid Paypal
    socket.on("PaidPaypalPaymentSocket", function (data) {
        getThisOrder.updateOne({ _id: data.orderid }, {
            "paymentmethod.status": 2,
            "paymentmethod.type": "Paypal"
        }).then(() => {
            socketIo.emit("PaidPaypalSuccess", { data: data?.userid })
        }).catch((err) => {
            console.log(err);
        })
    })

    //Paid Cod
    socket.on("PaidCodPaymentSocket", function (data) {
        getThisOrder.updateOne({ _id: data.orderid }, {
            "paymentmethod.type": "COD"
        }).then(() => {
            socketIo.emit("PaidCodSuccess", { data: data?.userid })
        }).catch((err) => {
            console.log(err);
        })
    })

    //Update status order
    socket.on("UpdateStatusOrderSocket", function (data) {
        var hype = data.orderitems
        getThisOrder.updateOne({ _id: data.id }, {
            status: data.status,
            employee: data.employee
        }).then(() => {
            hype.forEach(item => {
                getThisMenu.updateOne({ _id: item.data._id }, {
                    $inc: {
                        foodquantity: -item.quantity
                    }
                }).exec()
            })
            socketIo.emit("UpdateStatusOrderSuccess", { data: data?.userid, emp: data?.empid })
        }).catch(() => {
            socketIo.emit("UpdateStatusOrderFail", { emp: data?.empid })
        })
    })

    //Complete Order
    socket.on("CompleteOrderByEmpSocket", function (data) {
        getThisOrder.updateOne({ _id: data.id }, {
            completeAt: data.date,
            status: data.status,
            "paymentmethod.status": 2
        }).then(() => socketIo.emit("CompleteOrderSuccess", { data: data?.userid, emp: data?.empid }))
            .catch(() => socketIo.emit("CompleteOrderFail", { emp: data?.empid }))
    })

    //Deny Order status
    socket.on("DenyOrderSocket", function (data) {
        getThisOrder.updateOne({ _id: data.id }, {
            denyreason: data.reason,
            $push: {
                employee: data.employee
            },
            status: data.status
        }).then(() => {
            if (data.type === "Normal") {
                socketIo.emit("DenyOrderNormalSuccess", { data: data?.userid, emp: data?.empid })
            } else if (data.type === "CusCancel") {
                socketIo.emit("CustomerWantCancel", { data: data?.userid })
            } else {
                socketIo.emit("DenyOrderPaidSuccess", { data: data?.userid, id: data.id, reason: data.reason, fulltotal: data.fulltotal, date: data.date, emp: data?.empid })
            }
        }).catch(() => {
            socketIo.emit("DenyOrderFail", { data: data?.userid, emp: data?.empid })
        })
    })

    //Deny Order status
    socket.on("DenyOrderWaitingSocket", function (data) {
        getThisOrder.updateOne({ _id: data.id }, {
            $push: {
                employee: data.employee
            },
            status: data.status
        }).then(() => {
            socketIo.emit("DenyOrderWaitingSuccess", { data: data?.userid, emp: data?.empid })
        }).catch(() => {
            socketIo.emit("DenyOrderWaitingFail", { emp: data?.empid })
        })
    })

    //CancelRequestFour
    socket.on("CancelRequestFourSocket", function (data) {
        getThisOrder.updateOne({ _id: data.id }, {
            status: data.status,
            denyreason: null
        }).then(() => socketIo.emit("CancelRequestFourSuccess", { data: data.userid }))
            .catch(() => socketIo.emit("CancelRequestFourFail", { data: data.userid }))
    })

    //total deny totaldenyNow
    socket.on("totaldenyNowSocket", function (data) {
        getThisOrder.updateOne({ _id: data.id }, {
            status: data.status,
            employee: data.employee
        }).then(() => {
            if (data.type === "Normal") {
                socketIo.emit("totaldenyNormalSuccess", { data: data?.userid, emp: data?.empid })
            } else {
                socketIo.emit("totaldenyPaidSuccess", { data: data?.userid, id: data.id, fulltotal: data.fulltotal, date: data.date, emp: data?.empid })
            }
        }).catch(() => socketIo.emit("totaldenyFail", { emp: data?.empid }))
    })

    //Cancel by Mag
    socket.on("CancelByMagSocket", function (data) {
        getThisOrder.updateOne({ _id: data.id }, {
            denyreason: "Canceled by manager.",
            status: 6
        }).then(() => {
            if (data.type === "Normal") {
                socketIo.emit("CancelByMagNormalSuccess", { data: data?.userid, emp: data?.empid, mag: data?.mag })
            } else {
                socketIo.emit("CancelByMagPaidSuccess", { data: data?.userid, id: data.id, fulltotal: data.fulltotal, date: data.date, emp: data?.empid, mag: data?.mag })
            }
        }).catch(() => {
            socketIo.emit("CancelByMagFail", { mag: data?.mag })
        })
    })

    //AddNewBooking
    socket.on("AddNewBookingSocket", function (data) {
        const booking = new Booking({
            customer: data.customer,
            date: data.date,
            people: data.people,
            status: 1,
            message: data.message
        })

        booking.save().then(() => {
            socketIo.emit("AddNewBookingSuccess", { check: data.customer.phonenumber, data: data.customer.id })
        })
            .catch(() => {
                socketIo.emit("AddNewBookingFail", { check: data.customer.phonenumber })
            });
    })

    //Cancel Booking
    socket.on("CancelBookingSocket", function (data) {
        GetBooking.updateOne({ _id: data.id }, {
            status: 5,
            denyreason: data.reason
        }).then(() => {
            socketIo.emit("CancelBookingSuccess", { data: data?.userid })
        }).catch(() => {
            socketIo.emit("CancelBookingFail", { data: data?.userid })
        })

    })

    //Deny Booking
    socket.on("DenyBookingCustomerSocket", function (data) {
        GetBooking.updateOne({ _id: data.id }, {
            status: data.status,
            denyreason: data.denyreason,
            employee: data.employee
        }).then(() => {
            socketIo.emit("DenyBookingSuccess", { data: data?.userid, mag: data.mag })
        }).catch(() => {
            socketIo.emit("DenyBookingFail", { data: data?.userid, mag: data.mag })
        })
    })

    //Add Table when booking
    socket.on("AddTableCustomerSocket", function (data) {
        const dateX = new Date()
        const datenow = new Date(dateX.toLocaleString('en-VI', { timeZone: "Asia/Ho_Chi_Minh" }))
        GetTable.updateOne({ _id: data.tableid }, {
            customerid: data.cusid,
            tablestatus: 2,
            tabledate: datenow
        }).then(() => {
            GetBooking.updateOne({ _id: data.cusid }, {
                table: data.tablename,
                status: 2
            }).then(() => {
                socketIo.emit("AddTableCustomerSuccess", { data: data?.userid, mag: data.mag })
            }).catch(() => {
                socketIo.emit("AddTableCustomerFail", { mag: data.mag })
            })
        }).catch(() => {
            socketIo.emit("AddTableCustomerFail", { mag: data.mag })
        })
    })

    //Add Table by hand
    socket.on("AddTableByHandSocket", function (data) {
        const table = new Table({
            tablename: data.tablename,
            tablestatus: 1
        })
        table.save().then(() => {
            socketIo.emit("AddTableByHandSuccess", { mag: data.mag })
        }).catch(() => {
            socketIo.emit("AddTableByHandFail", { mag: data.mag })
        })
    })

    //Add item to table
    socket.on("AddItemToTableSocket", async function (data) {
        const findDup = await GetTable.findOne({ _id: data.tableid, tableitems: { $elemMatch: { "item.foodname": data.foodname } } })
        const dddd = new Date()
        const dddda = new Date(dddd.toLocaleString('en-VI', { timeZone: "Asia/Ho_Chi_Minh" }))
        if (findDup) {
            GetTable.updateOne({ _id: data.tableid, "tableitems.item.foodname": data.foodname },
                {
                    $inc: {
                        "tableitems.$.quantity": data.quantity,
                    },
                    $set: {
                        "tableitems.$.status": 1
                    }
                }).then(() => {
                    if (data.statusCheck === 1) {
                        findDup.updateOne({ _id: data.tableid }, {
                            tabledate: dddda,
                            tablestatus: 2
                        }).then(() => {
                            socketIo.emit("AddItemToTableSuccess", { mag: data.mag, type: data.type, foodname: data.foodname, quantity: data.quantity, data: data?.userid, tableid: data.tableid })
                        }).catch(() => {
                            socketIo.emit("AddItemToTableFail", { mag: data.mag, type: data.type, tableid: data.tableid })
                        })
                    } else {
                        socketIo.emit("AddItemToTableSuccess", { mag: data.mag, type: data.type, foodname: data.foodname, quantity: data.quantity, data: data?.userid, tableid: data.tableid })
                    }
                }).catch(() => {
                    socketIo.emit("AddItemToTableFail", { mag: data.mag, type: data.type, tableid: data.tableid })
                })
        } else {
            GetTable.updateOne({ _id: data.tableid },
                {
                    $push: {
                        tableitems: data.item
                    }
                }).then(() => {
                    if (data.statusCheck === 1) {
                        GetTable.updateOne({ _id: data.tableid }, {
                            tabledate: dddda,
                            tablestatus: 2
                        }).then(() => {
                            socketIo.emit("AddItemToTableSuccess", { mag: data.mag, type: data.type, foodname: data.foodname, quantity: data.quantity, data: data?.userid, tableid: data.tableid })
                        }).catch(() => {
                            socketIo.emit("AddItemToTableFail", { mag: data.mag, type: data.type, tableid: data.tableid })
                        })
                    } else {
                        socketIo.emit("AddItemToTableSuccess", { mag: data.mag, type: data.type, foodname: data.foodname, quantity: data.quantity, data: data?.userid, tableid: data.tableid })
                    }
                }).catch(() => {
                    socketIo.emit("AddItemToTableFail", { mag: data.mag, type: data.type, tableid: data.tableid })
                })
        }
    })

    //Change Table Name
    socket.on("ChangeTableNameQuickSocket", function (data) {
        GetTable.updateOne({ _id: data.id }, {
            tablename: data.name
        }).then(() => {
            socketIo.emit("ChangeTableNameSuccess", { mag: data.mag })
        }).catch(() => {
            socketIo.emit("ChangeTableNameFail", { mag: data.mag })
        })
    })

    //Delete Table by manager
    socket.on("DeleteTableNowSocket", function (data) {
        GetTable.deleteOne({ _id: data.id })
            .then(() => socketIo.emit("DeleteTableSuccess", { mag: data.mag }))
            .catch(() => socketIo.emit("DeleteTableFail", { mag: data.mag }))

    })

    //Change Table
    socket.on("ChangeTableNowSocket", function (data) {
        GetTable.updateOne({ _id: data.newid }, {
            customerid: data.cusid,
            tableitems: data.items,
            tabledate: data.date,
            tablestatus: 2
        }).then(() => {
            GetTable.updateOne({ _id: data.oldid }, {
                customerid: null,
                tableitems: [],
                tabledate: null,
                tablestatus: 1
            }).then(() => {
                socketIo.emit("ChangeTableSuccess", { mag: data.mag, data: data?.cusid })
            }).catch(() => {
                socketIo.emit("ChangeTableFail", { mag: data.mag })
            })
        }).catch(() => {
            socketIo.emit("ChangeTableFail", { mag: data.mag })
        })
    })

    //Checkout for normal
    socket.on("Checkout4NormalSocket", function (data) {
        var hype = data.TbItemHistory
        const dateX = new Date()
        const datenow = new Date(dateX.toLocaleString('en-VI', { timeZone: "Asia/Ho_Chi_Minh" }))
        const historytb = new TableHistory({
            tablename: data.TbnameHistory,
            tableitems: hype,
            tabledate: data.TbDateHistory,
            datefinish: datenow,
            employee: data.employee
        })
        historytb.save().then(() => {
            GetTable.updateOne({ _id: data.id }, {
                customerid: null,
                tablestatus: 1,
                tableitems: [],
                tabledate: null
            }).then(() => {
                hype.forEach(datad => {
                    getThisMenu.updateMany({ _id: datad.item._id }, {
                        $inc: {
                            foodquantity: -datad.quantity
                        }
                    }).exec()
                })
                socketIo.emit("CheckoutNormalSuccess", { mag: data.mag })
            }).catch(() => {
                socketIo.emit("CheckoutNormalFail", { mag: data.mag })
            })
        }).catch(() => {
            socketIo.emit("CheckoutNormalFail", { mag: data.mag })
        })
    })

    //Checkout for booking
    socket.on("Checkout4BookingSocket", function (data) {
        const dateX = new Date()
        const datenow = new Date(dateX.toLocaleString('en-VI', { timeZone: "Asia/Ho_Chi_Minh" }))
        GetBooking.updateOne({ _id: data.id }, {
            status: 3,
            fulltotal: data.fulltotal,
            employee: data.employee
        }).then(() => {
            var hype = data.TbItemHistory
            const tbhistory = new TableHistory({
                customerid: data.Idhistory,
                tablename: data.TbnameHistory,
                tableitems: hype,
                tabledate: data.TbDateHistory,
                datefinish: datenow,
                employee: data.employee
            })
            tbhistory.save().then(() => {
                GetTable.updateOne({ _id: data.tableid }, {
                    customerid: null,
                    tablestatus: 1,
                    tableitems: [],
                    tabledate: null
                }).then(() => {
                    hype.forEach(datad => {
                        getThisMenu.updateOne({ _id: datad.item._id }, {
                            $inc: {
                                foodquantity: -datad.quantity
                            }
                        }).exec()
                    })
                    socketIo.emit("CheckoutBookingSuccess", { mag: data.mag, data: data.Idhistory })
                }).catch(() => {
                    socketIo.emit("CheckoutBookingFail", { mag: data.mag })
                })
            }).catch(() => {
                socketIo.emit("CheckoutBookingFail", { mag: data.mag })
            })
        }).catch(() => {
            socketIo.emit("CheckoutBookingFail", { mag: data.mag })
        })
    })

    //delete item Qr 
    socket.on("DeleteQritemSocket", async function (data) {
        const getIt = await GetTable.findOne({ _id: data.tableid, "tableitems.item.foodname": data.foodname }).then((resa) => { return resa })
        for (var i = 0; i < getIt.tableitems?.length; i++) {
            var item = getIt.tableitems[i]
            if (data.quantity >= item.quantity) {
                GetTable.updateOne({ _id: data.tableid, "tableitems.item.foodname": data.foodname }, {
                    $pull: {
                        tableitems: {
                            item: data.item.item
                        }
                    }
                }).exec()
            } else {
                GetTable.updateOne({ _id: data.tableid, "tableitems.item.foodname": data.foodname }, {
                    $inc: {
                        "tableitems.$.quantity": -parseInt(data.quantity),
                    },
                }).exec()
            }
        }
        socketIo.emit("DeleteQritemSuccess", { tableid: data.tableid })
    })

    //Checkout 4 Qr
    socket.on("Checkout4QrYeahSocket", async function (data) {
        GetTable.updateOne({ _id: data.id }, {
            tablestatus: 3
        }).then(() => {
            socketIo.emit("Checkout4QrSuccess", { tableid: data.tableid })
        }).catch(() => {
            socketIo.emit("Checkout4QrFail", { tableid: data.tableid })
        })
    })

    //QR Code Access Table
    socket.on("QrCodeTableActiveSocket", async function (data) {
        const dateX = new Date()
        const datenow = new Date(dateX.toLocaleString('en-VI', { timeZone: "Asia/Ho_Chi_Minh" }))
        GetTable.updateOne({ _id: data.id }, {
            customerid: data.cusid,
            tablestatus: 2,
            tabledate: datenow
        }).then(() => {
            socketIo.emit("QrCodeTableActiveSuccess", { tableid: data.id })
        }).catch((er) => {
            console.log(er);
        })
    })

    //Delete account
    socket.on("DeleteAcountSocket", function (data) {
        User.findOne({ _id: data.id }).then(async (user) => {
            const compare = await bcrypt.compare(data.password, user.password)
            if (compare) {
                const checkOrder = await getThisOrder.find({ user: { $elemMatch: { id: data.id } }, status: { $in: [1, 2, 4] } }).exec()
                const checkBooking = await GetBooking.find({ "customer.id": data.id, status: { $in: [1, 2] } }).exec()
                if (checkOrder.length > 0 || checkBooking.length > 0) {
                    socketIo.emit("DeleteAcountFail", { data: data.id, message: "Your orders haven't complete!" })
                }
                else {
                    getUserD.deleteOne({ _id: data.id }).then(() => {
                        socketIo.emit("DeleteAcountSuccess", { data: data.id })
                    }).catch(() => {
                        socketIo.emit("DeleteAcountFail", { data: data.id, message: "Something wrong!" })
                    })
                }
            } else {
                socketIo.emit("DeleteAcountFail", { data: data.id, message: "Password invalid!" })
            }
        })
    })

    //Give Employee Task
    socket.on("GiveTaskEmployeeSocket", function (data) {
        var id = new mongoose.Types.ObjectId().toString();
        const task = { task: data.task, id: id }
        getUserD.updateOne({ _id: data.id }, {
            $push: {
                task: task
            }
        }).then(() => {
            socketIo.emit("GiveTaskSuccess", { mag: data.mag, emp: data.id })
        }).catch(() => {
            socketIo.emit("GiveTaskFail", { mag: data.mag })
        })
    })

    //Finish Task Employee
    socket.on("FinishTaskEmployeeSocket", function (data) {
        const date2 = new Date()
        const datenow = new Date(date2.toLocaleString('en-VI', { timeZone: "Asia/Ho_Chi_Minh" }))
        const date = new Date(datenow).toLocaleDateString()
        const time = new Date(datenow).toLocaleTimeString()
        const datetime = date + " - " + time
        getUserD.updateOne({ _id: data.userid, "task.id": data.taskid }, {
            $set: {
                'task.$.task.datefinish': datetime,
                'task.$.task.status': 2
            }
        }).then(() => {
            socketIo.emit("FinishTaskSuccess", { emp: data.userid })
        }).catch(() => {
            socketIo.emit("FinishTaskFail", { emp: data.userid })
        })
    })

    //Delete contact
    socket.on("DeleteContactSocket", function (data) {
        getContactNow.deleteOne({ _id: data.id })
            .then(() => socketIo.emit("DeleteContactSuccess", { mag: data.mag }))
            .catch(() => socketIo.emit("DeleteContactFail", { mag: data.mag }))
    })

    //Cancel by chef
    socket.on("ChefWantCancelSocket", function (data) {
        getThisOrder.updateOne({ _id: data.id }, {
            status: data.status,
            kitchenreason: data.kitchenreason
        }).then(() => {
            if (data.status === 2.1) {
                socketIo.emit("ChefWantCancelSuccess", { mag: data.mag })
            } else if (data.status === 2) {
                socketIo.emit("ChefWantCancelSuccess2", { mag: data.mag })
            }
        })
    })

    //Ready by chef
    socket.on("ChefReadySocket", function (data) {
        getThisOrder.updateOne({ _id: data.id }, {
            status: 2.3,
        }).then(() => {
            if (data.user !== "none") {
                socketIo.emit("ChefReadySuccess", { user: data.user, mag: data.mag })
            } else {
                socketIo.emit("ChefReadySuccess", { mag: data.mag })
            }
        })
    })

    //Ready to shipping
    socket.on("ShippingReadySocket", async function (data) {
        // Get coordinate
        const options = {
            provider: 'opencage',
            fetch: null, // Optional depending on the providers
            apiKey: process.env.REACT_APP_opencageKey, // for Mapquest, OpenCage, APlace, Google Premier
            formatter: null // 'gpx', 'string', ...
        };
        const geocoder = NodeGeocoder(options);
        const coorRes = await geocoder.geocode({
            address: `${data.address}`,
            countryCode: 'Vietnam',
            limit: 1
        });

        // Lalamove handling
        const API_KEY = process.env.REACT_APP_lalamoveKey;
        const SECRET = process.env.REACT_APP_lalamoveSecret;

        axios.defaults.baseURL = "https://rest.sandbox.lalamove.com"; // URL to Lalamove Sandbox API
        const time = new Date().getTime().toString();
        const region = "VN";
        const method = "POST";
        const path = "/v3/quotations";

        const body = JSON.stringify({
            data: {
                serviceType: "MOTORCYCLE",
                specialRequests: [],
                language: "en_VN",
                stops: [
                    {
                        coordinates: {
                            lat: "20.99495",
                            lng: "105.86195",
                        },
                        address: "18 Đ. Tam Trinh, Mai Động, Hai Bà Trưng, Hà Nội, Việt Nam",
                    },
                    {
                        coordinates: {
                            lat: `${coorRes[0].latitude}`,
                            lng: `${coorRes[0].longitude}`,
                        },
                        address: `${coorRes[0]?.streetName}, ${coorRes[0]?.city}, Việt Nam`,
                    },
                ],
            }
        });

        const rawSignature = `${time}\r\n${method}\r\n${path}\r\n\r\n${body}`;
        const SIGNATURE = CryptoJS.HmacSHA256(rawSignature, SECRET).toString();

        axios.post(path, body, {
            headers: {
                "Content-type": "application/json; charset=utf-8",
                "Authorization": `hmac ${API_KEY}:${time}:${SIGNATURE}`,
                "Accept": "application/json",
                "Market": region,
            },
        }).then(async (result) => {
            // Order
            const phoneCut = data.phonenumber.slice(1)
            const path2 = "/v3/orders";
            const body2 = JSON.stringify({
                data: {
                    quotationId: `${result.data.data.quotationId}`, // Quotation ID from quotation response
                    sender: {
                        stopId: `${result.data.data.stops[0].stopId}`, // Stop Id of the pickup point from quotation response
                        name: "EatCom",
                        phone: "+84439877985",
                    },
                    recipients: [{
                        stopId: `${result.data.data.stops[1].stopId}`, // Stop Id of dropoff point from quotation response
                        name: `${data.name}`,
                        phone: `+84${phoneCut}`,
                        remarks: "THIS IS SANDBOX TEST, DO NOT TAKE THIS ORDER!"
                    }],
                }
            });
            const rawSignature2 = `${time}\r\n${method}\r\n${path2}\r\n\r\n${body2}`;
            const SIGNATURE2 = CryptoJS.HmacSHA256(rawSignature2, SECRET).toString();
            axios.post(path2, body2, {
                headers: {
                    "Content-type": "application/json; charset=utf-8",
                    "Authorization": `hmac ${API_KEY}:${time}:${SIGNATURE2}`,
                    "Accept": "application/json",
                    "Market": region,
                },
            }).then((result) => {
                getThisOrder.updateOne({ _id: data.id }, {
                    status: 5.1,
                    transportation: {
                        order: result.data.data.orderId,
                        quotation: result.data.data.quotationId
                    }
                }).then(() => {
                    if (data.user !== "none") {
                        socketIo.emit("ShippingReadySuccess", { mag: data.mag, user: data.user })
                    } else {
                        socketIo.emit("ShippingReadySuccess", { mag: data.mag })
                    }
                })
            });
        });
    })

    //Expired order
    socket.on("ExpiredOrderSocket", function (data) {
        getThisOrder.updateOne({ _id: data.id }, {
            status: 2.3,
            transportation: null
        }).then(() => {
            if (data.user !== "none") {
                socketIo.emit("ExpiredOrderSuccess", { user: data.user })
            } else {
                socketIo.emit("ExpiredOrderSuccess")
            }
        })
    })

    //cancel order
    socket.on("CancelOrderTransSocket", function (data) {
        getThisOrder.updateOne({ _id: data.id }, {
            status: 6,
            denyreason: data.reason
        }).then(() => {
            if (data.user !== "none") {
                socketIo.emit("CancelOrderTransSuccess", { user: data.user })
            } else {
                socketIo.emit("CancelOrderTransSuccess")
            }
        })
    })
});


// Refresh server
setInterval(() => {
    https.get("https://eatcom.onrender.com", (resa) => {
        console.log("Refresh");
    })
}, 600000);

app.post("/CheckAddressOpenCage", async (req, res) => {
    // Get coordinate
    const options = {
        provider: 'opencage',
        fetch: null, // Optional depending on the providers
        apiKey: process.env.REACT_APP_opencageKey, // for Mapquest, OpenCage, APlace, Google Premier
        formatter: null // 'gpx', 'string', ...
    };
    const geocoder = NodeGeocoder(options);
    const coorRes = await geocoder.geocode({
        address: `${req.body.address}`,
        countryCode: 'Vietnam',
        limit: 1
    });

    if (coorRes.length === 0 || coorRes[0].country !== "Vietnam" || coorRes[0].city !== "Hà Nội") {
        res.status(500).send({
            message: "Incorrect"
        })
    } else {
        // Lalamove handling
        const API_KEY = process.env.REACT_APP_lalamoveKey;
        const SECRET = process.env.REACT_APP_lalamoveSecret;

        axios.defaults.baseURL = "https://rest.sandbox.lalamove.com"; // URL to Lalamove Sandbox API
        const time = new Date().getTime().toString();
        const region = "VN";
        const method = "POST";
        const path = "/v3/quotations";

        const body = JSON.stringify({
            data: {
                serviceType: "MOTORCYCLE",
                specialRequests: [],
                language: "en_VN",
                stops: [
                    {
                        coordinates: {
                            lat: "20.99495",
                            lng: "105.86195",
                        },
                        address: "18 Đ. Tam Trinh, Mai Động, Hai Bà Trưng, Hà Nội, Việt Nam",
                    },
                    {
                        coordinates: {
                            lat: `${coorRes[0].latitude}`,
                            lng: `${coorRes[0].longitude}`,
                        },
                        address: `${coorRes[0]?.streetName}, ${coorRes[0]?.city}, Việt Nam`,
                    },
                ],
            }
        });
        const rawSignature = `${time}\r\n${method}\r\n${path}\r\n\r\n${body}`;
        const SIGNATURE = CryptoJS.HmacSHA256(rawSignature, SECRET).toString();

        axios.post(path, body, {
            headers: {
                "Content-type": "application/json; charset=utf-8",
                "Authorization": `hmac ${API_KEY}:${time}:${SIGNATURE}`,
                "Accept": "application/json",
                "Market": region,
            },
        }).then(async (result) => {
            res.status(201).send(result.data.data.priceBreakdown.total)
        }).catch(() => {
            res.status(500).send({
                message: "Incorrect"
            })
        })
    }
})

//Add address user cart
app.post("/AddAddressUser", async (req, res) => {
    // Get coordinate
    const options = {
        provider: 'opencage',
        fetch: null, // Optional depending on the providers
        apiKey: process.env.REACT_APP_opencageKey, // for Mapquest, OpenCage, APlace, Google Premier
        formatter: null // 'gpx', 'string', ...
    };
    const geocoder = NodeGeocoder(options);
    const coorRes = await geocoder.geocode({
        address: `${req.body.address}`,
        countryCode: 'Vietnam',
        limit: 1
    });

    if (coorRes.length === 0 || coorRes[0].country !== "Vietnam" || coorRes[0].city !== "Hà Nội") {
        res.status(500).send({
            message: "Incorrect"
        })
    } else {
        getUserD.updateOne({ _id: req.body.id }, {
            $push: {
                address: req.body.address
            }
        }).then(() => {
            res.status(201).send("success")
        })
    }
})

app.post("/CheckOrderInLalamove", (req, res) => {
    const API_KEY = process.env.REACT_APP_lalamoveKey;
    const SECRET = process.env.REACT_APP_lalamoveSecret;

    axios.defaults.baseURL = "https://rest.sandbox.lalamove.com"; // URL to Lalamove Sandbox API
    const time = new Date().getTime().toString();
    const region = "VN";
    const method = "GET";
    const path = `/v3/orders/${req.body.id}`;
    const rawSignature = `${time}\r\n${method}\r\n${path}\r\n\r\n`;
    const SIGNATURE = CryptoJS.HmacSHA256(rawSignature, SECRET).toString();

    axios.get(path, {
        headers: {
            "Content-type": "application/json; charset=utf-8",
            "Authorization": `hmac ${API_KEY}:${time}:${SIGNATURE}`,
            "Accept": "application/json",
            "Market": region,
        }, body: {
            "isPODEnabled": true
        }
    }).then(async (result) => {
        res.status(201).send(result.data.data)
    }).catch((er) => {
        console.log(er);
        res.status(500).send("Incorrect")
    })
})

app.post("/CheckDriverInLalamove", (req, res) => {
    const API_KEY = process.env.REACT_APP_lalamoveKey;
    const SECRET = process.env.REACT_APP_lalamoveSecret;

    axios.defaults.baseURL = "https://rest.sandbox.lalamove.com"; // URL to Lalamove Sandbox API
    const time = new Date().getTime().toString();
    const region = "VN";
    const method = "GET";
    const path = `/v3/orders/${req.body.id}/drivers/${req.body.driverId}`;
    const rawSignature = `${time}\r\n${method}\r\n${path}\r\n\r\n`;
    const SIGNATURE = CryptoJS.HmacSHA256(rawSignature, SECRET).toString();

    axios.get(path, {
        headers: {
            "Content-type": "application/json; charset=utf-8",
            "Authorization": `hmac ${API_KEY}:${time}:${SIGNATURE}`,
            "Accept": "application/json",
            "Market": region,
        }, body: {
            "isPODEnabled": true
        }
    }).then(async (result) => {
        res.send(result.data.data)
    })
})

//GetBgHero
app.get("/GetHeroUI", async (req, res) => {
    try {
        const getIt = await GetUI.findOne({ title: "Hero" })
        for (var i = 0; i < getIt.image.length; i++) {
            if (getIt.image[i].name === req.query.name) {
                res.send({ data: getIt.image[i].url })
            }
        }
    } catch (e) {
        console.log(e);
    }
})

//Get Hero 4 Manager
app.get("/GetHeroManager", async (req, res) => {
    try {
        const getIt = await GetUI.find({})
        res.send({ data: getIt })
    } catch (e) {
        console.log(e);
    }
})

//Get Hero Text
app.get("/GetHeroText", async (req, res) => {
    try {
        const getIt = await GetUI.findOne({ title: "Hero" })
        res.send({ data: getIt.word })
    } catch (e) {
        console.log(e);
    }
})

//Get all About
app.get("/GetAllAbout", async (req, res) => {
    try {
        const getIt = await GetUI.findOne({ title: "About" })
        res.send({ data: getIt })
    } catch (e) {
        console.log(e);
    }
})

//Get Menu Cover&Page
app.get("/GetTheMenuWow", async (req, res) => {
    try {
        const getIt = await GetUI.findOne({ title: "Menu" })
        res.send({ data: getIt })
    } catch (e) {
        console.log(e);
    }
})

//Get Foodter
app.get("/GetTheFooter", async (req, res) => {
    try {
        const getIt = await GetUI.findOne({ title: "Footer" })
        res.send({ data: getIt })
    } catch (e) {
        console.log(e);
    }
})

//Get All News
app.get("/GetAllNews", async (req, res) => {
    try {
        const getIt = await GetNews.find({}).sort({ status: -1 })
        const page = parseInt(req.query.page)
        const limit = parseInt(req.query.limit)

        const start = (page - 1) * limit
        const end = page * limit

        const results = {}
        results.total = getIt.length
        results.pageCount = Math.ceil(getIt.length / limit)

        if (end < getIt.length) {
            results.next = {
                page: page + 1
            }
        }
        if (start > 0) {
            results.prev = {
                page: page - 1
            }
        }

        results.result = getIt.slice(start, end)
        res.send({ results });
    } catch (e) {
        console.log(e);
    }
})

//Get News Active
app.get("/GetNewsActive", async (req, res) => {
    try {
        const getIt = await GetNews.find({ status: 2 })
        res.send({ data: getIt })
    } catch (e) {
        console.log(e);
    }
})

//Search All Announce
app.get("/SearchAllAnnounce", async (req, res) => {
    try {
        const proS = await GetNews.find({})
        var proBig = null
        for (var i = 0; i < proS.length; i++) {
            const datetime = new Date(proS[i].createdAt)
            const datetime2 = new Date(req.query.date)
            if (datetime.toLocaleDateString() === datetime2.toLocaleDateString()) {
                proBig = proS
            }
        }
        if (proBig) {
            const getOrder = proBig
            const page = parseInt(req.query.page)
            const limit = parseInt(req.query.limit)

            const start = (page - 1) * limit
            const end = page * limit

            const results = {}
            results.total = getOrder.length
            results.pageCount = Math.ceil(getOrder.length / limit)

            if (end < getOrder.length) {
                results.next = {
                    page: page + 1
                }
            }
            if (start > 0) {
                results.prev = {
                    page: page - 1
                }
            }

            results.result = getOrder.slice(start, end)
            res.send({ results });
        }
    } catch (e) {
        console.log(e);
    }
})

//Add News
app.post("/AddNews", (req, res) => {
    try {
        const thisNews = new News({
            title: req.body.title,
            message: req.body.message,
            status: 1
        })
        thisNews.save().then(() => {
            res.send({ data: "succeed" })
        }).catch((err) => {
            console.log(err);
        })
    } catch (e) {
        console.log(e);
    }
})

// Add Admin
app.post("/AddAdmin", (request, response) => {
    // hash the password
    bcrypt
        .hash(request.body.password, 10)
        .then((hashedPassword) => {
            // create a new user instance and collect the data
            const user = new User({
                email: request.body.email,
                password: hashedPassword,
                fullname: request.body.fullname,
                phonenumber: request.body.phonenumber,
                role: request.body.role,
            });

            // save the new user
            user
                .save()
                // return success if the new user is added to the database successfully
                .then(() => {
                    response.status(201).send({
                        message: "User Created Successfully",
                        fullname: user.fullname,
                    });
                })
                // catch error if the new user wasn't added successfully to the database
                .catch((error) => {
                    response.status(500).send({
                        message: "Error creating user",
                        error,
                    });
                });
        })
        // catch error if the password hash isn't successful
        .catch((e) => {
            response.status(500).send({
                message: "Password was not hashed successfully",
                e,
            });
        });
});

// Login
app.post("/Login", (request, response) => {
    // check if email exists
    User.findOne({ email: request.body.email })

        // if email exists
        .then((user) => {
            // compare the password entered and the hashed password found
            bcrypt
                .compare(request.body.password, user.password)

                // if the passwords match
                .then((passwordCheck) => {

                    // check if password matches
                    if (!passwordCheck) {
                        return response.status(400).send({
                            message: "Passwords does not match"
                        });
                    }
                    if (user.status !== 1) {
                        return response.status(400).send({
                            message: "Your account banned"
                        });
                    }

                    //   create JWT token
                    const token = jwt.sign(
                        {
                            userId: user._id,
                            userName: user.fullname,
                            userEmail: user.email,
                            userRole: user.role,
                            userImage: user.userimage,
                        },
                        "RANDOM-TOKEN",
                        { expiresIn: "24h" }
                    );
                    //   return success response
                    response.status(200).send({
                        message: "Login Successful",
                        email: user.email,
                        token,
                        fullname: user.fullname,
                        role: user.role,
                    });
                })
                // catch error if password does not match
                .catch((error) => {
                    response.status(400).send({
                        message: "Passwords does not match",
                        error,
                    });
                });
        })
        // catch error if email does not exist
        .catch((e) => {
            response.status(404).send({
                message: "Email not found",
                e,
            });
        });
});

//Login with Google
app.get("/LoginWithGoogle", (req, res) => {
    try {
        const token = jwt.sign(
            {
                userId: req.query.id,
                userName: req.query.name,
                userEmail: req.query.email,
                userRole: 1.5,
                userImage: req.query.picture,
            },
            "RANDOM-TOKEN",
            { expiresIn: "24h" }
        );
        res.send({ token })
    } catch (e) {
        console.log(e);
    }
})

//Find user inside adminPanel
app.get("/Find4User", async (req, res) => {
    try {
        const regex = new RegExp(req.query.name, 'i')
        const getIt = await getUserD.find({ fullname: regex })
        const page = parseInt(req.query.page)
        const limit = parseInt(req.query.limit)

        const start = (page - 1) * limit
        const end = page * limit

        const results = {}
        results.total = getIt.length
        results.pageCount = Math.ceil(getIt.length / limit)

        if (end < getIt.length) {
            results.next = {
                page: page + 1
            }
        }
        if (start > 0) {
            results.prev = {
                page: page - 1
            }
        }

        results.result = getIt.slice(start, end)
        res.send({ results });
    } catch (e) {
        console.log(e);
    }
})

//Remove address user
app.post("/RemoveAddressUser", (req, res) => {
    try {
        getUserD.updateOne({ _id: req.body.userid }, {
            $pull: {
                address: req.body.address
            }
        }).then(() => {
            res.send("success")
        }).catch((err) => {
            console.log(err);
        })
    } catch (e) {
        console.log(e);
    }
})

//Get Other User Data
app.get("/GetAllUser", async (req, res) => {
    const sort = { role: -1 }
    try {
        const getuser = await getUserD.find({ role: { $in: [req.query.type, req.query.type2, req.query.pipe, req.query.hype] } }).sort(sort);
        const page = parseInt(req.query.page)
        const limit = parseInt(req.query.limit)

        const start = (page - 1) * limit
        const end = page * limit

        const results = {}
        results.total = getuser.length
        results.pageCount = Math.ceil(getuser.length / limit)

        if (end < getuser.length) {
            results.next = {
                page: page + 1
            }
        }
        if (start > 0) {
            results.prev = {
                page: page - 1
            }
        }

        results.result = getuser.slice(start, end)
        res.send({ results });
    } catch (e) {
        console.log(e);
    }
})

//Get User Data
app.get("/GetAllUser2", async (req, res) => {
    try {
        const getuser = await getUserD.find({ role: req.query.type, status: req.query.status })
        const page = parseInt(req.query.page)
        const limit = parseInt(req.query.limit)

        const start = (page - 1) * limit
        const end = page * limit

        const results = {}
        results.total = getuser.length
        results.pageCount = Math.ceil(getuser.length / limit)

        if (end < getuser.length) {
            results.next = {
                page: page + 1
            }
        }
        if (start > 0) {
            results.prev = {
                page: page - 1
            }
        }

        results.result = getuser.slice(start, end)
        res.send({ results });
    } catch (e) {
        console.log(e);
    }
})

//Banned account
app.post("/BannedByAdmin", (req, res) => {
    try {
        getUserD.updateOne({ _id: req.body.id }, {
            status: req.body.status
        }).then(() => { res.send("succeed") }).catch((err) => { console.log(err); })
    } catch (e) {
        console.log(e);
    }
})

//Get Employee 4 Manager
app.get("/GetEmploy4Mana", async (req, res) => {
    try {
        const getuser = await getUserD.find({ role: 2 })
        const page = parseInt(req.query.page)
        const limit = parseInt(req.query.limit)

        const start = (page - 1) * limit
        const end = page * limit

        const results = {}
        results.total = getuser.length
        results.pageCount = Math.ceil(getuser.length / limit)

        if (end < getuser.length) {
            results.next = {
                page: page + 1
            }
        }
        if (start > 0) {
            results.prev = {
                page: page - 1
            }
        }

        results.result = getuser.slice(start, end)
        res.send({ results });
    } catch (e) {
        console.log(e);
    }
})

//Take Employee Task
app.get("/TakeEmployeeTask", async (req, res) => {
    try {
        const getIt = await getUserD.findOne({ _id: req.query.id })
        res.send({ data: getIt })
    } catch (e) {
        console.log(e);
    }
})

//Get Detail User
app.get("/GetDetailUser", async (req, res) => {
    try {
        const getMenuDetail = await getUserD.findOne({ _id: req.query.userid })
        res.send({ data: getMenuDetail });
    } catch (e) {
        console.log(e);
    }
})

//Change image admin
app.post("/ChangeImageAdmin", async (req, res) => {
    const { base64 } = req.body
    try {
        await cloudinary.uploader.destroy(`Avatar/${req.body.id}`).then(() => {
            cloudinary.uploader.upload(base64, {
                public_id: req.body.id, folder: "Avatar"
            }).then((result) => {
                getUserD.updateOne({ _id: req.body.id }, {
                    userimage: result.url
                }).then(() => {
                    getThisMenu.updateOne({ "review.id": req.body.id }, {
                        $set: {
                            "review.$.image": result.url
                        }
                    }).then(() => {
                        res.send({ data: "succeed" })
                    }).catch((er) => {
                        res.status(500).send(er)
                    })
                }).catch((err) => {
                    res.status(500).send(err)
                })
            }).catch((erry) => { res.status(500).send(erry) })
        })
    } catch (e) {
        console.log(e);
    }
})

// Add Menu
app.post("/UploadMenu", async (request, response) => {
    const { base64 } = request.body;
    const objectid = new mongoose.mongo.ObjectId()
    cloudinary.uploader.upload(base64, {
        public_id: objectid, folder: "Menu"
    }).then((result) => {
        const menu = new Menu({
            _id: objectid,
            foodname: request.body.foodname,
            foodprice: request.body.foodprice,
            foodquantity: request.body.foodquantity,
            foodcategory: request.body.foodcategory,
            fooddescription: request.body.fooddescription,
            foodimage: result.url
        });
        menu.save().then((result) => { response.status(201).send({ message: "Menu Created Successfully", }); }).catch(() => { response.status(500).send({ message: "Error creating menu", }); });
    })
});

// Add Order
app.post("/UploadOrder", (req, res) => {
    try {
        var hype = req.body.orderitems
        var dateX = new Date()
        const datenow = new Date(dateX.toLocaleString('en-VI', { timeZone: "Asia/Ho_Chi_Minh" }))
        const order = new Order({
            user: req.body.user,
            phonenumber: req.body.phonenumber,
            address: req.body.address,
            "paymentmethod.method": req.body.paymentmethod,
            "paymentmethod.status": 1,
            shippingfee: req.body.shippingfee,
            fulltotal: req.body.fulltotal,
            status: 1,
            orderitems: hype,
            createdAt: datenow
        })

        order.save()
            .then((result) => {
                res.send({ message: result._id })
            })
            .catch((error) => {
                res.status(500).send({
                    message: "Error creating order",
                    error,
                });
                console.log(error);
            })
    } catch (e) {
        console.log(e);
    }
})

//Get Order
app.get("/GetThisOrder", async (req, res) => {
    try {
        const getIt = await getThisOrder.find({ _id: req.query.id })
        res.send({ data: getIt });
    } catch (e) {
        res.status(500).send({
            message: "Error",
        });
    }
})

//Get Order UserPanel
app.get("/GetOrderUserPanel", async (req, res) => {
    try {
        const datad = await getThisOrder.find({ user: { $elemMatch: { id: req.query.id } } })
        res.send({ data: datad })
    } catch (e) {
        console.log(e);
    }
})


//Find Order
app.get("/SearchAllOrder", async (req, res) => {
    try {
        const proS = await getThisOrder.find({})
        var proBig = null
        for (var i = 0; i < proS.length; i++) {
            const datetime = new Date(proS[i].createdAt)
            const datetime2 = new Date(req.query.date)
            if (datetime.toLocaleDateString() === datetime2.toLocaleDateString()) {
                proBig = proS
            }
        }
        if (proBig) {
            const getOrder = proBig
            const page = parseInt(req.query.page)
            const limit = parseInt(req.query.limit)

            const start = (page - 1) * limit
            const end = page * limit

            const results = {}
            results.total = getOrder.length
            results.pageCount = Math.ceil(getOrder.length / limit)

            if (end < getOrder.length) {
                results.next = {
                    page: page + 1
                }
            }
            if (start > 0) {
                results.prev = {
                    page: page - 1
                }
            }

            results.result = getOrder.slice(start, end)
            res.send({ results });
        }
    } catch (e) {
        console.log(e);
    }
})

//Get all order
app.get("/GetAllOrderHistory", async (req, res) => {
    const filter = { datetime: -1 }
    try {
        var getOrder = await getThisOrder.find({ status: { $in: [3, 5, 6] } }).sort(filter)
        if (req.query.date) {
            const dateHa = new Date(req.query.date)
            let today = new Date(dateHa)
            let tomorrow = new Date(dateHa)
            today.setHours(today.getHours() - 7)
            tomorrow.setHours(tomorrow.getHours() - 7 + 23)
            tomorrow.setMinutes(tomorrow.getMinutes() + 59)
            getOrder = await getThisOrder.find({ status: { $in: [3, 5, 6] }, createdAt: { $gte: today, $lte: tomorrow } }).sort(filter)
        }
        if (req.query.filter) {
            switch (req.query.filter) {
                case "3":
                    getOrder = await getThisOrder.find({ status: { $in: [3] } }).sort(filter)
                    if (req.query.date) {
                        const dateHa = new Date(req.query.date)
                        let today = new Date(dateHa)
                        let tomorrow = new Date(dateHa)
                        today.setHours(today.getHours() - 7)
                        tomorrow.setHours(tomorrow.getHours() - 7 + 23)
                        tomorrow.setMinutes(tomorrow.getMinutes() + 59)
                        getOrder = await getThisOrder.find({ status: { $in: [3] }, createdAt: { $gte: today, $lte: tomorrow } }).sort(filter)
                    }
                    break;
                case "5":
                    getOrder = await getThisOrder.find({ status: { $in: [5] } }).sort(filter)
                    if (req.query.date) {
                        const dateHa = new Date(req.query.date)
                        let today = new Date(dateHa)
                        let tomorrow = new Date(dateHa)
                        today.setHours(today.getHours() - 7)
                        tomorrow.setHours(tomorrow.getHours() - 7 + 23)
                        tomorrow.setMinutes(tomorrow.getMinutes() + 59)
                        getOrder = await getThisOrder.find({ status: { $in: [5] }, createdAt: { $gte: today, $lte: tomorrow } }).sort(filter)
                    }
                    break;
                case "6":
                    getOrder = await getThisOrder.find({ status: { $in: [6] } }).sort(filter)
                    if (req.query.date) {
                        const dateHa = new Date(req.query.date)
                        let today = new Date(dateHa)
                        let tomorrow = new Date(dateHa)
                        today.setHours(today.getHours() - 7)
                        tomorrow.setHours(tomorrow.getHours() - 7 + 23)
                        tomorrow.setMinutes(tomorrow.getMinutes() + 59)
                        getOrder = await getThisOrder.find({ status: { $in: [6] }, createdAt: { $gte: today, $lte: tomorrow } }).sort(filter)
                    }
                    break;
                default:
                    getOrder = await getThisOrder.find({ status: { $in: [3, 5, 6] } }).sort(filter)
                    if (req.query.date) {
                        const dateHa = new Date(req.query.date)
                        let today = new Date(dateHa)
                        let tomorrow = new Date(dateHa)
                        today.setHours(today.getHours() - 7)
                        tomorrow.setHours(tomorrow.getHours() - 7 + 23)
                        tomorrow.setMinutes(tomorrow.getMinutes() + 59)
                        getOrder = await getThisOrder.find({ status: { $in: [3, 5, 6] }, createdAt: { $gte: today, $lte: tomorrow } }).sort(filter)
                    }
                    break;
            }
        }
        const page = parseInt(req.query.page)
        const limit = parseInt(req.query.limit)

        const start = (page - 1) * limit
        const end = page * limit

        const results = {}
        results.total = getOrder.length
        results.pageCount = Math.ceil(getOrder.length / limit)

        if (end < getOrder.length) {
            results.next = {
                page: page + 1
            }
        }
        if (start > 0) {
            results.prev = {
                page: page - 1
            }
        }

        results.result = getOrder.slice(start, end)
        res.send({ results });
    } catch (e) {
        console.log(e);
    }
})

app.get("/GetAllOrderActive", async (req, res) => {
    const filter = { status: -1, datetime: -1 }
    try {
        var getOrder = await getThisOrder.find({ status: { $in: [1, 2, 2.1, 2.3, 4, 5.1] } }).sort(filter)
        if (req.query.date) {
            const dateHa = new Date(req.query.date)
            let today = new Date(dateHa)
            let tomorrow = new Date(dateHa)
            today.setHours(today.getHours() - 7)
            tomorrow.setHours(tomorrow.getHours() - 7 + 23)
            tomorrow.setMinutes(tomorrow.getMinutes() + 59)
            getOrder = await getThisOrder.find({ status: { $in: [1, 2, 4] }, createdAt: { $gte: today, $lte: tomorrow } }).sort(filter)
        }
        if (req.query.filter) {
            switch (req.query.filter) {
                case "1":
                    getOrder = await getThisOrder.find({ status: { $in: [1] } }).sort(filter)
                    if (req.query.date) {
                        const dateHa = new Date(req.query.date)
                        let today = new Date(dateHa)
                        let tomorrow = new Date(dateHa)
                        today.setHours(today.getHours() - 7)
                        tomorrow.setHours(tomorrow.getHours() - 7 + 23)
                        tomorrow.setMinutes(tomorrow.getMinutes() + 59)
                        getOrder = await getThisOrder.find({ status: { $in: [1] }, createdAt: { $gte: today, $lte: tomorrow } }).sort(filter)
                    }
                    break;
                case "2":
                    getOrder = await getThisOrder.find({ status: { $in: [2] } }).sort(filter)
                    if (req.query.date) {
                        const dateHa = new Date(req.query.date)
                        let today = new Date(dateHa)
                        let tomorrow = new Date(dateHa)
                        today.setHours(today.getHours() - 7)
                        tomorrow.setHours(tomorrow.getHours() - 7 + 23)
                        tomorrow.setMinutes(tomorrow.getMinutes() + 59)
                        getOrder = await getThisOrder.find({ status: { $in: [2] }, createdAt: { $gte: today, $lte: tomorrow } }).sort(filter)
                    }
                    break;
                case "4":
                    getOrder = await getThisOrder.find({ status: { $in: [4] } }).sort(filter)
                    if (req.query.date) {
                        const dateHa = new Date(req.query.date)
                        let today = new Date(dateHa)
                        let tomorrow = new Date(dateHa)
                        today.setHours(today.getHours() - 7)
                        tomorrow.setHours(tomorrow.getHours() - 7 + 23)
                        tomorrow.setMinutes(tomorrow.getMinutes() + 59)
                        getOrder = await getThisOrder.find({ status: { $in: [4] }, createdAt: { $gte: today, $lte: tomorrow } }).sort(filter)
                    }
                    break;
                default:
                    getOrder = await getThisOrder.find({ status: { $in: [1, 2, 4] } }).sort(filter)
                    if (req.query.date) {
                        const dateHa = new Date(req.query.date)
                        let today = new Date(dateHa)
                        let tomorrow = new Date(dateHa)
                        today.setHours(today.getHours() - 7)
                        tomorrow.setHours(tomorrow.getHours() - 7 + 23)
                        tomorrow.setMinutes(tomorrow.getMinutes() + 59)
                        getOrder = await getThisOrder.find({ status: { $in: [1, 2, 4] }, createdAt: { $gte: today, $lte: tomorrow } }).sort(filter)
                    }
                    break;
            }
        }
        const page = parseInt(req.query.page)
        const limit = parseInt(req.query.limit)

        const start = (page - 1) * limit
        const end = page * limit

        const results = {}
        results.total = getOrder.length
        results.pageCount = Math.ceil(getOrder.length / limit)

        if (end < getOrder.length) {
            results.next = {
                page: page + 1
            }
        }
        if (start > 0) {
            results.prev = {
                page: page - 1
            }
        }

        results.result = getOrder.slice(start, end)
        res.send({ results });
    } catch (e) {
        console.log(e);
    }
})

//Update User
app.post("/UpdateUser", async (req, res) => {
    const { base64 } = req.body;
    try {
        User.findOne({ _id: req.body.updateid }).then(async (user) => {
            var hashed = ""
            if (req.body.updatepassword) {
                const compare = await bcrypt.compare(req.body.updatepassword, user.password)
                if (compare) {
                    hashed = user.password
                } else {
                    hashed = await bcrypt.hash(req.body.updatepassword, 10)
                }
            } else {
                hashed = user.password
            }
            if (base64) {
                await cloudinary.uploader.destroy(`Avatar/${req.body.updateid}`).then(() => {
                    cloudinary.uploader.upload(base64,
                        { public_id: req.body.updateid, folder: "Avatar" }).then((result) => {
                            getUserD.updateOne({ _id: req.body.updateid },
                                {
                                    email: req.body.updateemail,
                                    password: hashed,
                                    fullname: req.body.updatefullname,
                                    phonenumber: req.body.updatephone,
                                    userimage: result.url
                                }
                            ).then(() => {
                                getThisMenu.updateOne({ "review.id": req.body.updateid }, {
                                    $set: {
                                        "review.$.image": result.url
                                    }
                                }).then(() => {
                                    res.send({ data: "succeed" })
                                }).catch((er) => {
                                    res.status(500).send(er)
                                })
                            }).catch((err) => {
                                res.status(500).send(err)
                            })
                        }).catch((erro) => { res.status(500).send(erro) });
                }).catch((erri) => { res.status(500).send(erri) })
            } else {
                getUserD.updateOne({ _id: req.body.updateid },
                    {
                        email: req.body.updateemail,
                        password: hashed,
                        fullname: req.body.updatefullname,
                        phonenumber: req.body.updatephone,
                    }
                ).then(() => {
                    res.send({ data: "succeed" })
                }).catch((err) => {
                    res.status(500).send(err)
                })
            }
        })
    } catch (e) {
        console.log(e);
    }
})

//Get Item Menu by Name
app.get("/GetThisMenu", async (req, res) => {
    try {
        const start = parseInt(req.query.start)
        const end = parseInt(req.query.end)
        const getIt = await getThisMenu.find({ foodcategory: req.query.Name }).limit(8);
        var datapush = null
        datapush = getIt.slice(start, end)
        if (datapush) {
            res.send({ data: datapush })
        }
    } catch (e) {
        console.log(e);
    }
})

//Get Home Menu
app.get("/GetHomeMenu", async (req, res) => {
    try {
        const sort = { foodquantity: -1, foodcategory: -1 }
        const getIt = await getThisMenu.find({}).limit(10).sort(sort);
        res.send({ data: getIt })
    } catch (e) {
        console.log(e);
    }
})

//Get Category Menu
app.get("/GetCategoryMenu", async (req, res) => {
    try {
        var getIta = null
        const takeBack = {}
        if (req.query.category.includes("Main")) {
            takeBack["Main"] = "Main"
        }
        if (req.query.category.includes("Meat")) {
            takeBack["Meat"] = "Meat"
        }
        if (req.query.category.includes("Vegetables")) {
            takeBack["Vegetables"] = "Vegetables"
        }
        if (req.query.category.includes("Drink")) {
            takeBack["Drink"] = "Drink"
        }
        switch (req.query.filter) {
            case "nto":
                const sort = { foodquantity: -1, _id: -1 }
                if (req.query.category === "Menu") {
                    getIta = await getThisMenu.find({}).sort(sort)
                } else {
                    getIta = await getThisMenu.find({ foodcategory: { $in: [takeBack?.Main, takeBack?.Meat, takeBack?.Vegetables, takeBack?.Drink] } }).sort(sort)
                }
                break;
            case "otn":
                const sort2 = { foodquantity: -1, _id: 1 }
                if (req.query.category === "Menu") {
                    getIta = await getThisMenu.find({}).sort(sort2)
                } else {
                    getIta = await getThisMenu.find({ foodcategory: { $in: [takeBack?.Main, takeBack?.Meat, takeBack?.Vegetables, takeBack?.Drink] } }).sort(sort2);
                }
                break;
            case "hpf":
                const sort3 = { foodquantity: -1, foodprice: -1 }
                if (req.query.category === "Menu") {
                    getIta = await getThisMenu.find({}).sort(sort3)
                } else {
                    getIta = await getThisMenu.find({ foodcategory: { $in: [takeBack?.Main, takeBack?.Meat, takeBack?.Vegetables, takeBack?.Drink] } }).sort(sort3);
                }
                break;
            case "lpf":
                const sort4 = { foodquantity: -1, foodprice: 1 }
                if (req.query.category === "Menu") {
                    getIta = await getThisMenu.find({}).sort(sort4)
                } else {
                    getIta = await getThisMenu.find({ foodcategory: { $in: [takeBack?.Main, takeBack?.Meat, takeBack?.Vegetables, takeBack?.Drink] } }).sort(sort4);
                }
                break;
            case "atz":
                const sort5 = { foodquantity: -1, foodname: 1 }
                if (req.query.category === "Menu") {
                    getIta = await getThisMenu.find({}).sort(sort5)
                } else {
                    getIta = await getThisMenu.find({ foodcategory: { $in: [takeBack?.Main, takeBack?.Meat, takeBack?.Vegetables, takeBack?.Drink] } }).sort(sort5);
                }
                break;
            default:
                getIta = await getThisMenu.find({ foodcategory: { $in: [takeBack?.Main, takeBack?.Meat, takeBack?.Vegetables, takeBack?.Drink] } }).sort(sort);
                break;
        }

        const page = parseInt(req.query.page)
        const limit = parseInt(req.query.limit)

        const start = (page - 1) * limit
        const end = page * limit

        const results = {}
        results.allMatch = getIta
        results.total = getIta.length
        results.pageCount = Math.ceil(getIta.length / limit)

        if (end < getIta.length) {
            results.next = {
                page: page + 1
            }
        }
        if (start > 0) {
            results.prev = {
                page: page - 1
            }
        }

        results.result = getIta.slice(start, end)
        res.send({ results });
    } catch (e) {
        console.log(e);
    }
})

app.post("/ChefWantCancel", (req, res) => {
    try {
        console.log(req.body);
        getThisOrder.updateOne({ _id: req.body.id }, {
            status: 2.1,
            kitchenreason: req.body.kitchenreason
        }).then(() => {
            res.send("Success")
        }).catch((err) => {
            console.log(err);
        })
    } catch (e) {
        console.log(e);
    }
})

app.get("/GetChefOrder", async (req, res) => {
    const filter = { status: -1 }
    try {
        const getIta = await getThisOrder.find({ status: { $in: [2, 2.1] } }).sort(filter);
        const page = parseInt(req.query.page)
        const limit = parseInt(req.query.limit)

        const start = (page - 1) * limit
        const end = page * limit

        const results = {}
        results.allMatch = getIta
        results.total = getIta.length
        results.pageCount = Math.ceil(getIta.length / limit)

        if (end < getIta.length) {
            results.next = {
                page: page + 1
            }
        }
        if (start > 0) {
            results.prev = {
                page: page - 1
            }
        }
        results.result = getIta.slice(start, end)
        res.send({ results });
    } catch (e) {
        console.log(e);
    }
})

//Get Carousel Detail Page
app.get("/GetSimilarP", async (req, res) => {
    try {
        const getIt = await getThisMenu.find({ foodcategory: req.query.Name }).limit(5);
        res.send({ data: getIt })
    } catch (e) {
        console.log(e);
    }
})

//Get Cart Item
app.get("/GetCartItem", async (req, res) => {
    try {
        const getIt = await getThisMenu.find({ foodname: req.query.name });
        var getTa = null
        if (req.query.id !== "undefined") {
            getTa = await getThisMenu.find({ _id: JSON.parse(req.query.id) }).exec()
        }
        res.send({ data: getIt, quantity: req.query.quantity, topping: getTa });
    } catch (e) {
        console.log(e);
    }
})

//Get Menu 4 Admin
app.get("/GetAdminMenu", async (req, res) => {
    try {
        const getIt = await getThisMenu.find({ foodcategory: req.query.cate });
        const page = parseInt(req.query.page)
        const limit = parseInt(req.query.limit)

        const start = (page - 1) * limit
        const end = page * limit

        const results = {}
        results.total = getIt.length
        results.pageCount = Math.ceil(getIt.length / limit)

        if (end < getIt.length) {
            results.next = {
                page: page + 1
            }
        }
        if (start > 0) {
            results.prev = {
                page: page - 1
            }
        }

        results.result = getIt.slice(start, end)
        res.send({ results });
    } catch (e) {
        console.log(e);
    }
})

//Get all item to add 4 table
app.get("/GetItemCanTable", async (req, res) => {
    try {
        const getIt = await getThisMenu.find({});
        const page = parseInt(req.query.page)
        const limit = parseInt(req.query.limit)

        const start = (page - 1) * limit
        const end = page * limit

        const results = {}
        results.total = getIt.length
        results.pageCount = Math.ceil(getIt.length / limit)

        if (end < getIt.length) {
            results.next = {
                page: page + 1
            }
        }
        if (start > 0) {
            results.prev = {
                page: page - 1
            }
        }

        results.result = getIt.slice(start, end)
        res.send({ results });
    } catch (e) {
        console.log(e);
    }
})

//Get Detail Menu
app.get("/GetDetailMenu", async (req, res) => {
    try {
        const getMenuDetail = await getThisMenu.findOne({ foodname: req.query.foodid })
        res.send({ data: getMenuDetail });
    } catch (e) {
        console.log(e);
    }
})

//Get Search Debounce
app.get("/GetDebounce", async (req, res) => {
    try {
        const regex = new RegExp(req.query.foodSearch, 'i')
        const getSearch = await getThisMenu.find({ foodname: regex }).limit(3)
        res.send({ data: getSearch })
    } catch (e) {
        console.log(e);
    }
})

//Get Search
app.get("/GetSearch", async (req, res) => {
    try {
        const regex = new RegExp(req.query.foodSearch, 'i')
        var getSearch = null
        const takeBack = {}
        if (req.query.category.includes("Main")) {
            takeBack["Main"] = "Main"
        }
        if (req.query.category.includes("Meat")) {
            takeBack["Meat"] = "Meat"
        }
        if (req.query.category.includes("Vegetables")) {
            takeBack["Vegetables"] = "Vegetables"
        }
        if (req.query.category.includes("Drink")) {
            takeBack["Drink"] = "Drink"
        }
        switch (req.query.filter) {
            case "nto":
                const sort = { _id: -1, foodquantity: -1 }
                getSearch = await getThisMenu.find({ foodname: regex, foodcategory: { $in: [takeBack?.Main, takeBack?.Meat, takeBack?.Vegetables, takeBack?.Drink] } }).sort(sort);
                break;
            case "otn":
                const sort2 = { _id: 1, foodquantity: -1 }
                getSearch = await getThisMenu.find({ foodname: regex, foodcategory: { $in: [takeBack?.Main, takeBack?.Meat, takeBack?.Vegetables, takeBack?.Drink] } }).sort(sort2);
                break;
            case "hpf":
                const sort3 = { foodprice: -1, foodquantity: -1 }
                getSearch = await getThisMenu.find({ foodname: regex, foodcategory: { $in: [takeBack?.Main, takeBack?.Meat, takeBack?.Vegetables, takeBack?.Drink] } }).sort(sort3);
                break;
            case "lpf":
                const sort4 = { foodprice: 1, foodquantity: -1 }
                getSearch = await getThisMenu.find({ foodname: regex, foodcategory: { $in: [takeBack?.Main, takeBack?.Meat, takeBack?.Vegetables, takeBack?.Drink] } }).sort(sort4);
                break;
            case "atz":
                const sort5 = { foodname: 1, foodquantity: -1 }
                getSearch = await getThisMenu.find({ foodname: regex, foodcategory: { $in: [takeBack?.Main, takeBack?.Meat, takeBack?.Vegetables, takeBack?.Drink] } }).sort(sort5);
                break;
            default:
                const sort6 = { _id: -1, foodquantity: -1 }
                getSearch = await getThisMenu.find({ foodname: regex, foodcategory: { $in: [takeBack?.Main, takeBack?.Meat, takeBack?.Vegetables, takeBack?.Drink] } }).sort(sort6);
                break;
        }

        if (req.query.category === "Menu") {
            const sort = { _id: -1, foodquantity: -1 }
            getSearch = await getThisMenu.find({ foodname: regex }).sort(sort)
        }

        const page = parseInt(req.query.page)
        const limit = parseInt(req.query.limit)

        const start = (page - 1) * limit
        const end = page * limit

        const results = {}
        results.total = getSearch.length
        results.pageCount = Math.ceil(getSearch.length / limit)

        if (end < getSearch.length) {
            results.next = {
                page: page + 1
            }
        }
        if (start > 0) {
            results.prev = {
                page: page - 1
            }
        }

        results.result = getSearch.slice(start, end)
        res.send({ results });
    } catch (e) {
        console.log(e);
    }
})

//Get Search autocomplete
app.get("/GetSearchAutoComplete", async (req, res) => {
    try {
        const getIt = await getThisMenu.find({})
        var data = []
        for (var i = 0; i < getIt.length; i++) {
            data.push(getIt[i].foodname)
        }
        res.send({ data: data })
    } catch (e) {
        console.log(e);
    }
})

//Get Order
app.get("/GetOrder4Complete", async (req, res) => {
    try {
        const getIt = await getThisOrder.findOne({ _id: req.query.id })
        res.send({ data: getIt })
    } catch (e) {
        console.log(e);
    }
})

// Get Topping
app.get("/GetTopping", async (req, res) => {
    try {
        const sort = { foodquantity: -1 }
        const getIt = await getThisMenu.find({ foodcategory: { $in: ["Meat", "Vegetables", "Drink"] } }).sort(sort)
        res.send({ data: getIt })
    } catch (e) {
        console.log(e);
    }
})

// Get Topping by Cate
app.get("/GetToppingByCate", async (req, res) => {
    try {
        const sort = { foodquantity: -1 }
        const getIt = await getThisMenu.find({ foodcategory: req.query.cate }).sort(sort);

        const page = parseInt(req.query.page)
        const limit = parseInt(req.query.limit)

        const start = (page - 1) * limit
        const end = page * limit

        const results = {}
        results.total = getIt.length
        results.pageCount = Math.ceil(getIt.length / limit)

        if (end < getIt.length) {
            results.next = {
                page: page + 1
            }
        }
        if (start > 0) {
            results.prev = {
                page: page - 1
            }
        }

        results.result = getIt.slice(start, end)
        res.send({ results });
    } catch (e) {
        console.log(e);
    }
})

//Add review in detailmenupage
app.post("/AddReview", (req, res) => {
    try {
        getThisMenu.updateOne({ _id: req.body.id }, {
            $push: {
                review: req.body.review
            }
        }).then(() => {
            res.send({ data: "succeed" })
        }).catch((err) => {
            console.log(err);
        })
    } catch (e) {
        console.log(e);
    }
})

//DeleteReviewByMag
app.post("/DeleteReviewByMag", (req, res) => {
    try {
        getThisMenu.updateOne({ _id: req.body.itemid }, {
            $pull: {
                review: { id: req.body.reviewid }
            }
        }).then(() => {
            res.send({ data: "succeed" })
        }).catch((err) => {
            console.log(err);
        })
    } catch (e) {
        console.log(e);
    }
})

//Get All Review With Pagination
app.get("/GetAllReviewPagination", async (req, res) => {
    try {
        const getIt = await getThisMenu.find({ foodname: req.query.id }, { "review.$": 1 });

        const page = parseInt(req.query.page)
        const limit = parseInt(req.query.limit)

        const start = (page - 1) * limit
        const end = page * limit

        const results = {}
        results.total = getIt.length
        results.pageCount = Math.ceil(getIt.length / limit)

        if (end < getIt.length) {
            results.next = {
                page: page + 1
            }
        }
        if (start > 0) {
            results.prev = {
                page: page - 1
            }
        }

        results.result = getIt.slice(start, end)
        res.send({ results });
    } catch (e) {
        console.log(e);
    }
})

//Delete Menu
app.post("/DeleteMenu", async (req, res) => {
    try {
        await cloudinary.uploader.destroy(`Menu/${req.query.deleteid}`).then(() => {
            getThisMenu.deleteOne({ _id: req.query.deleteid }).then(() => {
                res.send({ data: "Deleted" })
            }).catch((err) => {
                res.send({ data: err })
            })
        })
    } catch (e) {
        console.log(e);
    }
})

//Update Menu
app.post("/UpdateMenu", async (req, res) => {
    const { base64 } = req.body;
    try {
        if (base64) {
            await cloudinary.uploader.destroy(`Menu/${req.body.updateid}`).then(() => {
                cloudinary.uploader.upload(base64, {
                    public_id: req.body.updateid, folder: "Menu"
                }).then((result) => {
                    getThisMenu.updateOne({ _id: req.body.updateid },
                        {
                            foodname: req.body.updatename,
                            foodprice: req.body.updateprice,
                            foodquantity: req.body.updatequantity,
                            foodcategory: req.body.updatecategory,
                            fooddescription: req.body.updatedescription,
                            foodimage: result.url
                        }
                    ).then(() => {
                        res.send({ data: "Updated" })
                    }).catch((err) => { res.status(500).send(err) })
                }).catch((erri) => { res.status(500).send(erri) })
            }).catch((er) => { res.status(500).send(er) })
        } else {
            getThisMenu.updateOne({ _id: req.body.updateid },
                {
                    foodname: req.body.updatename,
                    foodprice: req.body.updateprice,
                    foodquantity: req.body.updatequantity,
                    foodcategory: req.body.updatecategory,
                    fooddescription: req.body.updatedescription,
                }
            ).then(() => {
                res.send({ data: "Updated" })
            }).catch((err) => { res.status(500).send(err) })
        }
    } catch (e) {
        console.log(e);
    }
})

//Get Admin Contact
app.get("/GetContact", async (req, res) => {
    try {
        const getIt = await getContactNow.find({});
        const page = parseInt(req.query.page)
        const limit = parseInt(req.query.limit)

        const start = (page - 1) * limit
        const end = page * limit

        const results = {}
        results.total = getIt.length
        results.pageCount = Math.ceil(getIt.length / limit)

        if (end < getIt.length) {
            results.next = {
                page: page + 1
            }
        }
        if (start > 0) {
            results.prev = {
                page: page - 1
            }
        }

        results.result = getIt.slice(start, end)
        res.send({ results });
    } catch (e) {
        console.log(e);
    }
})

//Get Testi Contact
app.get('/GetTestiCont', async (req, res) => {
    try {
        const getTa = await getContactNow.find({}).limit(5)
        res.send({ data: getTa })
    } catch (e) {
        console.log(e);
    }
})

//Get Booking for token user
app.get("/GetTokenBooking", async (req, res) => {
    try {
        const getIt = await GetBooking.findOne({ "customer.id": req.query.id, status: { $in: [1, 2] } })
        res.send({ data: getIt })
    } catch (e) {
        console.log(e);
    }
})

//Search Booking 4 Admin
app.get("/SearchAllBooking", async (req, res) => {
    try {
        const proS = await GetBooking.find({})
        var proBig = null
        for (var i = 0; i < proS.length; i++) {
            const date = new Date(req.query.date)
            const date2 = new Date(proS[i].createdAt)
            if (date.toLocaleDateString() === date2.toLocaleDateString()) {
                proBig = proS
            }
        }
        if (proBig) {
            const getIt = proBig
            const page = parseInt(req.query.page)
            const limit = parseInt(req.query.limit)

            const start = (page - 1) * limit
            const end = page * limit

            const results = {}
            results.total = getIt.length
            results.pageCount = Math.ceil(getIt.length / limit)

            if (end < getIt.length) {
                results.next = {
                    page: page + 1
                }
            }
            if (start > 0) {
                results.prev = {
                    page: page - 1
                }
            }

            results.result = getIt.slice(start, end)
            res.send({ results });
        }
    } catch (e) {
        console.log(e);
    }
})

//Get Booking By Status
app.get("/GetBookingByStatus", async (req, res) => {
    try {
        const getIt = await GetBooking.find({ status: { $in: [1, 2] } });
        const page = parseInt(req.query.page)
        const limit = parseInt(req.query.limit)

        const start = (page - 1) * limit
        const end = page * limit

        const results = {}
        results.total = getIt.length
        results.pageCount = Math.ceil(getIt.length / limit)

        if (end < getIt.length) {
            results.next = {
                page: page + 1
            }
        }
        if (start > 0) {
            results.prev = {
                page: page - 1
            }
        }

        results.result = getIt.slice(start, end)
        res.send({ results });
    } catch (e) {
        console.log(e);
    }
})

//Get History Booking
app.get("/GetBookingHistory", async (req, res) => {
    try {
        const getIt = await GetBooking.find({ status: { $in: [3, 4, 5] } });
        const page = parseInt(req.query.page)
        const limit = parseInt(req.query.limit)

        const start = (page - 1) * limit
        const end = page * limit

        const results = {}
        results.total = getIt.length
        results.pageCount = Math.ceil(getIt.length / limit)

        if (end < getIt.length) {
            results.next = {
                page: page + 1
            }
        }
        if (start > 0) {
            results.prev = {
                page: page - 1
            }
        }

        results.result = getIt.slice(start, end)
        res.send({ results });
    } catch (e) {
        console.log(e);
    }
})

//Get Booking for table
app.get("/GetTable4BookingHistory", async (req, res) => {
    try {
        const getSome = await GetBooking.findOne({ _id: req.query.cusid })
        res.send({ data: getSome })
    } catch (e) {
        console.log(e);
    }
})

// Get table ACtive
app.get("/GetAllTableActive", async (req, res) => {
    try {
        const getSome = await GetTable.find({ tablestatus: 1 })
        res.send({ data: getSome })
    } catch (e) {
        console.log(e);
    }
})

//Get Table Item for QRcode
app.get("/QrCodeItemTB", async (req, res) => {
    try {
        const getIt = await GetTable.findOne({ _id: req.query.id })
        res.send({ data: getIt })
    } catch (e) {
        console.log(e);
    }
})

//Get Active Table
app.get("/GetTableUse", async (req, res) => {
    try {
        const getIt = await GetTable.find({});
        const page = parseInt(req.query.page)
        const limit = parseInt(req.query.limit)

        const start = (page - 1) * limit
        const end = page * limit

        const results = {}
        results.total = getIt.length
        results.pageCount = Math.ceil(getIt.length / limit)

        if (end < getIt.length) {
            results.next = {
                page: page + 1
            }
        }
        if (start > 0) {
            results.prev = {
                page: page - 1
            }
        }

        results.result = getIt.slice(start, end)
        res.send({ results });
    } catch (e) {
        console.log(e);
    }
})

//Get History Table
app.get("/GetHistoryTable", async (req, res) => {
    try {
        const getIt = await GetTableHistory.find({});
        const page = parseInt(req.query.page)
        const limit = parseInt(req.query.limit)

        const start = (page - 1) * limit
        const end = page * limit

        const results = {}
        results.total = getIt.length
        results.pageCount = Math.ceil(getIt.length / limit)

        if (end < getIt.length) {
            results.next = {
                page: page + 1
            }
        }
        if (start > 0) {
            results.prev = {
                page: page - 1
            }
        }

        results.result = getIt.slice(start, end)
        res.send({ results });
    } catch (e) {
        console.log(e);
    }
})

//update status item
app.post("/UpdateItemQrStatus", (req, res) => {
    try {
        GetTable.updateOne({ _id: req.body.tableid, "tableitems.item.foodname": req.body.foodname }, {
            "tableitems.$.status": req.body.status
        }).then(() => { res.send({ data: "succeed" }) }).catch((err) => { console.log(err); })
    } catch (e) {
        console.log(e);
    }
})

//Get Data For Home Admin
app.get("/GetData4Admin", async (req, res) => {
    try {
        const getUserLength = await getUserD.find({ role: 2 })
        const getOrderLength = await getThisOrder.find({ status: 1 })
        const getTableLength = await GetTable.find({ tablestatus: 2 })
        const getMenuLength = await getThisMenu.find({})
        const activeBooking = await GetBooking.find({ status: 1 })
        const waitingBooking = await GetBooking.find({ status: 2 })
        res.send({ userLength: getUserLength.length, orderLength: getOrderLength.length, menuLength: getMenuLength.length, tableLength: getTableLength.length, actBookingLength: activeBooking.length, waitBookingLength: waitingBooking.length })
    } catch (e) {
        console.log(e);
    }
})

//Get Data For Home Employee
app.get("/GetData4Employee", async (req, res) => {
    try {
        const activeOrder = await getThisOrder.find({ status: 1 })
        const activeTable = await GetTable.find({ tablestatus: 2 })
        const activeBooking = await GetBooking.find({ status: 1 })
        const waitingBooking = await GetBooking.find({ status: 2 })
        res.send({ orderLength: activeOrder.length, tableLength: activeTable.length, actBookingLength: activeBooking.length, waitBookingLength: waitingBooking.length })
    } catch (e) {
        console.log(e);
    }
})

//Get Income by Day
app.get("/GetIncomeDay", async (req, res) => {
    try {
        const getta = await getThisOrder.find({ status: 5 })
        const atteg = await GetTableHistory.find({})
        const kadate = new Date()
        const date = new Date(kadate.toLocaleString('en-VI', { timeZone: "Asia/Ho_Chi_Minh" }))
        var percent8 = 0, percent9 = 0, percent10 = 0, percent11 = 0, percent12 = 0, percent13 = 0, percent14 = 0, percent15 = 0, percent16 = 0, percent17 = 0, percent18 = 0, percent19 = 0, percent20 = 0, percent21 = 0, percent22 = 0
        var eight = 0, nine = 0, ten = 0, elen = 0, twel = 0, third = 0, fourth = 0, fifth = 0, sixth = 0, seventh = 0, eighth = 0, nineth = 0, tenth = 0, elenth = 0, twelth = 0
        var eight2 = 0, nine2 = 0, ten2 = 0, elen2 = 0, twel2 = 0, third2 = 0, fourth2 = 0, fifth2 = 0, sixth2 = 0, seventh2 = 0, eighth2 = 0, nineth2 = 0, tenth2 = 0, elenth2 = 0, twelth2 = 0
        for (var i = 0; i < getta.length; i++) {
            for (var j = 0; j < getta[i].orderitems.length; j++) {
                const dateGetta = new Date(getta[i].createdAt)
                var total2 = 0, total = 0, fulltotal = 0
                var gettaDad = getta[i].orderitems
                if (date.getDate() === dateGetta.getDate()) {
                    if (dateGetta.getHours() === 8) {
                        total = gettaDad[j].quantity * gettaDad[j].data.foodprice
                        total2 += total
                        fulltotal = total2 + getta[i].shippingfee
                        eight += fulltotal
                    }
                    if (dateGetta.getHours() === 9) {
                        total = gettaDad[j].quantity * gettaDad[j].data.foodprice
                        total2 += total
                        fulltotal = total2 + getta[i].shippingfee
                        nine += fulltotal
                    }
                    if (dateGetta.getHours() === 10) {
                        total = gettaDad[j].quantity * gettaDad[j].data.foodprice
                        total2 += total
                        fulltotal = total2 + getta[i].shippingfee
                        ten += fulltotal
                    }
                    if (dateGetta.getHours() === 11) {
                        total = gettaDad[j].quantity * gettaDad[j].data.foodprice
                        total2 += total
                        fulltotal = total2 + getta[i].shippingfee
                        elen += fulltotal
                    }
                    if (dateGetta.getHours() === 12) {
                        total = gettaDad[j].quantity * gettaDad[j].data.foodprice
                        total2 += total
                        fulltotal = total2 + getta[i].shippingfee
                        twel += fulltotal
                    }
                    if (dateGetta.getHours() === 13) {
                        total = gettaDad[j].quantity * gettaDad[j].data.foodprice
                        total2 += total
                        fulltotal = total2 + getta[i].shippingfee
                        third += fulltotal
                    }
                    if (dateGetta.getHours() === 14) {
                        total = gettaDad[j].quantity * gettaDad[j].data.foodprice
                        total2 += total
                        fulltotal = total2 + getta[i].shippingfee
                        fourth += fulltotal
                    }
                    if (dateGetta.getHours() === 15) {
                        total = gettaDad[j].quantity * gettaDad[j].data.foodprice
                        total2 += total
                        fulltotal = total2 + getta[i].shippingfee
                        fifth += fulltotal
                    }
                    if (dateGetta.getHours() === 16) {
                        total = gettaDad[j].quantity * gettaDad[j].data.foodprice
                        total2 += total
                        fulltotal = total2 + getta[i].shippingfee
                        sixth += fulltotal
                    }
                    if (dateGetta.getHours() === 17) {
                        total = gettaDad[j].quantity * gettaDad[j].data.foodprice
                        total2 += total
                        fulltotal = total2 + getta[i].shippingfee
                        seventh += fulltotal
                    }
                    if (dateGetta.getHours() === 18) {
                        total = gettaDad[j].quantity * gettaDad[j].data.foodprice
                        total2 += total
                        fulltotal = total2 + getta[i].shippingfee
                        eighth += fulltotal
                    }
                    if (dateGetta.getHours() === 19) {
                        total = gettaDad[j].quantity * gettaDad[j].data.foodprice
                        total2 += total
                        fulltotal = total2 + getta[i].shippingfee
                        nineth += fulltotal
                    }
                    if (dateGetta.getHours() === 20) {
                        total = gettaDad[j].quantity * gettaDad[j].data.foodprice
                        total2 += total
                        fulltotal = total2 + getta[i].shippingfee
                        tenth += fulltotal
                    }
                    if (dateGetta.getHours() === 21) {
                        total = gettaDad[j].quantity * gettaDad[j].data.foodprice
                        total2 += total
                        fulltotal = total2 + getta[i].shippingfee
                        elenth += fulltotal
                    }
                    if (dateGetta.getHours() === 22) {
                        total = gettaDad[j].quantity * gettaDad[j].data.foodprice
                        total2 += total
                        fulltotal = total2 + getta[i].shippingfee
                        twelth += fulltotal
                    }
                }
            }
        }
        for (var k = 0; k < atteg.length; k++) {
            for (var h = 0; h < atteg[k].tableitems.length; h++) {
                const dateAtteg = new Date(atteg[k].tabledate)
                var total = 0, fulltotal = 0
                var attegDad = atteg[k].tableitems
                if (date.getDate() === dateAtteg.getDate()) {
                    if (dateAtteg.getHours() === 8) {
                        total = attegDad[h].quantity * attegDad[h].item.foodprice
                        fulltotal += total
                        eight2 += fulltotal
                    }
                    if (dateAtteg.getHours() === 9) {
                        total = attegDad[h].quantity * attegDad[h].item.foodprice
                        fulltotal += total
                        nine2 += fulltotal
                    }
                    if (dateAtteg.getHours() === 10) {
                        total = attegDad[h].quantity * attegDad[h].item.foodprice
                        fulltotal += total
                        ten2 += fulltotal
                    }
                    if (dateAtteg.getHours() === 11) {
                        total = attegDad[h].quantity * attegDad[h].item.foodprice
                        fulltotal += total
                        elen2 += fulltotal
                    }
                    if (dateAtteg.getHours() === 12) {
                        total = attegDad[h].quantity * attegDad[h].item.foodprice
                        fulltotal += total
                        twel2 += fulltotal
                    }
                    if (dateAtteg.getHours() === 13) {
                        total = attegDad[h].quantity * attegDad[h].item.foodprice
                        fulltotal += total
                        third2 += fulltotal
                    }
                    if (dateAtteg.getHours() === 14) {
                        total = attegDad[h].quantity * attegDad[h].item.foodprice
                        fulltotal += total
                        fourth2 += fulltotal
                    }
                    if (dateAtteg.getHours() === 15) {
                        total = attegDad[h].quantity * attegDad[h].item.foodprice
                        fulltotal += total
                        fifth2 += fulltotal
                    }
                    if (dateAtteg.getHours() === 16) {
                        total = attegDad[h].quantity * attegDad[h].item.foodprice
                        fulltotal += total
                        sixth2 += fulltotal
                    }
                    if (dateAtteg.getHours() === 17) {
                        total = attegDad[h].quantity * attegDad[h].item.foodprice
                        fulltotal += total
                        seventh2 += fulltotal
                    }
                    if (dateAtteg.getHours() === 18) {
                        total = attegDad[h].quantity * attegDad[h].item.foodprice
                        fulltotal += total
                        eighth2 += fulltotal
                    }
                    if (dateAtteg.getHours() === 19) {
                        total = attegDad[h].quantity * attegDad[h].item.foodprice
                        fulltotal += total
                        nineth2 += fulltotal
                    }
                    if (dateAtteg.getHours() === 20) {
                        total = attegDad[h].quantity * attegDad[h].item.foodprice
                        fulltotal += total
                        tenth2 += fulltotal
                    }
                    if (dateAtteg.getHours() === 21) {
                        total = attegDad[h].quantity * attegDad[h].item.foodprice
                        fulltotal += total
                        elenth2 += fulltotal
                    }
                    if (dateAtteg.getHours() === 22) {
                        total = attegDad[h].quantity * attegDad[h].item.foodprice
                        fulltotal += total
                        twelth2 += fulltotal
                    }
                }
            }
        }
        percent8 = ((eight + eight2) * 100) / 2000000
        percent9 = ((nine + nine2) * 100) / 2000000
        percent10 = ((ten + ten2) * 100) / 2000000
        percent11 = ((elen + elen2) * 100) / 2000000
        percent12 = ((twel + twel2) * 100) / 2000000
        percent13 = ((third + third2) * 100) / 2000000
        percent14 = ((fourth + fourth2) * 100) / 2000000
        percent15 = ((fifth + fifth2) * 100) / 2000000
        percent16 = ((sixth + sixth2) * 100) / 2000000
        percent17 = ((seventh + seventh2) * 100) / 2000000
        percent18 = ((eighth + eighth2) * 100) / 2000000
        percent19 = ((nineth + nineth2) * 100) / 2000000
        percent20 = ((tenth + tenth2) * 100) / 2000000
        percent21 = ((elenth + elenth2) * 100) / 2000000
        percent22 = ((twelth + twelth2) * 100) / 2000000
        const dataSendPush = []
        const dataSend = { percent8: percent8, percent9: percent9, percent10: percent10, percent11: percent11, percent12: percent12, percent13: percent13, percent14: percent14, percent15: percent15, percent16: percent16, percent17: percent17, percent18: percent18, percent19: percent19, percent20: percent20, percent21: percent21, percent22: percent22 }
        dataSendPush.push(dataSend)
        res.send({ data: dataSendPush })
    }
    catch (e) {
        console.log(e);
    }
})

//Get Income by Month
app.get("/GetIncomeMonth", async (req, res) => {
    try {
        const getIt = await getThisOrder.find({ status: 5 })
        const atteg = await GetTableHistory.find({})
        const kadate = new Date()
        const date = new Date(kadate.toLocaleString('en-VI', { timeZone: "Asia/Ho_Chi_Minh" }))
        var percent1 = 0, percent2 = 0, percent3 = 0, percent4 = 0, percent5 = 0, percent6 = 0, percent7 = 0, percent8 = 0, percent9 = 0, percent10 = 0
        var one = 0, two = 0, three = 0, four = 0, five = 0, six = 0, seven = 0, eight = 0, nine = 0, ten = 0
        var one2 = 0, two2 = 0, three2 = 0, four2 = 0, five2 = 0, six2 = 0, seven2 = 0, eight2 = 0, nine2 = 0, ten2 = 0
        for (var i = 0; i < getIt.length; i++) {
            for (var j = 0; j < getIt[i].orderitems.length; j++) {
                const getitDad = getIt[i].orderitems
                const dateGetit = new Date(getIt[i].createdAt)
                const proDate = dateGetit.getDate()
                var total = 0, fulltotal = 0
                if (date.getMonth() === dateGetit.getMonth()) {
                    if (proDate === 1 || proDate === 2 || proDate === 3) {
                        total = getitDad[j].quantity * getitDad[j].data.foodprice
                        var total2 = 0
                        total2 += total
                        fulltotal = total2 + getIt[i].shippingfee
                        one += fulltotal
                    }

                    if (proDate === 4 || proDate === 5 || proDate === 6) {
                        total = getitDad[j].quantity * getitDad[j].data.foodprice
                        var total2 = 0
                        total2 += total
                        fulltotal = total2 + getIt[i].shippingfee
                        two += fulltotal
                    }

                    if (proDate === 7 || proDate === 8 || proDate === 9) {
                        total = getitDad[j].quantity * getitDad[j].data.foodprice
                        var total2 = 0
                        total2 += total
                        fulltotal = total2 + getIt[i].shippingfee
                        three += fulltotal
                    }

                    if (proDate === 10 || proDate === 11 || proDate === 12) {
                        total = getitDad[j].quantity * getitDad[j].data.foodprice
                        var total2 = 0
                        total2 += total
                        fulltotal = total2 + getIt[i].shippingfee
                        four += fulltotal
                    }

                    if (proDate === 13 || proDate === 14 || proDate === 15) {
                        total = getitDad[j].quantity * getitDad[j].data.foodprice
                        var total2 = 0
                        total2 += total
                        fulltotal = total2 + getIt[i].shippingfee
                        five += fulltotal
                    }

                    if (proDate === 16 || proDate === 17 || proDate === 18) {
                        total = getitDad[j].quantity * getitDad[j].data.foodprice
                        var total2 = 0
                        total2 += total
                        fulltotal = total2 + getIt[i].shippingfee
                        six += fulltotal
                    }

                    if (proDate === 19 || proDate === 20 || proDate === 21) {
                        total = getitDad[j].quantity * getitDad[j].data.foodprice
                        var total2 = 0
                        total2 += total
                        fulltotal = total2 + getIt[i].shippingfee
                        seven += fulltotal
                    }

                    if (proDate === 22 || proDate === 23 || proDate === 24) {
                        total = getitDad[j].quantity * getitDad[j].data.foodprice
                        var total2 = 0
                        total2 += total
                        fulltotal = total2 + getIt[i].shippingfee
                        eight += fulltotal
                    }

                    if (proDate === 25 || proDate === 26 || proDate === 27) {
                        total = getitDad[j].quantity * getitDad[j].data.foodprice
                        var total2 = 0
                        total2 += total
                        fulltotal = total2 + getIt[i].shippingfee
                        nine += fulltotal
                    }

                    if (proDate === 28 || proDate === 29 || proDate === 30) {
                        total = getitDad[j].quantity * getitDad[j].data.foodprice
                        var total2 = 0
                        total2 += total
                        fulltotal = total2 + getIt[i].shippingfee
                        ten += fulltotal
                    }
                }
            }
        }
        for (var k = 0; k < atteg.length; k++) {
            for (var h = 0; h < atteg[k].tableitems.length; h++) {
                const attegDad = atteg[k].tableitems
                const dateAtteg = new Date(atteg[k].tabledate)
                const noobDate = dateAtteg.getDate()
                var total = 0
                if (date.getMonth() === dateAtteg.getMonth()) {
                    if (noobDate === 1 || noobDate === 2 || noobDate === 3) {
                        total = attegDad[h].quantity * attegDad[h].item.foodprice
                        var total2 = 0
                        total2 += total
                        one2 += total2
                    }

                    if (noobDate === 4 || noobDate === 5 || noobDate === 6) {
                        total = attegDad[h].quantity * attegDad[h].item.foodprice
                        var total2 = 0
                        total2 += total
                        two2 += total2
                    }

                    if (noobDate === 7 || noobDate === 8 || noobDate === 9) {
                        total = attegDad[h].quantity * attegDad[h].item.foodprice
                        var total2 = 0
                        total2 += total
                        three2 += total2
                    }

                    if (noobDate === 10 || noobDate === 11 || noobDate === 12) {
                        total = attegDad[h].quantity * attegDad[h].item.foodprice
                        var total2 = 0
                        total2 += total
                        four2 += total2
                    }

                    if (noobDate === 13 || noobDate === 14 || noobDate === 15) {
                        total = attegDad[h].quantity * attegDad[h].item.foodprice
                        var total2 = 0
                        total2 += total
                        five2 += total2
                    }

                    if (noobDate === 16 || noobDate === 17 || noobDate === 18) {
                        total = attegDad[h].quantity * attegDad[h].item.foodprice
                        var total2 = 0
                        total2 += total
                        six2 += total2
                    }

                    if (noobDate === 19 || noobDate === 20 || noobDate === 21) {
                        total = attegDad[h].quantity * attegDad[h].item.foodprice
                        var total2 = 0
                        total2 += total
                        seven2 += total2
                    }

                    if (noobDate === 22 || noobDate === 23 || noobDate === 24) {
                        total = attegDad[h].quantity * attegDad[h].item.foodprice
                        var total2 = 0
                        total2 += total
                        eight2 += total2
                    }

                    if (noobDate === 25 || noobDate === 26 || noobDate === 27) {
                        total = attegDad[h].quantity * attegDad[h].item.foodprice
                        var total2 = 0
                        total2 += total
                        nine2 += total2
                    }

                    if (noobDate === 28 || noobDate === 29 || noobDate === 30) {
                        total = attegDad[h].quantity * attegDad[h].item.foodprice
                        var total2 = 0
                        total2 += total
                        ten2 += total2
                    }
                }
            }
        }
        percent1 = ((one + one2) * 100) / 50000000
        percent2 = ((two + two2) * 100) / 50000000
        percent3 = ((three + three2) * 100) / 50000000
        percent4 = ((four + four2) * 100) / 50000000
        percent5 = ((five + five2) * 100) / 50000000
        percent6 = ((six + six2) * 100) / 50000000
        percent7 = ((seven + seven2) * 100) / 50000000
        percent8 = ((eight + eight2) * 100) / 50000000
        percent9 = ((nine + nine2) * 100) / 50000000
        percent10 = ((ten + ten2) * 100) / 50000000
        const dataSendPush = []
        const dataSend = { percent1: percent1, percent2: percent2, percent3: percent3, percent4: percent4, percent5: percent5, percent6: percent6, percent7: percent7, percent8: percent8, percent9: percent9, percent10: percent10 }
        dataSendPush.push(dataSend)
        res.send({ data: dataSendPush })
    } catch (e) {
        console.log(e);
    }
})

//Get Income by Year
app.get("/GetIncomeYear", async (req, res) => {
    try {
        const getIt = await getThisOrder.find({ status: 5 })
        const atteg = await GetTableHistory.find({})
        const kadate = new Date()
        const date = new Date(kadate.toLocaleString('en-VI', { timeZone: "Asia/Ho_Chi_Minh" }))
        var percent1 = 0, percent2 = 0, percent3 = 0, percent4 = 0, percent5 = 0, percent6 = 0, percent7 = 0, percent8 = 0, percent9 = 0, percent10 = 0, percent11 = 0, percent12 = 0
        var one = 0, two = 0, three = 0, four = 0, five = 0, six = 0, seven = 0, eight = 0, nine = 0, ten = 0, elen = 0, twel = 0
        var one2 = 0, two2 = 0, three2 = 0, four2 = 0, five2 = 0, six2 = 0, seven2 = 0, eight2 = 0, nine2 = 0, ten2 = 0, elen2 = 0, twel2 = 0
        for (var i = 0; i < getIt.length; i++) {
            for (var j = 0; j < getIt[i].orderitems.length; j++) {
                const date2Getit = new Date(getIt[i].createdAt)
                const dateGetit = date2Getit.getMonth() + 1
                const dataGetit = getIt[i].orderitems
                var total = 0, fulltotal = 0
                if (date.getFullYear() === date2Getit.getFullYear()) {
                    if (dateGetit === 1) {
                        total = dataGetit[j].quantity * dataGetit[j].data.foodprice
                        var total2 = 0
                        total2 += total
                        fulltotal = total2 + getIt[i].shippingfee
                        one += fulltotal
                    }
                    if (dateGetit === 2) {
                        total = dataGetit[j].quantity * dataGetit[j].data.foodprice
                        var total2 = 0
                        total2 += total
                        fulltotal = total2 + getIt[i].shippingfee
                        two += fulltotal
                    }
                    if (dateGetit === 3) {
                        total = dataGetit[j].quantity * dataGetit[j].data.foodprice
                        var total2 = 0
                        total2 += total
                        fulltotal = total2 + getIt[i].shippingfee
                        three += fulltotal
                    }
                    if (dateGetit === 4) {
                        total = dataGetit[j].quantity * dataGetit[j].data.foodprice
                        var total2 = 0
                        total2 += total
                        fulltotal = total2 + getIt[i].shippingfee
                        four += fulltotal
                    }
                    if (dateGetit === 5) {
                        total = dataGetit[j].quantity * dataGetit[j].data.foodprice
                        var total2 = 0
                        total2 += total
                        fulltotal = total2 + getIt[i].shippingfee
                        five += fulltotal
                    }
                    if (dateGetit === 6) {
                        total = dataGetit[j].quantity * dataGetit[j].data.foodprice
                        var total2 = 0
                        total2 += total
                        fulltotal = total2 + getIt[i].shippingfee
                        six += fulltotal
                    }
                    if (dateGetit === 7) {
                        total = dataGetit[j].quantity * dataGetit[j].data.foodprice
                        var total2 = 0
                        total2 += total
                        fulltotal = total2 + getIt[i].shippingfee
                        seven += fulltotal
                    }
                    if (dateGetit === 8) {
                        total = dataGetit[j].quantity * dataGetit[j].data.foodprice
                        var total2 = 0
                        total2 += total
                        fulltotal = total2 + getIt[i].shippingfee
                        eight += fulltotal
                    }
                    if (dateGetit === 9) {
                        total = dataGetit[j].quantity * dataGetit[j].data.foodprice
                        var total2 = 0
                        total2 += total
                        fulltotal = total2 + getIt[i].shippingfee
                        nine += fulltotal
                    }
                    if (dateGetit === 10) {
                        total = dataGetit[j].quantity * dataGetit[j].data.foodprice
                        var total2 = 0
                        total2 += total
                        fulltotal = total2 + getIt[i].shippingfee
                        ten += fulltotal
                    }
                    if (dateGetit === 11) {
                        total = dataGetit[j].quantity * dataGetit[j].data.foodprice
                        var total2 = 0
                        total2 += total
                        fulltotal = total2 + getIt[i].shippingfee
                        elen += fulltotal
                    }
                    if (dateGetit === 12) {
                        total = dataGetit[j].quantity * dataGetit[j].data.foodprice
                        var total2 = 0
                        total2 += total
                        fulltotal = total2 + getIt[i].shippingfee
                        twel += fulltotal
                    }
                }
            }
        }
        for (var h = 0; h < atteg.length; h++) {
            for (var k = 0; k < atteg[h].tableitems.length; k++) {
                const date2Atteg = new Date(atteg[i].tabledate)
                const dateAtteg = date2Atteg.getMonth() + 1
                const dataAtteg = atteg[h].tableitems
                var total = 0
                if (date.getFullYear() === date2Atteg.getFullYear()) {
                    if (dateAtteg === 1) {
                        total = dataAtteg[k].quantity * dataAtteg[k].item.foodprice
                        var total2 = 0
                        total2 += total
                        one2 += total2
                    }
                    if (dateAtteg === 2) {
                        total = dataAtteg[k].quantity * dataAtteg[k].item.foodprice
                        var total2 = 0
                        total2 += total
                        two2 += total2
                    }
                    if (dateAtteg === 3) {
                        total = dataAtteg[k].quantity * dataAtteg[k].item.foodprice
                        var total2 = 0
                        total2 += total
                        three2 += total2
                    }
                    if (dateAtteg === 4) {
                        total = dataAtteg[k].quantity * dataAtteg[k].item.foodprice
                        var total2 = 0
                        total2 += total
                        four2 += total2
                    }
                    if (dateAtteg === 5) {
                        total = dataAtteg[k].quantity * dataAtteg[k].item.foodprice
                        var total2 = 0
                        total2 += total
                        five2 += total2
                    }
                    if (dateAtteg === 6) {
                        total = dataAtteg[k].quantity * dataAtteg[k].item.foodprice
                        var total2 = 0
                        total2 += total
                        six2 += total2
                    }
                    if (dateAtteg === 7) {
                        total = dataAtteg[k].quantity * dataAtteg[k].item.foodprice
                        var total2 = 0
                        total2 += total
                        seven2 += total2
                    }
                    if (dateAtteg === 8) {
                        total = dataAtteg[k].quantity * dataAtteg[k].item.foodprice
                        var total2 = 0
                        total2 += total
                        eight2 += total2
                    }
                    if (dateAtteg === 9) {
                        total = dataAtteg[k].quantity * dataAtteg[k].item.foodprice
                        var total2 = 0
                        total2 += total
                        nine2 += total2
                    }
                    if (dateAtteg === 10) {
                        total = dataAtteg[k].quantity * dataAtteg[k].item.foodprice
                        var total2 = 0
                        total2 += total
                        ten2 += total2
                    }
                    if (dateAtteg === 11) {
                        total = dataAtteg[k].quantity * dataAtteg[k].item.foodprice
                        var total2 = 0
                        total2 += total
                        elen2 += total2
                    }
                    if (dateAtteg === 12) {
                        total = dataAtteg[k].quantity * dataAtteg[k].item.foodprice
                        var total2 = 0
                        total2 += total
                        twel2 += total2
                    }
                }
            }
        }
        percent1 = ((one + one2) * 100) / 100000000
        percent2 = ((two + two2) * 100) / 100000000
        percent3 = ((three + three2) * 100) / 100000000
        percent4 = ((four + four2) * 100) / 100000000
        percent5 = ((five + five2) * 100) / 100000000
        percent6 = ((six + six2) * 100) / 100000000
        percent7 = ((seven + seven2) * 100) / 100000000
        percent8 = ((eight + eight2) * 100) / 100000000
        percent9 = ((nine + nine2) * 100) / 100000000
        percent10 = ((ten + ten2) * 100) / 100000000
        percent11 = ((elen + elen2) * 100) / 100000000
        percent12 = ((twel + twel2) * 100) / 100000000
        const dataSendPush = []
        const dataSend = { percent1: percent1, percent2: percent2, percent3: percent3, percent4: percent4, percent5: percent5, percent6: percent6, percent7: percent7, percent8: percent8, percent9: percent9, percent10: percent10, percent11: percent11, percent12: percent12 }
        dataSendPush.push(dataSend)
        res.send({ data: dataSendPush })
    } catch (e) {
        console.log(e);
    }
})

app.post("/ChangeVnpayDate", (req, res) => {
    try {
        getThisOrder.updateOne({ _id: req.body.id }, {
            createdAt: req.body.date
        }, { timestamps: { createdAt: true } }).then(() => res.send({ data: "succeed" })).catch((err) => { console.log(err); })
    } catch (e) {
        console.log(e);
    }
})

function sortObject(obj) {
    let sorted = {};
    let str = [];
    let key;
    for (key in obj) {
        if (obj.hasOwnProperty(key)) {
            str.push(encodeURIComponent(key));
        }
    }
    str.sort();
    for (key = 0; key < str.length; key++) {
        sorted[str[key]] = encodeURIComponent(obj[str[key]]).replace(/%20/g, "+");
    }
    return sorted;
}

//Vnpay post
app.post('/VnpayCheckout', function (req, res, next) {
    let date = new Date();
    let createDate = moment(date).format('YYYYMMDDHHmmss');

    let ipAddr = req.headers['x-forwarded-for'] ||
        req.connection.remoteAddress ||
        req.socket.remoteAddress ||
        req.connection.socket.remoteAddress;

    let tmnCode = process.env.REACT_APP_vnpaytmnCode;
    let secretKey = process.env.REACT_APP_vnpaysecretKey;
    let vnpUrl = 'https://sandbox.vnpayment.vn/paymentv2/vpcpay.html';
    let returnUrl = 'https://eatcom.store/OrderComplete';
    let orderId = req.body.orderId;
    let amount = req.body.amount;
    let bankCode = req.body.bankCode;

    let locale = 'vn';
    let currCode = 'VND';
    let vnp_Params = {};
    vnp_Params['vnp_Version'] = '2.1.0';
    vnp_Params['vnp_Command'] = 'pay';
    vnp_Params['vnp_TmnCode'] = tmnCode;
    vnp_Params['vnp_Locale'] = locale;
    vnp_Params['vnp_CurrCode'] = currCode;
    vnp_Params['vnp_TxnRef'] = orderId;
    vnp_Params['vnp_OrderInfo'] = 'Thanh toan cho ma GD:' + orderId;
    vnp_Params['vnp_OrderType'] = 'other';
    vnp_Params['vnp_Amount'] = amount * 100;
    vnp_Params['vnp_ReturnUrl'] = returnUrl;
    vnp_Params['vnp_IpAddr'] = ipAddr;
    vnp_Params['vnp_CreateDate'] = createDate;
    if (bankCode !== null && bankCode !== '') {
        vnp_Params['vnp_BankCode'] = bankCode;
    }

    vnp_Params = sortObject(vnp_Params);

    let querystring = require('qs');
    let signData = querystring.stringify(vnp_Params, { encode: false });
    let crypto = require("crypto");
    let hmac = crypto.createHmac("sha512", secretKey);
    let signed = hmac.update(new Buffer.from(signData, 'utf-8')).digest("hex");
    vnp_Params['vnp_SecureHash'] = signed;
    vnpUrl += '?' + querystring.stringify(vnp_Params, { encode: false });

    res.send(vnpUrl)
});

//Vnpay Refund
app.post('/VnpayRefund', function (req, res, next) {
    let date = new Date();

    let crypto = require("crypto");

    let vnp_TmnCode = process.env.REACT_APP_vnpaytmnCode;
    let secretKey = process.env.REACT_APP_vnpaysecretKey;
    let vnp_Api = "https://sandbox.vnpayment.vn/merchant_webapi/api/transaction";
    let orderId = req.body.orderId;
    let dateX = req.body.transDate;
    let amount = req.body.amount * 100;
    let type = req.body.transType;
    let host = req.body.user;
    let reason = req.body.reason;

    let vnp_TxnRef = orderId;
    let kakaoDate = moment(dateX).format('YYYYMMDDHHmmss');
    let vnp_TransactionDate = kakaoDate;
    let vnp_Amount = amount;
    let vnp_TransactionType = type;
    let vnp_CreateBy = host

    let vnp_RequestId = moment(date).format('HHmmss');
    let vnp_Version = '2.1.0';
    let vnp_Command = 'refund';
    let vnp_OrderInfo = reason;

    let vnp_IpAddr = req.headers['x-forwarded-for'] ||
        req.connection.remoteAddress ||
        req.socket.remoteAddress ||
        req.connection.socket.remoteAddress;


    let vnp_CreateDate = moment(date).format('YYYYMMDDHHmmss');

    let vnp_TransactionNo = '0';

    let data = vnp_RequestId + "|" + vnp_Version + "|" + vnp_Command + "|" + vnp_TmnCode + "|" + vnp_TransactionType + "|" + vnp_TxnRef + "|" + vnp_Amount + "|" + vnp_TransactionNo + "|" + vnp_TransactionDate + "|" + vnp_CreateBy + "|" + vnp_CreateDate + "|" + vnp_IpAddr + "|" + vnp_OrderInfo;
    let hmac = crypto.createHmac("sha512", secretKey);
    let vnp_SecureHash = hmac.update(new Buffer.from(data, 'utf-8')).digest("hex");

    let dataObj = {
        'vnp_RequestId': vnp_RequestId,
        'vnp_Version': vnp_Version,
        'vnp_Command': vnp_Command,
        'vnp_TmnCode': vnp_TmnCode,
        'vnp_TransactionType': vnp_TransactionType,
        'vnp_TxnRef': vnp_TxnRef,
        'vnp_Amount': vnp_Amount,
        'vnp_TransactionNo': vnp_TransactionNo,
        'vnp_CreateBy': vnp_CreateBy,
        'vnp_OrderInfo': vnp_OrderInfo,
        'vnp_TransactionDate': vnp_TransactionDate,
        'vnp_CreateDate': vnp_CreateDate,
        'vnp_IpAddr': vnp_IpAddr,
        'vnp_SecureHash': vnp_SecureHash
    };

    try {
        request({
            url: vnp_Api,
            method: "POST",
            json: true,
            body: dataObj
        }, function (error, response, body) {
            res.send(response)
        });
    } catch (err) {
        console.log(err);
    }
});