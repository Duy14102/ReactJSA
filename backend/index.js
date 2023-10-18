// Connect to MongoDB
const mongoose = require('mongoose');
mongoose.connect('mongodb://127.0.0.1:27017/MongoReact', {
    useNewUrlParser: true,
    useUnifiedTopology: true
},).then(() => console.log('Connected To MongoDB')).catch((err) => { console.error(err); });

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

// Register
const bcrypt = require("bcrypt");
const User = require("./model/Users");
const getUserD = mongoose.model("Users");
const TableHistory = require("./model/TableHistory");
const GetTableHistory = mongoose.model("TableHistory");


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
                role: 2,
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
const jwt = require('jsonwebtoken');

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
                            message: "Passwords does not match",
                            error,
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

//Get User Data
app.get("/GetAllUser", async (req, res) => {
    const sort = { role: -1 }
    try {
        const getuser = await getUserD.find().sort(sort);
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
        var id = new mongoose.Types.ObjectId();
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
        // const geta = getUserD.findOneAndUpdate({ _id: req.body.userid, "task.id": req.body.taskid }, {
        //     $set: {
        //         'task.$.task.datefinish': datetime,
        //         'task.$.task.status': 2
        //     }
        // }).then(() => {
        //     res.send({ data: geta })
        // }).catch((err) => {
        //     console.log(err);
        // })
        const getta = await getUserD.findOne({ _id: req.body.userid })
        if (getta) {
            res.send({ data: getta })
        }
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
const Menu = require('./model/Menu');
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
const Order = require('./model/Order');
app.post("/UploadOrder", (req, res) => {
    try {
        var hype = req.body.orderitems
        const order = new Order({
            user: req.body.user,
            phonenumber: req.body.phonenumber,
            address: req.body.address,
            paymentmethod: req.body.paymentmethod,
            shippingfee: req.body.shippingfee,
            status: 1,
            orderitems: hype
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
const getThisOrder = mongoose.model("Orders");
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

//Get all order
app.get("/GetAllOrderHistory", async (req, res) => {
    const filter = { datetime: -1 }
    try {
        const getOrder = await getThisOrder.find({ status: { $in: [2, 3, 4] } }).sort(filter)
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
    const filter = { datetime: -1 }
    try {
        const getOrder = await getThisOrder.find({ status: 1 }).sort(filter)
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

//Get Menu
const getThisMenu = mongoose.model("Menu");
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



app.get("/GetThisMenu", async (req, res) => {
    try {
        const getIt = await getThisMenu.find({ foodcategory: req.query.Name });
        res.send({ data: getIt });
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
        const getSearch = await getThisMenu.find({ foodname: regex })
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

//Get Category Menu
app.get("/GetCategoryMenu", async (req, res) => {
    try {
        const getIt = await getThisMenu.find({ foodcategory: req.query.category });

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
const Contact = require("./model/Contact");
const getContactNow = mongoose.model("Contact");
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

const Booking = require("./model/Booking");
const GetBooking = mongoose.model("Booking");
app.post("/AddNewBooking", (req, res) => {
    try {
        const booking = new Booking({
            name: req.body.name,
            phone: req.body.phone,
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
            .catch((error) => {
                res.status(500).send({
                    message: "Error creating table",
                    error,
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

//Get Booking By Status
app.get("/GetBookingByStatus", async (req, res) => {
    try {
        const getIt = await GetBooking.find({ status: 1 });
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
        const getIt = await GetBooking.find({ status: { $in: [3, 4] } });
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

const Table = require("./model/Table");
const GetTable = mongoose.model("Table");
app.get("/GetAllTableActive", async (req, res) => {
    try {
        const getSome = await GetTable.find({ tablestatus: 1 })
        res.send({ data: getSome })
    } catch (e) {
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
    const findDup = await GetTable.find({ _id: req.body.tableid }, { tableitems: { $elemMatch: { "item.foodname": req.body.foodname } } })
    try {
        const dddd = Date.now()
        const dddda = new Date(dddd)
        if (req.body.statusCheck === 1) {
            GetTable.updateOne({ _id: req.body.tableid }, {
                tabledate: dddda,
                tablestatus: 2
            }).then(() => {
                res.send({ data: "succeed" })
            }).catch((e) => {
                console.log(e);
            })
        }
        for (var i = 0; i < findDup.length; i++) {
            if (findDup[i].tableitems.length > 0) {
                GetTable.updateOne({ _id: req.body.tableid, "tableitems.item.foodname": req.body.foodname },
                    {
                        $inc: {
                            "tableitems.$.quantity": parseInt(req.body.quantity)
                        }
                    }).then(() => {
                        res.send({ data: "succeed" })
                    }).catch((e) => {
                        console.log(e);
                    })
            } else {
                GetTable.updateOne({ _id: req.body.tableid },
                    {
                        $push: {
                            tableitems: req.body.item
                        }
                    }).then(() => {
                        res.send({ data: "succeed" })
                    }).catch((e) => {
                        console.log(e);
                    })
            }
        }
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
app.post("/Checkout4Normal", (req, res) => {
    try {
        var hype = req.body.TbItemHistory
        const historytb = new TableHistory({
            tablename: req.body.TbnameHistory,
            tableitems: hype,
            tabledate: req.body.TbDateHistory,
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
        const getUserLength = await getUserD.find({ role: 1 })
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