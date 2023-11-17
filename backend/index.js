// Connect to MongoDB
const mongoose = require('mongoose');
// mongodb+srv://vtca123:vtca123@vtcareact.h9qlu1s.mongodb.net/?retryWrites=true&w=majority    --> Change this with connect string to access MongoDB Atlas
mongoose.connect('mongodb://127.0.0.1:27017/MongoReact').then(() => console.log('Connected To MongoDB')).catch((err) => { console.error(err); });

// Backed and express
const express = require('express');
const app = express();
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

app.listen(3000);

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

//Change Hero Image
app.post("/ChangeHeroImage", (req, res) => {
    try {
        GetUI.updateOne({ title: req.body.title, "image.name": req.body.name }, {
            "image.$.url": req.body.image
        }).then(() => { res.send({ data: "succeed" }) }).catch((err) => { console.log(err); })
    } catch (e) {
        console.log(e);
    }
})

//Change Hero Word
app.post("/ChangeWordUp", (req, res) => {
    try {
        GetUI.updateOne({ title: req.body.title }, {
            "word.up": req.body.wordup
        }).then(() => { res.send({ data: "succeed" }) }).catch((err) => { console.log(err); })
    } catch (e) {
        console.log(e);
    }
})

app.post("/ChangeWordMiddle", (req, res) => {
    try {
        GetUI.updateOne({ title: req.body.title }, {
            "word.middle": req.body.wordmiddle
        }).then(() => { res.send({ data: "succeed" }) }).catch((err) => { console.log(err); })
    } catch (e) {
        console.log(e);
    }
})

app.post("/ChangeWordDown", (req, res) => {
    try {
        GetUI.updateOne({ title: req.body.title }, {
            "word.down": req.body.worddown
        }).then(() => { res.send({ data: "succeed" }) }).catch((err) => { console.log(err); })
    } catch (e) {
        console.log(e);
    }
})

app.post("/ChangeWordTime", (req, res) => {
    try {
        GetUI.updateOne({ title: req.body.title }, {
            "word.time": req.body.wordtime
        }).then(() => { res.send({ data: "succeed" }) }).catch((err) => { console.log(err); })
    } catch (e) {
        console.log(e);
    }
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

//Update News
app.post("/UpdateNews", (req, res) => {
    try {
        GetNews.updateOne({ _id: req.body.id }, {
            title: req.body.title,
            message: req.body.message
        }).then(() => {
            res.send({ data: "succeed" })
        }).catch((err) => {
            console.log(err);
        })
    } catch (e) {
        console.log(e);
    }
})

//Delete News
app.post("/DeleteNews", (req, res) => {
    try {
        GetNews.deleteOne({ _id: req.body.id }).then(() => { res.send({ data: "succeed" }) }).catch((err) => { console.log(err); })
    } catch (e) {
        console.log(e);
    }
})

//Change Status News
app.post("/ChangeNewsStatus", (req, res) => {
    try {
        if (req.body.status === 1) {
            GetNews.updateOne({ _id: req.body.id }, {
                status: 2
            }).then(() => {
                res.send({ data: "succeed" })
            }).catch((err) => {
                console.log(err);
            })
        }
        if (req.body.status === 2) {
            GetNews.updateOne({ _id: req.body.id }, {
                status: 1
            }).then(() => {
                res.send({ data: "succeed" })
            }).catch((err) => {
                console.log(err);
            })
        }
    } catch (e) {
        console.log(e);
    }
})

//Register
app.post("/Register", (request, response) => {
    // hash the password
    bcrypt
        .hash(request.body.password, 10)
        .then((hashedPassword) => {
            // create a new user instance and collect the data
            const user = new User({
                email: request.body.email,
                password: hashedPassword,
                fullname: request.body.fullname,
                phonenumber: request.body.phone,
                role: 1,
            });

            // save the new user
            user
                .save()
                // return success if the new user is added to the database successfully
                .then((result) => {
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

//Add address user cart
app.post("/AddAddressUser", async (req, res) => {
    try {
        getUserD.updateOne({ _id: req.body.id }, {
            $push: {
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
        const getuser = await getUserD.find({ role: { $in: [req.query.type, req.query.pipe, req.query.hype] } }).sort(sort);
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

//Give Employee Task
app.post("/GiveTaskEmployee", (req, res) => {
    try {
        var id = new mongoose.Types.ObjectId().toString();
        const task = { task: req.body.task, id: id }
        getUserD.updateOne({ _id: req.body.id }, {
            $push: {
                task: task
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

//Take Employee Task
app.get("/TakeEmployeeTask", async (req, res) => {
    try {
        const getIt = await getUserD.findOne({ _id: req.query.id })
        res.send({ data: getIt })
    } catch (e) {
        console.log(e);
    }
})

//Finish Task Employee
app.post("/FinishTaskEmployee", async (req, res) => {
    try {
        const datenow = Date.now()
        const date = new Date(datenow).toLocaleDateString()
        const time = new Date(datenow).toLocaleTimeString()
        const datetime = date + " - " + time
        getUserD.updateOne({ _id: req.body.userid, "task.id": req.body.taskid }, {
            $set: {
                'task.$.task.datefinish': datetime,
                'task.$.task.status': 2
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
app.post("/ChangeImageAdmin", (req, res) => {
    const { base64 } = req.body
    try {
        getUserD.updateOne({ _id: req.body.id }, {
            userimage: base64
        }).then(() => {
            getThisMenu.updateOne({ "review.id": req.body.id }, {
                $set: {
                    "review.$.image": base64
                }
            }).then(() => {
                res.send({ data: "succeed" })
            }).catch((er) => {
                console.log(er);
            })
        }).catch((err) => {
            console.log(err);
        })
    } catch (e) {
        console.log(e);
    }
})

// Add Menu
app.post("/UploadMenu", (request, response) => {
    const { base64 } = request.body;
    // create a new user instance and collect the data
    const menu = new Menu({
        foodname: request.body.foodname,
        foodprice: request.body.foodprice,
        foodquantity: request.body.foodquantity,
        foodcategory: request.body.foodcategory,
        fooddescription: request.body.fooddescription,
        foodimage: base64
    });

    // save the new user
    menu
        .save()
        // return success if the new user is added to the database successfully
        .then((result) => {
            response.status(201).send({
                message: "User Created Successfully",
            });
        })
        // catch error if the new user wasn't added successfully to the database
        .catch((error) => {
            response.status(500).send({
                message: "Error creating user",
                error,
            });
        });
});

// Add Order
app.post("/UploadOrder", (req, res) => {
    try {
        var hype = req.body.orderitems
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
            createdAt: Date.now()
        })

        order.save()
            .then((result) => {
                res.send({ message: result._id })
            })
            .catch((error) => {
                res.status(500).send({
                    message: "Error creating user",
                    error,
                });
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

//CancelRequestFour
app.post("/CancelRequestFour", (req, res) => {
    try {
        getThisOrder.updateOne({ _id: req.body.id }, {
            status: req.body.status,
            denyreason: null
        }).then(() => { res.send({ data: "succeed" }) }).catch((err) => { console.log(err); })
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
        const getOrder = await getThisOrder.find({ status: { $in: [3, 5, 6] } }).sort(filter)
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

//Complete Order
app.post("/CompleteOrderByEmp", (req, res) => {
    try {
        if (req.body.type === 1) {
            getThisOrder.updateOne({ _id: req.body.id }, {
                completeAt: req.body.date,
                status: req.body.status,
            }).then(() => { res.send({ data: "succeed" }) }).catch((err) => { console.log(err); })
        } else if (req.body.type === 2) {
            getThisOrder.updateOne({ _id: req.body.id }, {
                completeAt: req.body.date,
                status: req.body.status,
                "paymentmethod.status": 2
            }).then(() => { res.send({ data: "succeed" }) }).catch((err) => { console.log(err); })
        }
    } catch (e) {
        console.log(e);
    }
})

//total deny
app.post("/totaldenyNow", (req, res) => {
    try {
        getThisOrder.updateOne({ _id: req.body.id }, {
            status: req.body.status,
            employee: req.body.employee
        }).then(() => { res.send({ data: "succeed" }) }).catch((err) => { console.log(err); })
    } catch (e) {
        console.log(e);
    }
})

app.get("/GetAllOrderActive", async (req, res) => {
    const filter = { status: -1, datetime: -1 }
    try {
        const getOrder = await getThisOrder.find({ status: { $in: [1, 2, 4] } }).sort(filter)
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

//Update status order
app.post("/UpdateStatusOrder", (req, res) => {
    try {
        var hype = req.body.orderitems
        getThisOrder.updateOne({ _id: req.body.id }, {
            status: req.body.status,
            employee: req.body.employee
        }).then(() => {
            hype.forEach(item => {
                getThisMenu.updateOne({ _id: item.data._id }, {
                    $inc: {
                        foodquantity: -item.quantity
                    }
                }).then(() => {
                    res.send({ message: "succeed" })
                }).catch((err) => {
                    console.log(err);
                })
            })
        }).catch((err) => {
            console.log(err);
        })
    } catch (e) {
        console.log(e);
    }
})

//Deny Order status
app.post("/DenyOrder", (req, res) => {
    try {
        getThisOrder.updateOne({ _id: req.query.id }, {
            denyreason: req.query.reason,
            $push: {
                employee: req.query.employee
            },
            status: req.query.status
        }).then(() => {
            res.send({ data: "Updated" })
        }).catch((err) => {
            console.log(err);
        })
    } catch (e) {
        console.log(e);
    }
})

//Cancel Vnpay payment
app.post("/CancelVnpayPayment", (req, res) => {
    try {
        getThisOrder.updateOne({ _id: req.query.id }, {
            denyreason: req.query.reason,
            status: 4,
            "paymentmethod.type": "Vnpay"
        }).then(() => {
            res.send({ data: "Updated" })
        }).catch((err) => {
            console.log(err);
        })
    } catch (e) {
        console.log(e);
    }
})

//Paid Vnpay
app.post("/PaidVnpayPayment", (req, res) => {
    try {
        getThisOrder.updateOne({ _id: req.query.id }, {
            "paymentmethod.status": 2,
            "paymentmethod.type": "Vnpay"
        }).then(() => {
            res.send({ data: "Updated" })
        }).catch((err) => {
            console.log(err);
        })
    } catch (e) {
        console.log(e);
    }
})

//Paid Paypal
app.post("/PaidPaypalPayment", (req, res) => {
    try {
        getThisOrder.updateOne({ _id: req.query.id }, {
            "paymentmethod.status": 2,
            "paymentmethod.type": "Paypal"
        }).then(() => {
            res.send({ data: "Updated" })
        }).catch((err) => {
            console.log(err);
        })
    } catch (e) {
        console.log(e);
    }
})

//Paid Cod
app.post("/PaidCodPayment", (req, res) => {
    try {
        getThisOrder.updateOne({ _id: req.query.id }, {
            "paymentmethod.type": "COD"
        }).then(() => {
            res.send({ data: "Updated" })
        }).catch((err) => {
            console.log(err);
        })
    } catch (e) {
        console.log(e);
    }
})

//Cancel by Mag
app.post("/CancelByMag", (req, res) => {
    try {
        getThisOrder.updateOne({ _id: req.query.id }, {
            denyreason: "Canceled by manager.",
            status: 6
        }).then(() => {
            res.send({ data: "Updated" })
        }).catch((err) => {
            console.log(err);
        })
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
            getUserD.updateOne({ _id: req.body.updateid },
                {
                    email: req.body.updateemail,
                    password: hashed,
                    fullname: req.body.updatefullname,
                    phonenumber: req.body.updatephone,
                    userimage: base64
                }
            ).then(() => {
                getThisMenu.updateOne({ "review.id": req.body.updateid }, {
                    $set: {
                        "review.$.image": base64
                    }
                }).then(() => {
                    res.send({ data: "succeed" })
                }).catch((er) => {
                    console.log(er);
                })
            }).catch((err) => {
                res.send({ data: err })
            })
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
        res.send({ data: getIt, quantity: req.query.quantity });
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

//Get Search
app.get("/GetSearch", async (req, res) => {
    try {
        const regex = new RegExp(req.query.foodSearch, 'i')
        var getSearch = null
        switch (req.query.filter) {
            case "nto":
                const sort = { _id: -1 }
                getSearch = await getThisMenu.find({ foodname: regex }).sort(sort);
                break;
            case "otn":
                const sort2 = { _id: 1 }
                getSearch = await getThisMenu.find({ foodname: regex }).sort(sort2);
                break;
            case "hpf":
                const sort3 = { foodprice: -1 }
                getSearch = await getThisMenu.find({ foodname: regex }).sort(sort3);
                break;
            case "lpf":
                const sort4 = { foodprice: 1 }
                getSearch = await getThisMenu.find({ foodname: regex }).sort(sort4);
                break;
            case "atz":
                const sort5 = { foodname: 1 }
                getSearch = await getThisMenu.find({ foodname: regex }).sort(sort5);
                break;
            default:
                const sort6 = { _id: -1 }
                getSearch = await getThisMenu.find({ foodname: regex }).sort(sort6);
                break;
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

//Get Category Menu
app.get("/GetCategoryMenu", async (req, res) => {
    try {
        var getIta = null
        switch (req.query.filter) {
            case "nto":
                const sort = { _id: -1 }
                getIta = await getThisMenu.find({ foodcategory: req.query.category }).sort(sort);
                break;
            case "otn":
                const sort2 = { _id: 1 }
                getIta = await getThisMenu.find({ foodcategory: req.query.category }).sort(sort2);
                break;
            case "hpf":
                const sort3 = { foodprice: -1 }
                getIta = await getThisMenu.find({ foodcategory: req.query.category }).sort(sort3);
                break;
            case "lpf":
                const sort4 = { foodprice: 1 }
                getIta = await getThisMenu.find({ foodcategory: req.query.category }).sort(sort4);
                break;
            case "atz":
                const sort5 = { foodname: 1 }
                getIta = await getThisMenu.find({ foodcategory: req.query.category }).sort(sort5);
                break;
            default:
                getIta = await getThisMenu.find({ foodcategory: req.query.category }).sort(sort);
                break;
        }

        const page = parseInt(req.query.page)
        const limit = parseInt(req.query.limit)

        const start = (page - 1) * limit
        const end = page * limit

        const results = {}
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
        getThisMenu.deleteOne({ _id: req.query.deleteid }).then(() => {
            res.send({ data: "Deleted" })
        }).catch((err) => {
            res.send({ data: err })
        })
    } catch (e) {
        console.log(e);
    }
})

//Update Menu
app.post("/UpdateMenu", async (req, res) => {
    const { base64 } = req.body;
    try {
        getThisMenu.updateOne({ _id: req.body.updateid },
            {
                foodname: req.body.updatename,
                foodprice: req.body.updateprice,
                foodquantity: req.body.updatequantity,
                foodcategory: req.body.updatecategory,
                fooddescription: req.body.updatedescription,
                foodimage: base64
            }
        ).then(() => {
            res.send({ data: "Updated" })
        }).catch((err) => {
            res.send({ data: err })
        })
    } catch (e) {
        console.log(e);
    }
})

//Add Contact
app.post("/AddContact", (req, res) => {
    try {
        const contact = new Contact({
            name: req.body.name,
            email: req.body.email,
            title: req.body.title,
            message: req.body.message
        });

        contact.save().then(() => {
            res.status(201).send({
                message: "Successfully",
            });
        })
            .catch((error) => {
                response.status(500).send({
                    message: "Error",
                    error,
                });
            });

    } catch (e) {
        console.log(e);
    }
})

app.post("/DeleteContact", (req, res) => {
    try {
        getContactNow.deleteOne({ _id: req.body.id }).then(() => { res.send({ data: "succeed" }) }).catch((err) => { console.log(err); })
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

app.post("/AddNewBooking", (req, res) => {
    try {
        const booking = new Booking({
            customer: req.body.customer,
            date: req.body.date,
            people: req.body.people,
            status: 1,
            message: req.body.message
        })

        booking.save().then(() => {
            res.status(201).send({
                message: "Table Created Successfully",
            });
        })
            // catch error if the new user wasn't added successfully to the database
            .catch(() => {
                res.status(500).send({
                    message: "Phone have already Exists!"
                });
            });
    } catch (e) {
        console.log(e);
    }
})

//Deny Booking
app.post("/DenyBookingCustomer", (req, res) => {
    try {
        GetBooking.updateOne({ _id: req.body.id }, {
            status: req.body.status,
            denyreason: req.body.denyreason,
            employee: req.body.employee
        }).then(() => {
            res.send({ data: "succeed" })
        }).catch((err) => {
            console.log(err);
        })
    } catch (e) {
        console.log(e);
    }
})

//Cancel Booking
app.post("/CancelBooking", (req, res) => {
    try {
        GetBooking.updateOne({ _id: req.body.id }, {
            status: 5,
            denyreason: req.body.reason
        }).then(() => {
            res.send({ data: "succeed" })
        }).catch((err) => {
            console.log(err);
        })
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

//QR Code Access Table
app.post("/QrCodeTableActive", (req, res) => {
    try {
        GetTable.updateOne({ _id: req.body.id }, {
            customerid: req.body.cusid,
            tablestatus: 2,
            tabledate: Date.now()
        }).then(() => {
            res.send({ data: "succeed" })
        }).catch((err) => {
            console.log(err);
        })
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

//Checkout 4 Qr
app.post("/Checkout4QrYeah", (req, res) => {
    try {
        GetTable.updateOne({ _id: req.query.id }, {
            tablestatus: 3
        }).then(() => {
            res.send({ data: "succeed" })
        }).catch((err) => {
            console.log(err);
        })
    }
    catch (e) {
        console.log(e);
    }
})

//Add Table by hand
app.post("/AddTableByHand", (req, res) => {
    try {
        const table = new Table({
            tablename: req.body.tablename,
            tablestatus: 1
        })
        table.save().then(() => {
            res.send({ data: "succeed" })
        }).catch((e) => {
            console.log(e);
        })
    } catch (e) {
        console.log(e);
    }
})

//Change Table Name
app.post("/ChangeTableNameQuick", (req, res) => {
    try {
        GetTable.updateOne({ _id: req.body.id }, {
            tablename: req.body.name
        }).then(() => {
            res.send({ data: "succeed" })
        }).catch((err) => {
            console.log(err);
        })
    } catch (e) {
        console.log(e);
    }
})

//Delete Table by manager
app.post("/DeleteTableNow", (req, res) => {
    try {
        GetTable.deleteOne({ _id: req.body.id }).then(() => { res.send({ data: "succeed" }) }).catch((err) => { console.log(err); })
    } catch (e) {
        console.log(e);
    }
})

//Change Table
app.post("/ChangeTableNow", (req, res) => {
    try {
        GetTable.updateOne({ _id: req.body.newid }, {
            customerid: req.body.cusid,
            tableitems: req.body.items,
            tabledate: req.body.date,
            tablestatus: 2
        }).then(() => {
            GetTable.updateOne({ _id: req.body.oldid }, {
                customerid: null,
                tableitems: [],
                tabledate: null,
                tablestatus: 1
            }).then(() => {
                res.send({ data: "succeed" })
            }).catch((er) => {
                console.log(er);
            })
        }).catch((err) => {
            console.log(err);
        })
    } catch (e) {
        console.log(e);
    }
})

//Add Table when booking
app.post("/AddTableCustomer", (req, res) => {
    try {
        const dddd = Date.now()
        const dddda = new Date(dddd)
        GetTable.updateOne({ _id: req.body.tableid }, {
            customerid: req.body.cusid,
            tablestatus: 2,
            tabledate: dddda
        }).then(() => {
            GetBooking.updateOne({ _id: req.body.cusid }, {
                table: req.body.tablename,
                status: 2
            }).then(() => {
                res.send({ data: "succeed" })
            }).catch((e) => {
                console.log(e);
            })
        }).catch((err) => {
            console.log(err);
        })
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

//Add item to table
app.post("/AddItemToTable", async (req, res) => {
    const findDup = await GetTable.findOne({ _id: req.body.tableid, tableitems: { $elemMatch: { "item.foodname": req.body.foodname } } })
    try {
        const dddd = Date.now()
        const dddda = new Date(dddd)
        if (findDup) {
            GetTable.updateOne({ _id: req.body.tableid, "tableitems.item.foodname": req.body.foodname },
                {
                    $inc: {
                        "tableitems.$.quantity": req.body.quantity,
                    },
                    $set: {
                        "tableitems.$.status": 1
                    }
                }).then(() => {
                    if (req.body.statusCheck === 1) {
                        findDup.updateOne({ _id: req.body.tableid }, {
                            tabledate: dddda,
                            tablestatus: 2
                        }).then(() => {
                            res.send({ data: { foodname: req.body.foodname, quantity: req.body.quantity } })
                        }).catch((e) => {
                            console.log(e);
                        })
                    } else {
                        res.send({ data: { foodname: req.body.foodname, quantity: req.body.quantity } })
                    }
                }).catch((er) => {
                    console.log(er);
                })
        } else {
            GetTable.updateOne({ _id: req.body.tableid },
                {
                    $push: {
                        tableitems: req.body.item
                    }
                }).then(() => {
                    if (req.body.statusCheck === 1) {
                        GetTable.updateOne({ _id: req.body.tableid }, {
                            tabledate: dddda,
                            tablestatus: 2
                        }).then(() => {
                            res.send({ data: { foodname: req.body.foodname, quantity: req.body.quantity } })
                        }).catch((e) => {
                            console.log(e);
                        })
                    } else {
                        res.send({ data: { foodname: req.body.foodname, quantity: req.body.quantity } })
                    }
                }).catch((er) => {
                    console.log(er);
                })
        }
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

//delete item Qr 
app.post("/DeleteQritem", async (req, res) => {
    try {
        const getIt = await GetTable.findOne({ _id: req.body.tableid, "tableitems.item.foodname": req.body.foodname }).then((resa) => { return resa })
        for (var i = 0; i < getIt.tableitems?.length; i++) {
            var item = getIt.tableitems[i]
            if (req.body.quantity >= item.quantity) {
                GetTable.updateOne({ _id: req.body.tableid, "tableitems.item.foodname": req.body.foodname }, {
                    $pull: {
                        tableitems: {
                            item: req.body.item.item
                        }
                    }
                }).exec()
            } else {
                GetTable.updateOne({ _id: req.body.tableid, "tableitems.item.foodname": req.body.foodname }, {
                    $inc: {
                        "tableitems.$.quantity": -parseInt(req.body.quantity),
                    },
                }).exec()
            }
        }
        res.send({ data: "succeed" })
    } catch (e) {
        console.log(e);
    }
})

//Checkout for booking
app.post("/Checkout4Booking", (req, res) => {
    try {
        GetBooking.updateOne({ _id: req.body.id }, {
            status: 3,
            fulltotal: req.body.fulltotal,
            employee: req.body.employee
        }).then(() => {
            var hype = req.body.TbItemHistory
            const tbhistory = new TableHistory({
                customerid: req.body.Idhistory,
                tablename: req.body.TbnameHistory,
                tableitems: hype,
                tabledate: req.body.TbDateHistory,
                datefinish: Date.now(),
                employee: req.body.employee
            })
            tbhistory.save().then(() => {
                GetTable.updateOne({ _id: req.body.tableid }, {
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
                        }).then(() => {
                            res.send({ message: "succeed" })
                        }).catch((err) => {
                            console.log(err);
                        })
                    })
                }).catch((err) => {
                    console.log(err);
                })
            }).catch((erro) => {
                console.log(erro);
            })
        }).catch((e) => {
            console.log(e);
        })
    } catch (e) {
        console.log(e);
    }
})

//Checkout for normal
app.post("/Checkout4Normal", async (req, res) => {
    try {
        var hype = req.body.TbItemHistory
        const historytb = new TableHistory({
            tablename: req.body.TbnameHistory,
            tableitems: hype,
            tabledate: req.body.TbDateHistory,
            datefinish: Date.now(),
            employee: req.body.employee
        })
        historytb.save().then(() => {
            GetTable.updateOne({ _id: req.body.id }, {
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
                res.send({ data: "succeed" })
            }).catch((er) => {
                console.log(er);
            })
        }).catch((err) => {
            console.log(err);
        })
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
        const date = new Date()
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
                        elenth
                    }
                    if (dateGetta.getHours() === 22) {
                        total = gettaDad[j].quantity * gettaDad[j].data.foodprice
                        total2 += total
                        fulltotal = total2 + getta[i].shippingfee
                        twelth
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
        const date = new Date()
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
        const date = new Date()
        var percent1 = 0, percent2 = 0, percent3 = 0, percent4 = 0, percent5 = 0, percent6 = 0, percent7 = 0, percent8 = 0, percent9 = 0, percent10 = 0, percent11 = 0, percent12 = 0
        var one = 0, two = 0, three = 0, four = 0, five = 0, six = 0, seven = 0, eight = 0, nine = 0, ten = 0, elen = 0, twel = 0
        var one2 = 0, two2 = 0, three2 = 0, four2 = 0, five2 = 0, six2 = 0, seven2 = 0, eight2 = 0, nine2 = 0, ten2 = 0, elen2 = 0, twel2 = 0
        for (var i = 0; i < getIt.length; i++) {
            for (var j = 0; j < getIt[i].orderitems.length; j++) {
                const dateGetit = new Date(getIt[i].createdAt)
                const dataGetit = getIt[i].orderitems
                var total = 0, fulltotal = 0
                if (date.getFullYear() === dateGetit.getFullYear()) {
                    if (dateGetit.getMonth() === 1) {
                        total = dataGetit[j].quantity * dataGetit[j].data.foodprice
                        var total2 = 0
                        total2 += total
                        fulltotal = total2 + getIt[i].shippingfee
                        one += fulltotal
                    }
                    if (dateGetit.getMonth() === 2) {
                        total = dataGetit[j].quantity * dataGetit[j].data.foodprice
                        var total2 = 0
                        total2 += total
                        fulltotal = total2 + getIt[i].shippingfee
                        two += fulltotal
                    }
                    if (dateGetit.getMonth() === 3) {
                        total = dataGetit[j].quantity * dataGetit[j].data.foodprice
                        var total2 = 0
                        total2 += total
                        fulltotal = total2 + getIt[i].shippingfee
                        three += fulltotal
                    }
                    if (dateGetit.getMonth() === 4) {
                        total = dataGetit[j].quantity * dataGetit[j].data.foodprice
                        var total2 = 0
                        total2 += total
                        fulltotal = total2 + getIt[i].shippingfee
                        four += fulltotal
                    }
                    if (dateGetit.getMonth() === 5) {
                        total = dataGetit[j].quantity * dataGetit[j].data.foodprice
                        var total2 = 0
                        total2 += total
                        fulltotal = total2 + getIt[i].shippingfee
                        five += fulltotal
                    }
                    if (dateGetit.getMonth() === 6) {
                        total = dataGetit[j].quantity * dataGetit[j].data.foodprice
                        var total2 = 0
                        total2 += total
                        fulltotal = total2 + getIt[i].shippingfee
                        six += fulltotal
                    }
                    if (dateGetit.getMonth() === 7) {
                        total = dataGetit[j].quantity * dataGetit[j].data.foodprice
                        var total2 = 0
                        total2 += total
                        fulltotal = total2 + getIt[i].shippingfee
                        seven += fulltotal
                    }
                    if (dateGetit.getMonth() === 8) {
                        total = dataGetit[j].quantity * dataGetit[j].data.foodprice
                        var total2 = 0
                        total2 += total
                        fulltotal = total2 + getIt[i].shippingfee
                        eight += fulltotal
                    }
                    if (dateGetit.getMonth() === 9) {
                        total = dataGetit[j].quantity * dataGetit[j].data.foodprice
                        var total2 = 0
                        total2 += total
                        fulltotal = total2 + getIt[i].shippingfee
                        nine += fulltotal
                    }
                    if (dateGetit.getMonth() === 10) {
                        total = dataGetit[j].quantity * dataGetit[j].data.foodprice
                        var total2 = 0
                        total2 += total
                        fulltotal = total2 + getIt[i].shippingfee
                        ten += fulltotal
                    }
                    if (dateGetit.getMonth() === 11) {
                        total = dataGetit[j].quantity * dataGetit[j].data.foodprice
                        var total2 = 0
                        total2 += total
                        fulltotal = total2 + getIt[i].shippingfee
                        elen += fulltotal
                    }
                    if (dateGetit.getMonth() === 12) {
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
                const dateAtteg = new Date(atteg[i].tabledate)
                const dataAtteg = atteg[h].tableitems
                var total = 0
                if (date.getFullYear() === dateAtteg.getFullYear()) {
                    if (dateAtteg.getMonth() === 1) {
                        total = dataAtteg[k].quantity * dataAtteg[k].item.foodprice
                        var total2 = 0
                        total2 += total
                        one2 += total2
                    }
                    if (dateAtteg.getMonth() === 2) {
                        total = dataAtteg[k].quantity * dataAtteg[k].item.foodprice
                        var total2 = 0
                        total2 += total
                        two2 += total2
                    }
                    if (dateAtteg.getMonth() === 3) {
                        total = dataAtteg[k].quantity * dataAtteg[k].item.foodprice
                        var total2 = 0
                        total2 += total
                        three2 += total2
                    }
                    if (dateAtteg.getMonth() === 4) {
                        total = dataAtteg[k].quantity * dataAtteg[k].item.foodprice
                        var total2 = 0
                        total2 += total
                        four2 += total2
                    }
                    if (dateAtteg.getMonth() === 5) {
                        total = dataAtteg[k].quantity * dataAtteg[k].item.foodprice
                        var total2 = 0
                        total2 += total
                        five2 += total2
                    }
                    if (dateAtteg.getMonth() === 6) {
                        total = dataAtteg[k].quantity * dataAtteg[k].item.foodprice
                        var total2 = 0
                        total2 += total
                        six2 += total2
                    }
                    if (dateAtteg.getMonth() === 7) {
                        total = dataAtteg[k].quantity * dataAtteg[k].item.foodprice
                        var total2 = 0
                        total2 += total
                        seven2 += total2
                    }
                    if (dateAtteg.getMonth() === 8) {
                        total = dataAtteg[k].quantity * dataAtteg[k].item.foodprice
                        var total2 = 0
                        total2 += total
                        eight2 += total2
                    }
                    if (dateAtteg.getMonth() === 9) {
                        total = dataAtteg[k].quantity * dataAtteg[k].item.foodprice
                        var total2 = 0
                        total2 += total
                        nine2 += total2
                    }
                    if (dateAtteg.getMonth() === 10) {
                        total = dataAtteg[k].quantity * dataAtteg[k].item.foodprice
                        var total2 = 0
                        total2 += total
                        ten2 += total2
                    }
                    if (dateAtteg.getMonth() === 11) {
                        total = dataAtteg[k].quantity * dataAtteg[k].item.foodprice
                        var total2 = 0
                        total2 += total
                        elen2 += total2
                    }
                    if (dateAtteg.getMonth() === 12) {
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

    let tmnCode = 'RRRERL87';
    let secretKey = 'MCBPYCKVGLDVYBBLNKLNFAHKGGHVGIOR';
    let vnpUrl = 'https://sandbox.vnpayment.vn/paymentv2/vpcpay.html';
    let returnUrl = 'http://localhost:3001/OrderComplete';
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

    let vnp_TmnCode = 'RRRERL87';
    let secretKey = 'MCBPYCKVGLDVYBBLNKLNFAHKGGHVGIOR';
    let vnp_Api = "https://sandbox.vnpayment.vn/merchant_webapi/api/transaction";

    let vnp_TxnRef = req.body.orderId;
    let kakaoDate = moment(req.body.transDate).format('YYYYMMDDHHmmss');
    let vnp_TransactionDate = kakaoDate;
    let vnp_Amount = req.body.amount * 100;
    let vnp_TransactionType = req.body.transType;
    let vnp_CreateBy = req.body.user;

    let vnp_RequestId = moment(date).format('HHmmss');
    let vnp_Version = '2.1.0';
    let vnp_Command = 'refund';
    let vnp_OrderInfo = req.body.reason;

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